'use client'

import Nav from '../Components/Nav';
import { FaPlus } from 'react-icons/fa';
import Ingredients from '../Components/FormInputs/Ingredients';
import Steps from '../Components/FormInputs/Steps';
import { useState } from 'react';
import {createClient} from '@supabase/supabase-js';
import {useRouter} from 'next/navigation';


type Ingredient = {
    name: string,
    amount: number,
    unit: "g" | "kg" | "ml" | "l" | "tsp" | "tbsp" | "cup",
}

type Step = {
    description: string,
    image: string,
}

type Recipe = {
    name: string,
    time: string,
    difficulty: "" | "Easy" | "Medium" | "Hard",
    coverImage: File | null,
    steps: Step[],
}


export default function AddRecipe() {
    const [ingredients, setIngredients] = useState<number[]>([0]);
    const [steps, setSteps] = useState<number[]>([0]);

    const [imagePreview, setImagePreview] = useState<string>(``);
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([{
        name: '',
        amount: 0,
        unit: "g"
    }]);


    const [recipe, setRecipe] = useState<Recipe>({
        name: "",
        time: "",
        difficulty: "Easy",
        coverImage: null, 
        steps: []

    });
    
    const handleAddIngredient = () => {
        const lastIndex = ingredients[ingredients.length - 1];
        setIngredients(prev => [...prev, lastIndex + 1]);
        setIngredientsList(prev => [...prev, { name: '', amount: 0, unit: "g" }]);
        console.log('Added new ingredient');
    }
    
    const handleRemoveIngredient = (indexToRemove: number) => {
        if (ingredients.length > 1) {
            // Find the position of the indexToRemove in the ingredients array
            const position = ingredients.indexOf(indexToRemove);
            
            setIngredients(prev => prev.filter((index) => index !== indexToRemove));
            setIngredientsList(prev => prev.filter((_, i) => i !== position));
            console.log('Removed ingredient at position:', position);
        }
    }

    const handleIngredientChange = (index: number, ingredient: Ingredient) => {
        console.log(`Ingredient ${index} changed:`, ingredient);
        setIngredientsList(prev => {
            const updated = [...prev];
            updated[index] = ingredient;
            console.log('All ingredients after update:', updated);
            return updated;
        });
    }

    const handleRemoveStep = (indexToRemove: number) => {
        if (steps.length > 1) {
            setSteps(prev => prev.filter((index) => index !== indexToRemove));
        }
    }

   
    const handleAddStep = () => {
        const lastIndex = steps[steps.length - 1];
        setSteps(prev => [...prev, lastIndex + 1]);
        
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name == `image` && e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];

            setImagePreview(URL.createObjectURL(file));
            setRecipe(prev => ({ ...prev, coverImage: file }));
        } else{
            setRecipe( (prev)=>({...prev, [name]:value}))

        }
    }

    

    const supaBase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
    );


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!recipe.coverImage) {
            alert('Please select a cover image');
            return;
        }

        // Filter out empty ingredients
        const validIngredients = ingredientsList.filter(ing => 
            ing.name.trim() !== '' && ing.amount > 0
        );

        if (validIngredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        console.log("SUBMITTING to database", {
            recipe,
            ingredients: validIngredients
        });

        const user = await supaBase.auth.getUser();

        if (!user.data.user) {
            console.error('User not authenticated');
            return;
        }

        try {
            // First, insert the recipe
            const {data: recipeData, error: recipeError} = await supaBase
                .from('recipes')
                .insert({
                    name: recipe.name,
                    time: recipe.time,
                    difficulty: recipe.difficulty,
                    user_id: user.data.user.id,
                })
                .select('id')
                .single();

            if (recipeError) {
                console.error('Recipe insert error:', recipeError);
                return;
            }

            const recipeId = recipeData.id;
            console.log('New recipe ID:', recipeId);

            console.log("ingredients", ingredients)

            // Insert each ingredient separately
            for (const ingredient of validIngredients) {
                const {error: ingredientError} = await supaBase
                    .from('ingredients')
                    .insert({
                        recipe_id: recipeId,
                        name: ingredient.name,
                        amount: ingredient.amount,
                        unit: ingredient.unit
                    });

                if (ingredientError) {
                    console.error('Error inserting ingredient:', ingredient, ingredientError);
                    // Optionally delete the recipe if ingredient insertion fails
                    await supaBase.from('recipes').delete().eq('id', recipeId);
                    return;
                }
            }

            console.log('Successfully inserted recipe and all ingredients');

        } catch (error) {
            console.error('Error during submission:', error);
        }
    }

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav/>
            <form className="container mx-auto px-4 py-8 max-w-2xl" onSubmit={handleSubmit}>
                {/* Recipe Name Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-4">Recipe</h1>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Recipe Name"
                        className="w-full p-2 border rounded-lg mb-4"
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Time and Difficulty */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                            type="text"
                            name="time"
                            onChange={handleChange}
                            placeholder="Time (e.g., 30 mins)"
                            className="p-2 border rounded-lg"
                            required
                        />
                        <select 
                            className="p-2 border rounded-lg" name="difficulty" 
                            onChange={handleChange}
                            required
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>
                {/* Cover Image Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Cover Image</h2>
                    <div className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
                        <input 
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            className="sr-only absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-0 border-0"
                            id="cover-image"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="cover-image" className="cursor-pointer">
                            <div className="mb-2">
                                <FaPlus size={32} color="#9CA3AF" />
                            </div>
                            <p className="text-sm text-gray-500">Add Cover Image</p>
                        </label>
                    </div>
                </div>
                {/* Ingredients Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                    <div className="space-y-3">
                        {ingredients.map((value) => (
                            <Ingredients 
                                key={value}
                                index={value}
                                onRemove={() => handleRemoveIngredient(value)}
                                onIngredientChange={handleIngredientChange}
                            />
                        ))}
                        <button 
                            onClick={handleAddIngredient}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                            <FaPlus size={12} />
                            <span>Add Ingredient</span>
                        </button>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Steps</h2>
                    <div className="space-y-4">
                        {steps.map((value,index) => (
                            <Steps
                                key={value}
                                stepIndex={index+1}
                                onRemove={() => handleRemoveStep(value)}
                            />
                        ))}

                        <button 
                            onClick={handleAddStep}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                            <FaPlus size={12} />
                            <span>Add Step</span>
                        </button>
                    </div>
                </div>
                <div className="flex align-center justify-center mt-10 font-bold text-white">
                    <button type={`submit`} className="bg-green-600 text-center p-5 justify-center rounded-md">
                        Save Recipe
                    </button>
                </div>
                
            </form>
        </div>
    )
}