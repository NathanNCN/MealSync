'use client'

import { FaClock } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


type RecipeProps = {
    name: string;
    image: string;
    time: string;
    difficulty: string;
}

export default function Recipe({name, image, time, difficulty}: RecipeProps) {

    const [difficultyColor, setDifficultyColor] = useState('');

    const router = useRouter();

    useEffect(() => {
        if (difficulty == 'Easy') {
            setDifficultyColor('text-green-500');
        } else if (difficulty == 'Medium') {
            setDifficultyColor('text-yellow-500');
        } else if (difficulty == 'Hard') {
            setDifficultyColor('text-red-500');
        }
    }, [difficulty]);

    const showRecipe = () => router.push('/ViewRecipe');

    return (
        <button className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-[300px] w-full sm:w-[300px]'
            onClick={showRecipe}>
            {/* Recipe Name */}
            <div className='relative'>
                {/* Image Container */}
                <div className='w-full h-[200px]'>
                    <img 
                        src={image}
                        alt={name}
                        className='w-full h-full object-cover transition-transform duration-300 '
                    />
                    {/* Overlay gradient for text readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                </div>
                {/* Title overlaid on image */}
                <h1 className='absolute bottom-0 left-0 right-0 p-4 text-xl font-semibold text-white'>{name}</h1>
            </div>
            
            {/* Info Footer */}
            <div className='p-4 flex justify-between items-center bg-white'>
                <div className='flex items-center gap-2 text-gray-600'>
                    <FaClock size={16} color="#9CA3AF" />
                    <span className="text-sm font-medium">{time}</span>
                </div>
                <div className={`flex items-center gap-2 ${difficultyColor}`}>
                    <IoMdSpeedometer size={18} />
                    <span className="text-sm font-medium">{difficulty}</span>
                </div>
            </div>
        </button>
    )
}