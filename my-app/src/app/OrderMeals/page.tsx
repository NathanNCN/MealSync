'use client'

import { useState, useEffect } from 'react';
import Nav from '../Components/Nav';
import { createClient } from '@supabase/supabase-js';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import AuthCheck from '../Components/AuthCheck';

type Recipe = {
    id: string;
    name: string;
    time: string;
    difficulty: string;
    coverImage: string | null;
}

type Ingredient = {
    id: string;
    name: string;
    amount: number;
    unit: string;
    recipe_id: string;
    selected: boolean;
    quantity: number; // Added for quantity control
}

export default function OrderMeals() {
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
    const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showIngredients, setShowIngredients] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.from('recipes').select('*');
                if (error) {
                    console.error('Error fetching recipes:', error);
                    return;
                }
                setAvailableRecipes(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const handleRecipeSelect = (recipe: Recipe) => {
        setSelectedRecipes(prev => [...prev, recipe]);
        setAvailableRecipes(prev => prev.filter(r => r.id !== recipe.id));
    };

    const handleRecipeRemove = (recipe: Recipe) => {
        setSelectedRecipes(prev => prev.filter(r => r.id !== recipe.id));
        setAvailableRecipes(prev => [...prev, recipe]);
    };

    const fetchIngredients = async () => {
        const recipeIds = selectedRecipes.map(r => r.id);
        const { data, error } = await supabase
            .from('ingredients')
            .select('*')
            .in('recipe_id', recipeIds);
        
        if (error) {
            console.error('Error fetching ingredients:', error);
            return;
        }

        // Combine duplicate ingredients and add quantity control
        const combinedIngredients = data.reduce((acc: { [key: string]: Ingredient }, curr) => {
            const key = `${curr.name}-${curr.unit}`;
            if (acc[key]) {
                // Keep quantity at 1 even when combining
                acc[key].amount += curr.amount;
            } else {
                acc[key] = {
                    ...curr,
                    selected: true,
                    quantity: 1  // Explicitly set default to 1
                };
            }
            return acc;
        }, {});

        setIngredients(Object.values(combinedIngredients));
        setShowIngredients(true);
    };

    const toggleIngredient = (ingredientId: string) => {
        setIngredients(prev => prev.map(ing => 
            ing.id === ingredientId ? { ...ing, selected: !ing.selected } : ing
        ));
    };

    const updateQuantity = (ingredientId: string, change: number) => {
        setIngredients(prev => prev.map(ing => {
            if (ing.id === ingredientId) {
                const newQuantity = Math.max(1, (ing.quantity || 1) + change);
                return { ...ing, quantity: newQuantity };
            }
            return ing;
        }));
    };

    if (isLoading) {
        return (
            <AuthCheck>
                <div className="min-h-screen bg-gray-50">
                    <Nav />
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <div className="animate-spin text-green-500 mb-4">
                                <FaSpinner size={40} />
                            </div>
                            <p className="text-gray-600 text-lg">Loading recipes...</p>
                        </div>
                    </div>
                </div>
            </AuthCheck>
        );
    }

    return (
        <AuthCheck>
            <div className="min-h-screen bg-gray-50">
                <Nav />
                <div className="container mx-auto px-4 py-8">
                    {!showIngredients ? (
                        <>
                            <h1 className="text-3xl font-bold mb-8">Select Your Meals</h1>
                            
                            {/* Selected Recipes */}
                            {selectedRecipes.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold mb-4">Selected Meals</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedRecipes.map(recipe => (
                                            <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">{recipe.name}</h3>
                                                    <p className="text-sm text-gray-600">{recipe.time} • {recipe.difficulty}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleRecipeRemove(recipe)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTimes size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await fetchIngredients();
                                            setIsLoading(false);
                                        }}
                                        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Continue to Ingredients
                                    </button>
                                </div>
                            )}

                            {/* Available Recipes */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Available Meals</h2>
                                {availableRecipes.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No recipes available at the moment
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {availableRecipes.map(recipe => (
                                            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                {recipe.coverImage && (
                                                    <img 
                                                        src={recipe.coverImage} 
                                                        alt={recipe.name} 
                                                        className="w-full h-48 object-cover"
                                                    />
                                                )}
                                                <div className="p-4">
                                                    <h3 className="font-semibold">{recipe.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-4">{recipe.time} • {recipe.difficulty}</p>
                                                    <button 
                                                        onClick={() => handleRecipeSelect(recipe)}
                                                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                                    >
                                                        Add to Selection
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold">Selected Ingredients</h1>
                                <button 
                                    onClick={() => setShowIngredients(false)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Back to Meals
                                </button>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                {ingredients.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No ingredients selected
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {ingredients.map(ingredient => (
                                            <div 
                                                key={ingredient.id} 
                                                className={`flex justify-between items-center p-4 border rounded-lg ${
                                                    ingredient.selected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => toggleIngredient(ingredient.id)}
                                                        className={`${ingredient.selected ? 'text-green-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
                                                    >
                                                        <FaCheck size={20} />
                                                    </button>
                                                    <div>
                                                        <h3 className="font-semibold">{ingredient.name}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(ingredient.id, -1)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                                                            ingredient.quantity <= 1 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                        disabled={ingredient.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center">{ingredient.quantity || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(ingredient.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {ingredients.length > 0 && (
                                    <button 
                                        className="mt-8 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                                    >
                                        Proceed to Checkout ({ingredients.filter(i => i.selected).length} items)
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthCheck>
    );
} 