'use client'
import Recipe from './Recipe';
import { FaPlus } from "react-icons/fa";
import {useRouter} from 'next/navigation';


export default function RecipeContainer() {
    const router = useRouter();
    return (
        <div className='flex flex-wrap justify-center align-center mt-10 gap-4'>
            <button className="bg-white shadow-md rounded-lg h-[300px] w-[300px] flex items-center justify-center hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => router.push('/AddRecipe')}
            >
                <FaPlus size={40} color="#9CA3AF" />
            </button>
            <Recipe name="Spaghetti Carbonara" image="https://placehold.co/300x160" time="30 mins" difficulty="Hard"/>
            <Recipe name="Bulgoi" image="https://placehold.co/300x160" time="10 mins" difficulty="Easy"/>
            <Recipe name="Quesdilla" image="https://placehold.co/300x160" time="10 mins" difficulty="Medium"/>

            
        </div>
    )
}