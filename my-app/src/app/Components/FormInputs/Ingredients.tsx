'use client'
import { useState } from 'react';

import { FaTrash } from 'react-icons/fa';

type IngredientsProps = {
    onRemove: () => void,
    index: number,
    onIngredientChange: (index: number, ingredient: Ingredient) => void
}
type Ingredient = {
    name: string,
    amount: number,
    unit: "g" | "kg" | "ml" | "l" | "tsp" | "tbsp" | "cup",
}

export default function Ingredients({ onRemove, index, onIngredientChange}: IngredientsProps) {

    const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
        name: '',
        amount: 0,
        unit: 'g',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) =>{
        const {name, value} = e.target;
        const updatedIngredient = {...currentIngredient, [name]: value};
        setCurrentIngredient(updatedIngredient);
        onIngredientChange(index, updatedIngredient);
    }

    return (
        <div className="flex gap-2 items-center">
            <input 
                type="text"
                name="name"
                placeholder="Ingredient"
                className="flex-1 p-2 border rounded-lg"
                onChange = {handleChange}
                required
            />
            <input 
                type="number"
                name="amount"
                placeholder="Amount"
                className="w-24 p-2 border rounded-lg"
                onChange = {handleChange}
                min={1}
                max={1000}
                required
            />
            <select className="w-28 p-2 border rounded-lg"
                onChange = {handleChange}
                name="unit"
                required
            >
                <option value="" disabled>Unit</option>
                <option value="g">grams</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">liters</option>
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="cup">cup</option>
            </select>
            <button className="text-gray-400 hover:text-red-500 transition-colors p-2"
                onClick={() => onRemove()}
            >
                <FaTrash size={16} />
            </button>
        </div>
    )
}