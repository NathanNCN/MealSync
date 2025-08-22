'use client'

import Nav from '../Components/Nav';
import { FaPlus } from 'react-icons/fa';
import Ingredients from '../Components/FormInputs/Ingredients';
import Steps from '../Components/FormInputs/Steps';
import { useState } from 'react';
import {createClient} from '@supabase/supabase-js';
import {useRouter} from 'next/navigation';
import { getCals } from '../api/nutrition';
import { error } from 'console';


// Define the types for the ingredients, steps, and recipe
type Ingredient = {
    name: string,
    amount: number,
    unit: "g" | "kg" | "ml" | "l" | "tsp" | "tbsp" | "cup",
}

type Step = {
    directions: string,
    image?: File | null,
}

type Recipe = {
    name: string,
    time: string,
    difficulty: "" | "Easy" | "Medium" | "Hard",
    coverImage: File | null,
    steps: Step[],
}


export default function AddRecipe() {

    // State to track the ingredients, steps and images
    const [ingredients, setIngredients] = useState<number[]>([0]);
    const [steps, setSteps] = useState<number[]>([0]);
    const [stepsList, setStepsList] = useState<Step[]>([{
        directions: '',
        image: null
    }]);

    // State to track the image preview
    const [imagePreview, setImagePreview] = useState<string>(``);
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([{
        name: '',
        amount: 0,
        unit: "g"
    }]);

    // State to track the recipe cover details
    const [recipe, setRecipe] = useState<Recipe>({
        name: "",
        time: "",
        difficulty: "Easy",
        coverImage: null, 
        steps: []

    });
    
    // Function to add a new ingredient
    const handleAddIngredient = () => {
        const lastIndex = ingredients[ingredients.length - 1];
        setIngredients(prev => [...prev, lastIndex + 1]);
        setIngredientsList(prev => [...prev, { name: '', amount: 0, unit: "g" }]);
        console.log('Added new ingredient');
    }

    // Function to remove an ingredient
    const handleRemoveIngredient = (indexToRemove: number) => {
        if (ingredients.length > 1) {
            // Find the position of the indexToRemove in the ingredients array
            const position = ingredients.indexOf(indexToRemove);
            
            setIngredients(prev => prev.filter((index) => index !== indexToRemove));
            setIngredientsList(prev => prev.filter((_, i) => i !== position));
            console.log('Removed ingredient at position:', position);
        }
    }

    // Function to handle ingredient changes
    const handleIngredientChange = (index: number, ingredient: Ingredient) => {
        console.log(`Ingredient ${index} changed:`, ingredient);
        setIngredientsList(prev => {
            const updated = [...prev];
            updated[index] = ingredient;
            console.log('All ingredients after update:', updated);
            return updated;
        });
    }

    // Function to handle step changes
    const handleStepChange = (index: number, step: Step) => {
        console.log(`Step ${index} changed:`, step);
        setStepsList(prev => {
            const updated = [...prev];
            updated[index] = step;
            console.log('All steps after update:', updated);
            return updated;
        });
    }

    // Function to remove a step
    const handleRemoveStep = (indexToRemove: number) => {
        if (steps.length > 1) {
            setSteps(prev => prev.filter((index) => index !== indexToRemove));
            setStepsList(prev => prev.filter((_, i) => i !== indexToRemove));
        }
    }

    // Function to add a new step
    const handleAddStep = () => {
        const lastIndex = steps[steps.length - 1];
        setSteps(prev => [...prev, lastIndex + 1]);
        setStepsList(prev => [...prev, { directions: '', image: null }]);
        
    }


    // Function to handle changes in the recipe details
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name == `coverImage` && e.target instanceof HTMLInputElement && e.target.files) {
            console.log('IMAGE IS ADDED')
            const file = e.target.files[0];

            setImagePreview(URL.createObjectURL(file));
            setRecipe(prev => ({ ...prev, coverImage: file }));
        } else{
            setRecipe( (prev)=>({...prev, [name]:value}))

        }
    }

    // Create a supabase client
    const supaBase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
    );

    // Function to handle the submission of the recipe
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

        // Check if there are any ingredients
        if (validIngredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        console.log("SUBMITTING to database", {
            recipe,
            ingredients: validIngredients
        });

        // Get the user
        const user = await supaBase.auth.getUser();

        // Check if the user is authenticated
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

            //Now going to insert image into bucket
            if (!recipe.coverImage || !recipe.coverImage.name) {
                console.error('Cover image or filename is missing');
                return;
            }

            const fileExtension = recipe.coverImage.name.split('.').pop()
            const fileName = `${user.data.user.id}/${recipeId}/${Date.now()}.${fileExtension}`

            console.log('Uploading file with path:', fileName)

            //insert image to database
            const { error: uploadError} = await supaBase.storage.from('coverimages').upload(fileName, recipe.coverImage)
            
            if (uploadError){
                console.log('Error uploading cover image', uploadError)
                return
            }

        


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
            const nutrition = await getCals(validIngredients)
            console.log(`FINAL`, nutrition)

            const {error: nutritionError} = await supaBase
                .from('nutrition')
                .insert({
                    recipe_id: recipeId,
                    calories: nutrition.cals,
                    protein: nutrition.protien,
                    fat: nutrition.carbs,
                    carbs: nutrition.carbs
                })

            if (nutritionError){
                console.log("Failed to insert cals", nutritionError)

            }

            // Insert each step separately
            for (const [index, step] of stepsList.entries()) {
                console.log('inserting step')
                let filePathURL = null;

                //Now going to insert image into step bucket
                if (step.image && step.image.name) {
                    const fileExtension = step.image.name.split('.').pop()
                    const fileName = `${user.data.user.id}/${recipeId}/${Date.now()}.${fileExtension}`

                    console.log('Uploading file with path:', fileName)

                    //insert image to database
                    const { error: uploadError} = await supaBase.storage.from('stepimages').upload(fileName, step.image)
                    
                    if (uploadError){
                        console.log('Error uploading step image', uploadError)
                        return
                    }

                    // Get the public URL for the uploaded image
                    const { data: { publicUrl } } = supaBase.storage.from('stepimages').getPublicUrl(fileName);
                    filePathURL = publicUrl;
                }

                const {error: stepError} = await supaBase
                    .from('steps')
                    .insert({
                        recipe_id: recipeId,
                        order_number: index + 1,
                        text: step.directions,
                        image: filePathURL
                    });
                


                if (stepError) {
                    console.error('Error inserting step:', step, stepError);
                    // Optionally delete the recipe if step insertion fails
                    await supaBase.from('recipes').delete().eq('id', recipeId);
                    return;
                }
            }


            

            

        } catch (error) {
            console.error('Error during submission:', error);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Nav/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Recipe Name Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Recipe</h1>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipe Name
                                </label>
                                <input 
                                    id="recipe-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter recipe name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            {/* Time and Difficulty */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cooking-time" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cooking Time
                                    </label>
                                    <input 
                                        id="cooking-time"
                                        type="text"
                                        name="time"
                                        onChange={handleChange}
                                        placeholder="e.g., 30 mins"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                                        Difficulty Level
                                    </label>
                                    <select 
                                        id="difficulty"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                                        name="difficulty" 
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cover Image</h2>
                        <div 
                            className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all hover:border-green-500 hover:bg-green-50"
                        >
                            <input 
                                type="file"
                                name="coverImage"
                                accept="image/*"
                                className="sr-only"
                                id="cover-image"
                                onChange={handleChange}
                                required
                            />
                            <label 
                                htmlFor="cover-image" 
                                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                            >
                                <div className="rounded-full bg-green-100 p-3">
                                    <FaPlus size={24} color="#059669" />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-gray-700">Add Cover Image</p>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                </div>
                            </label>
                            {imagePreview && (
                                <div className="mt-4">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-48 mx-auto rounded-lg shadow-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
                            <button 
                                type="button"
                                onClick={handleAddIngredient}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all gap-2"
                            >
                                <FaPlus size={16} />
                                Add Ingredient
                            </button>
                        </div>
                        <div className="space-y-4">
                            {ingredients.map((value) => (
                                <Ingredients 
                                    key={value}
                                    index={value}
                                    onRemove={() => handleRemoveIngredient(value)}
                                    onIngredientChange={handleIngredientChange}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Steps</h2>
                            <button 
                                type="button"
                                onClick={handleAddStep}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all gap-2"
                            >
                                <FaPlus size={16} />
                                Add Step
                            </button>
                        </div>
                        <div className="space-y-4">
                            {steps.map((value, index) => (
                                <Steps
                                    key={value}
                                    stepIndex={index+1}
                                    onRemove={() => handleRemoveStep(value)}
                                    onStepChange={(step) => handleStepChange(index, step)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6 pb-12">
                        <button 
                            type="submit" 
                            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
                        >
                            Save Recipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}