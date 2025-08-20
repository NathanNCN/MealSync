'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginBanner from './LoginBanner';
import Nav from './Nav';

interface AuthCheckProps {
    children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        // Check initial auth state
        checkAuth();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Show nothing while checking auth state
    if (isAuthenticated === null) {
        return null;
    }

    // Show login banner if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen">
                <Nav />
                <LoginBanner />
            </div>
        );
    }

    // Show protected content if authenticated
    return <>{children}</>;
} 