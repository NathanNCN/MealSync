'use client'

import Nav from '../Components/Nav';
import { FaPlus } from 'react-icons/fa';

export default function AddRecipe() {
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
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="Ingredient"
                                className="flex-1 p-2 border rounded-lg"
                            />
                            <input 
                                type="text"
                                placeholder="Amount"
                                className="w-24 p-2 border rounded-lg"
                            />
                            <select className="w-28 p-2 border rounded-lg">
                                <option value="">Unit</option>
                                <option value="g">grams</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">liters</option>
                                <option value="tsp">tsp</option>
                                <option value="tbsp">tbsp</option>
                                <option value="cup">cup</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                            <FaPlus size={12} />
                            <span>Add Ingredient</span>
                        </button>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Steps</h2>
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <p className="font-semibold mb-3">Step 1</p>
                            <div className="space-y-3">
                                {/* Image Upload Box */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors">
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="step-image"
                                    />
                                    <label htmlFor="step-image" className="cursor-pointer">
                                        <FaPlus size={24} color="#9CA3AF" />
                                        <p className="text-sm text-gray-500">Add Image (Optional)</p>
                                    </label>
                                </div>
                                <textarea 
                                    placeholder="Step description"
                                    className="w-full p-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                            <FaPlus size={12} />
                            <span>Add Step</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}