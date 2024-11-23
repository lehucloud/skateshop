'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const getErrorMessage = (error: string | null) => {
    switch (error) {
        case 'Configuration':
            return 'There is a problem with the server configuration.';
        case 'AccessDenied':
            return 'You do not have permission to sign in.';
        case 'Verification':
            return 'The verification token has expired or has already been used.';
        case 'OAuthSignin':
            return 'Error in constructing an authorization URL.';
        case 'OAuthCallback':
            return 'Error in handling the response from an OAuth provider.';
        case 'OAuthCreateAccount':
            return 'Could not create OAuth provider user in the database.';
        case 'EmailCreateAccount':
            return 'Could not create email provider user in the database.';
        case 'Callback':
            return 'Error in the OAuth callback handler route.';
        case 'OAuthAccountNotLinked':
            return 'Email on the account already exists with different credentials.';
        case 'EmailSignin':
            return 'Check your email address.';
        case 'CredentialsSignin':
            return 'Sign in failed. Check the details you provided are correct.';
        case 'SessionRequired':
            return 'Please sign in to access this page.';
        default:
            return 'An unexpected error occurred. Please try again later.';
    }
};

const AuthErrorPage = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorMessage = getErrorMessage(error);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="w-full flex justify-center mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-2xl font-bold">Authentication Error</CardTitle>
                </CardHeader>

                <CardContent>
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error Type: {error}</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>

                    <p className="text-sm text-gray-500 text-center">
                        If you continue to experience issues, please contact support or try again later.
                    </p>
                </CardContent>

                <CardFooter className="flex gap-2 justify-center">
                    <Link href="/signin">
                        <Button variant="outline" className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="gap-2">
                            <Home className="h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AuthErrorPage;