'use client'

import { useSearchParams } from "next/navigation";
import Nav from "../Components/Nav";
import { FaClock } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';
import AuthCheck from '../Components/AuthCheck';

// Types for the recipe data

type nutrition = {
    cals: number,
    protien: number,
    carbs: number,
    fat: number
}

type Ingredient = {
    name: string,
    amount: number,
    unit: "g" | "kg" | "ml" | "l" | "tsp" | "tbsp" | "cup",
}

type Step = {
    text: string,
    image?: File | null,
}

type Recipe = {
    name: string,
    time: string,
    difficulty: "" | "Easy" | "Medium" | "Hard",
    coverImage: string | null, 
}

export default function ViewRecipe() {

    // States for the recipe data
    const [isLoading, setIsLoading] = useState(true);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

    const [difficultyColor, setDifficultyColor] = useState('');

    // State for the nutrition data
    const [nutritionValues, setNutritionValues] = useState<nutrition>({
        cals: 0,
        protien: 0,
        carbs: 0,
        fat: 0

    });

    // State for the recipe data
    const [recipe, setRecipe] = useState<Recipe>({
        name: '',
        time: '',
        difficulty: '',
        coverImage: null,
    });

    // Get the recipe id from the url
    const params = useSearchParams();
    const recipe_id = params.get('id');

    // Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // UseEffect to get the recipe data once recipe_id is set
    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);

            // Get the user data
            try {

                // Get the user data
                const {data: userData, error: userError} = await supabase.auth.getUser();
                if (userError || !userData.user) {
                    console.error('Error fetching user:', userError);
                    return;
                }

                // Get the recipe data and update the recipe state
                const {data: recipeData, error: recipeError} = await supabase.from('recipes').select('*').eq('id', recipe_id).single();
                if (recipeError) {
                    console.error('Error fetching recipe:', recipeError);
                    return;
                }
                setRecipe(recipeData);

                // Get the ingredients data and update the ingredients state
                const {data: ingredientsData, error: ingredientsError} = await supabase.from('ingredients').select('*').eq('recipe_id', recipe_id);
                if (ingredientsError) {
                    console.error('Error fetching ingredients:', ingredientsError);
                    return;
                }
                setIngredients(ingredientsData);

                // Get the steps data and update the steps state
                const {data: stepsData, error: stepsError} = await supabase.from('steps').select('*').eq('recipe_id', recipe_id);
                if (stepsError) {
                    console.error('Error fetching steps:', stepsError);
                    return;
                }
                setSteps(stepsData);

                // Get the nutrition data and update the nutrition state
                const {data: nutritionData, error: nutritionError} = await supabase.from('nutrition').select('*').eq('recipe_id', recipe_id).single();
                if (nutritionError) {
                    console.error('Error fetching nutrition:', nutritionError);
                    return;
                }
                setNutritionValues({
                    cals: nutritionData.calories,
                    protien: nutritionData.protein,
                    carbs: nutritionData.carbs,
                    fat: nutritionData.fat
                });

                // Get cover images from buckets based on user id and recipe id
                const { data: files } = await supabase.storage
                    .from('coverimages')
                    .list(`${userData.user.id}/${recipe_id}`, {limit: 1});

                if (files && files.length > 0) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('coverimages')
                        .getPublicUrl(`${userData.user.id}/${recipe_id}/${files[0].name}`);
                    
                    setRecipe(prevRecipe => ({...prevRecipe, coverImage: publicUrl}));
                }
            } catch (error) {
                console.error('Error loading recipe data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getData();
    }, [recipe_id]);

    // UseEffect to set the difficulty color based on the difficulty
    useEffect(() => {
        if (recipe.difficulty == 'Easy') {
            setDifficultyColor('text-green-500');
        } else if (recipe.difficulty == 'Medium') {
            setDifficultyColor('text-yellow-500');
        } else if (recipe.difficulty == 'Hard') {
            setDifficultyColor('text-red-500');
        }
    }, [recipe]);

    // Add this useEffect to monitor nutrition values changes
    useEffect(() => {
        console.log('Updated Nutrition Values:', nutritionValues);
    }, [nutritionValues]);

    if (isLoading) {
        return (
            <AuthCheck>
                <div className="min-h-screen bg-gray-50">
                    <Nav />
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="animate-spin text-green-500 mb-4">
                            <FaSpinner size={40} />
                        </div>
                        <p className="text-gray-600 text-lg">Loading recipe details...</p>
                    </div>
                </div>
            </AuthCheck>
        );
    }

    if (!recipe.name) {
        return (
            <AuthCheck>
                <div className="min-h-screen bg-gray-50">
                    <Nav />
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-12">
                            <h1 className="text-2xl text-gray-600">Recipe not found</h1>
                            <p className="text-gray-500 mt-2">The recipe you're looking for doesn't exist or has been removed.</p>
                        </div>
                    </div>
                </div>
            </AuthCheck>
        );
    }

    return (
        <AuthCheck>
            <div className="min-h-screen bg-gray-50">
                <Nav/>
                {/* Banner Image */}
                <div className="w-full h-[300px] relative">
                    <img 
                        src={recipe.coverImage || "https://placehold.co/1920x300"}
                        alt={`${recipe.name} Cover`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                        <div className="container mx-auto px-4 h-full flex items-end pb-8">
                            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{recipe.name}</h1>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Time and Difficulty */}
                    <div className="flex gap-6 mb-12">
                        <div className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                            <FaClock size={20} />
                            <span>{recipe.time}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${difficultyColor} bg-white px-3 py-1 rounded-full shadow-sm`}>
                            <IoMdSpeedometer size={20} />
                            <span>{recipe.difficulty}</span>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <ul className="space-y-4">
                                {ingredients.map((ingredient: Ingredient, index: number) => (
                                    <li key={index} className="flex justify-between items-center border-b pb-2">
                                        <span>{ingredient.name}</span>
                                        <span className="text-gray-600">{ingredient.amount} {ingredient.unit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Nutrition Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Nutrition Facts</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-blue-500">{nutritionValues.cals}</div>
                                    <div className="text-gray-600 mt-1">Calories</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-red-500">{nutritionValues.protien}g</div>
                                    <div className="text-gray-600 mt-1">Protein</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-yellow-500">{nutritionValues.carbs}g</div>
                                    <div className="text-gray-600 mt-1">Carbs</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-green-500">{nutritionValues.fat}g</div>
                                    <div className="text-gray-600 mt-1">Fat</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Steps</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* Step Carousel */}
                            <div className="relative">
                                <div className="flex items-center">
                                    <button 
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                        onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentStepIndex === 0}
                                    >
                                        <div className={currentStepIndex === 0 ? "text-gray-300" : "text-gray-700"}>
                                            <MdNavigateBefore size={24} />
                                        </div>
                                    </button>
                                    
                                    <div className="flex-1">
                                        <div className="text-center mb-4">
                                            <span className="text-sm text-gray-500">
                                                Step {currentStepIndex + 1} of {steps.length}
                                            </span>
                                        </div>
                                        
                                        {/* Step Content */}
                                        {steps.length > 0 && (
                                            <div className="space-y-4">
                                                {steps[currentStepIndex].image && (
                                                    <div className="w-1/2 h-1/4 mx-auto">
                                                        <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                                                            <img 
                                                                src={steps[currentStepIndex].image}
                                                                alt={`Step ${currentStepIndex + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-gray-700">
                                                    {steps[currentStepIndex].text}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                        onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                                        disabled={currentStepIndex === steps.length - 1}
                                    >
                                        <div className={currentStepIndex === steps.length - 1 ? "text-gray-300" : "text-gray-700"}>
                                            <MdNavigateNext size={24} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthCheck>
    )
}