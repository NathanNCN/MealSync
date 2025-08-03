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
    coverImage: string, // Changed from File | null to string to store URL
    user_id: string,
    id: string, // Added id field
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
            try {
                const {data: {user}, error: userError} = await supabase.auth.getUser()

                if (userError) {
                    console.log("error getting user", userError)
                    return;
                }
                if (!user) {
                    console.log("Cannot get user")
                    return;
                }

                // Get recipes data
                const {data: recipesData, error: recipesError} = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('user_id', user.id);

                if (recipesError) {
                    console.log("Error fetching recipes:", recipesError);
                    return;
                }

                // Get cover images for each recipe
                const recipesWithImages = await Promise.all(recipesData.map(async (recipe) => {
                    try {
                        console.log("HERE USER ID", user.id)
                        console.log("recipe ID", recipe.id)
                        const { data: fileList, error: imageError } = await supabase
                            .storage
                            .from('coverimages')
                            .list(`${user.id}/${recipe.id}`)
                        
                        console.log('files here',fileList)

                        if (imageError) {
                            console.log(`Error fetching image for recipe ${recipe.id}:`, imageError);
                            return {
                                ...recipe,
                                coverImage: '#' // Fallback image URL
                            };
                        }

                        // Check if we have any files
                        if (!fileList || fileList.length === 0) {
                            console.log(`No cover image found for recipe ${recipe.id}`);
                            return {
                                ...recipe,
                                coverImage: '#'
                            };
                        }

                        const fileName = fileList[0].name;
                        const { data: { publicUrl } } = supabase.storage
                            .from('coverimages')
                            .getPublicUrl(`${user.id}/${recipe.id}/${fileName}`);

                        console.log('Got image URL:', publicUrl);

                        return {
                            ...recipe,
                            coverImage: publicUrl
                        };
                    } catch (error) {
                        console.log(`Error processing image for recipe ${recipe.id}:`, error);
                        return {
                            ...recipe,
                            coverImage: '#' // Fallback image URL
                        };
                    }
                }));

                setUserRecipes(recipesWithImages || []);
            } catch (error) {
                console.log("Unexpected error:", error);
            }
        };
        
        getRecipes();
    }, []);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                <button 
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-[300px] w-full flex flex-col items-center justify-center gap-4 hover:bg-green-50"
                    onClick={() => router.push('/AddRecipe')}
                >
                    <div className="rounded-full bg-gray-100 p-6 group-hover:bg-green-100 transition-colors">
                        <FaPlus size={32} color="currentColor" />
                    </div>
                    <span className="text-gray-500 group-hover:text-green-600 font-medium transition-colors">Add New Recipe</span>
                </button>
                {userRecipes.map((recipe, index) => (
                    <Recipe 
                        key={recipe.id} 
                        name={recipe.name} 
                        image={recipe.coverImage} 
                        time={recipe.time} 
                        difficulty={recipe.difficulty}
                    />
                ))}
            </div>
        </div>
    );
}