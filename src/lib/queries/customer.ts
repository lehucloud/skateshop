import "server-only"
import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { CustomUser, orders, products, stores, users } from "@/db/schema"
// import { currentUser } from "@clerk/nextjs/server"
import { and, count, countDistinct, desc, eq, gte, lte, sum } from "drizzle-orm"


export async function getCustomers(input: {
    storeId: string
    limit: number
    offset: number
    fromDay?: Date
    toDay?: Date
}):Promise<{
    data:CustomUser[],
    pageCount:number
}> {
    noStore()

    try {
        const transaction = await db.transaction(async (tx) => {
            const { storeId, limit, offset, fromDay, toDay } = input

            // Base condition for filtering
            const whereConditions = []
            
            // Add date range conditions if provided
            if (fromDay && toDay) {
                whereConditions.push(
                    gte(users.createdAt, fromDay),
                    lte(users.createdAt, toDay)
                )
            }

            // Add store ID condition
            whereConditions.push(eq(orders.storeId, storeId))

            const customers = await tx
                .select({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                    emailVerified: users.emailVerified,
                    image: users.image,
                    phone: users.phone,
                    phoneVerified: users.phoneVerified,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .leftJoin(orders, eq(orders.storeId, storeId))
                .where(and(...whereConditions))
                .groupBy(users.id)
                .orderBy(desc(users.createdAt))
                .limit(limit)
                .offset(offset)

            const customerCount = await tx
                .select({
                    count: countDistinct(users.id),
                })
                .from(users)
                .leftJoin(orders, eq(orders.storeId, storeId))
                .where(and(...whereConditions))
                .execute()
                .then((res) => res[0]?.count ?? 0)
                
                return {
                    data: customers as CustomUser[],
                    pageCount: customerCount,
                }
        })
        
        return transaction
    } catch (err) {
        console.error("Error fetching customers:", err)
        return {
            data: [],
            pageCount: 0,
        }
    }
}