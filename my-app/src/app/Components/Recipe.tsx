'use client'

import { FaClock } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import { useState, useEffect } from 'react';


type RecipeProps = {
    name: string;
    image: string;
    time: string;
    difficulty: string;
}

export default function Recipe({name, image, time, difficulty}: RecipeProps) {

    const [difficultyColor, setDifficultyColor] = useState('');

    useEffect(() => {
        if (difficulty == 'Easy') {
            setDifficultyColor('green-500');
        } else if (difficulty == 'Medium') {
            setDifficultyColor('yellow-500');
        } else if (difficulty == 'Hard') {
            setDifficultyColor('red-500');
        }
        console.log('difficultyColor', difficultyColor);
    }, [difficulty]);

    return (
        <div className='bg-white shadow-md rounded-lg overflow-hidden h-[300px] w-[300px] hover:shadow-lg transition-shadow'>
            {/* Recipe Name */}
            <h1 className='text-xl font-semibold p-3 text-gray-800'>Spaghetti Carbonara</h1>
            
            {/* Image Container */}
            <div className='w-full h-[160px] bg-gray-200'>
                <img 
                    src={image}
                    alt="Recipe"
                    className='w-full h-full object-cover'
                />
            </div>
            
            {/* Info Footer */}
            <div className='p-3 flex justify-between items-center'>
                <div className='flex items-center gap-2 text-gray-600'>
                    <FaClock />
                    <span>30 mins</span>
                </div>
                <div className={`flex items-center gap-2 text-gray-600 text-${difficultyColor}`}>
                    <IoMdSpeedometer />
                    <span>{difficulty}</span>
                </div>
            </div>
        </div>
    )
}