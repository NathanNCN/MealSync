'use client'

import Nav from '../Components/Nav';
import { FaPlus } from 'react-icons/fa';
import Ingredients from '../Components/FormInputs/Ingredients';
import Steps from '../Components/FormInputs/Steps';
import { useState } from 'react';

export default function AddRecipe() {
    const [ingredients, setIngredients] = useState<number[]>([0]);
    const [steps, setSteps] = useState<number[]>([0]);
    
    const handleAddIngredient = () => {
        const lastIndex = ingredients[ingredients.length - 1];
        setIngredients(prev => [...prev, lastIndex + 1]);
    }
    
    const handleRemoveIngredient = (indexToRemove: number) => {
        if (ingredients.length > 1) {
            setIngredients(prev => prev.filter((index) => index !== indexToRemove));
        }
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav/>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Recipe Name Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-4">Recipe</h1>
                    <input 
                        type="text"
                        placeholder="Recipe Name"
                        className="w-full p-2 border rounded-lg mb-4"
                    />
                    
                    {/* Time and Difficulty */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                            type="text"
                            placeholder="Time (e.g., 30 mins)"
                            className="p-2 border rounded-lg"
                        />
                        <select className="p-2 border rounded-lg">
                            <option value="">Select Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                    <div className="space-y-3">
                        {ingredients.map((value) => (
                            <Ingredients 
                                key={value}
                                onRemove={() => handleRemoveIngredient(value)}
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
            </div>
        </div>
    )
}