import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Wechat from "@/lib/wechat"
import Credentials from "next-auth/providers/credentials"

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {  accounts, sessions, users, verificationTokens } from "../db/schema/auth"
import { db } from "../db/index"

import { eq } from "drizzle-orm"

class EmailNotVerifiedError extends CredentialsSignin {
    code = "email_not_verified"
}

class UserNotFoundError extends CredentialsSignin {
    code = "sginup"
}

export const { handlers, auth , signIn} = NextAuth({
    debug: true,
    adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    }),
    providers: [
        Github({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Wechat({
            platformType:"OfficialAccount",
        }),
        Credentials({
            credentials:{
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }                
            },
            async authorize(credentials) {
                
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码");
                }

                const user = await db.query.users.findFirst({
                    columns: {
                        id:true,
                        email: true,
                        emailVerified: true,
                        name:true,
                        image:true,
                        phone:true,
                        phoneVerified:true,
                        role:true,
                        permissions:true,
                        meta:true,
                    },
                    where: eq(users.email, credentials.email as string)
                })
                .then(item=>{
                    if(!item){
                        return null;
                    }
                    const newUser = {
                        ...item,
                        permissions: item?.permissions ?? [],
                        meta: item?.meta ?? {},
                        role: item?.role ?? undefined,
                        emailVerified: item?.emailVerified ?? undefined,
                        phoneVerified: item?.phoneVerified ?? undefined,
                    }
                    return newUser;
                });

                if(!user){
                    throw new UserNotFoundError;
                }
                
                // const isPasswordValid = await bcrypt.compare(
                //     credentials.password,
                //     user.password as string
                // );

                // if (!isPasswordValid) {
                //     throw new CredentialsSignin("PasswordNotMatch", {message:"密码错误"});
                // }
                // if (!user.emailVerified) {
                //         throw new EmailNotVerifiedError;
                // }

                return user;
            }
        })
    ],
    events: {
        async signIn(message) {
                // 记录成功登录事件
                console.log("User signed in:", message.user.email)
            },
            async signOut(message) {
                // 记录登出事件
                console.log("User signed out:", "")
            }
    },
    callbacks: {
        async signIn ({ user, account, profile, email, credentials })  {
            return true            
        },
        async session({ session, user, token }) {
            session.user.id = token.id ?? "";
            session.user.role = token.role ?? "";
            return session;
        },
        async jwt({ token, user, account, profile ,session}) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout",
        error: "/error", // Error code passed in query string as ?error=
        verifyRequest: "/signup/verify-email", // (used for check email message)
        newUser: "/new-user" // New users will be directed here on first sign in (leave the property out if not of interest)
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    
})

