'use client'
import Recipe from './Recipe';
import { FaPlus } from "react-icons/fa";
import {useRouter} from 'next/navigation';
import {createClient} from '@supabase/supabase-js';
import {useState, useEffect, use} from 'react';


type Recipe = {
    name: string,
    time: string,
    difficulty: "" | "Easy" | "Medium" | "Hard",
    coverImage: File | null,
    user_id: string
}

export default function RecipeContainer() {

    const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
      
    const router = useRouter();


    useEffect( () => {
        const getRecipes = async () =>{
            const {data: {user}, error: userError} = await supabase.auth.getUser()

            if (userError){
                console.log("error getting user", userError)
                return;
            }
            if (!user){
                console.log("Cannot get user", userError)
                return;

            }

            const {data, error} = await supabase.from('recipes').select('*').eq('user_id', user.id)
            setUserRecipes(data || [])
        }
        getRecipes();

    },[])

    return (
        <div className='flex flex-wrap justify-center align-center mt-10 gap-4'>
            <button className="bg-white shadow-md rounded-lg h-[300px] w-[300px] flex items-center justify-center hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => router.push('/AddRecipe')}
            >
                <FaPlus size={40} color="#9CA3AF" />
            </button>
            {userRecipes.map( (recipe, index)=>{
                    return <Recipe key={index} name={recipe.name} image={'#'} time={recipe.time} difficulty={recipe.difficulty}/>
            })}

            
        </div>
    )
}