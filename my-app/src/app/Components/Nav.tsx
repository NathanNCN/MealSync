'use client'
import React from 'react';
import {useRouter} from 'next/navigation';

export default function Nav() {
    const router = useRouter();
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
                    <button className='px-4 py-2 bg-white text-green-600 hover:bg-green-100 rounded-lg transition-colors'>
                        Login
                    </button>
                </div>
            </div>
            
        </nav>

    );
}