'use client'
import React from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@supabase/supabase-js';
import {useState, useEffect} from 'react';


// Define the type for the button setting
type ButtonSetting = {
    text: string;
    onClick: () => void;
    className: string;
}

export default function Nav() {

    //Hooks for controling the login state
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
   
    //Create the supabase client to connect to the database
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    //Function to login with google via supabase
    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/'
            }
        });
    }

    //Function to logout from supabase
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);

        //Reload the page to update the login state
        window.location.reload();
    }

    const [buttonSetting, setButtonSetting] = useState<ButtonSetting>({
        text: 'Login',
        onClick: handleLogin,
        className: 'px-4 py-2 bg-white text-green-600 hover:bg-green-100 rounded-lg transition-colors'
    });

    useEffect(() => {
        // Check initial auth state
        supabase.auth.getUser().then(({ data: { user }}) => {
            setIsLoggedIn(user !== null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(session !== null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            setButtonSetting({
                text: 'Logout',
                onClick: handleLogout,
                className: 'px-4 py-2 bg-white text-red-600 hover:bg-red-100 rounded-lg transition-colors'
            });
        } else {
            setButtonSetting({
                text: 'Login',
                onClick: handleLogin,
                className: 'px-4 py-2 bg-white text-green-600 hover:bg-green-100 rounded-lg transition-colors'
            });
        }
    }, [isLoggedIn]);

    return (
        <nav className='bg-green-600 shadow-lg'>
            <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-white'>MealSync</h1>

                {/* Right - Navigation Buttons */}
                <div className='flex gap-4'>
                    <button className='px-4 py-2 text-white hover:bg-green-700 rounded-lg transition-colors'
                        onClick={() => router.push('/')}
                    >
                        Meals
                    </button>
                    <button className='px-4 py-2 text-white hover:bg-green-700 rounded-lg transition-colors'>
                        Order
                    </button>
                    <button className={buttonSetting.className}
                        onClick={buttonSetting.onClick}>
                        {buttonSetting.text}
                    </button>
                </div>
            </div>
        </nav>
    );
}