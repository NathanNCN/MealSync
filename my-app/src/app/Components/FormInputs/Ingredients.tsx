'use client'
import { FaTrash } from 'react-icons/fa';

type IngredientsProps = {
    onRemove: () => void;
}

export default function Ingredients({ onRemove}: IngredientsProps) {
    return (
        <div className="flex gap-2 items-center">
            <input 
                type="text"
                placeholder="Ingredient"
                className="flex-1 p-2 border rounded-lg"
                required
            />
            <input 
                type="text"
                placeholder="Amount"
                className="w-24 p-2 border rounded-lg"
                required
            />
            <select className="w-28 p-2 border rounded-lg"
                required
            >
                <option value="" disabled selected>Unit</option>
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