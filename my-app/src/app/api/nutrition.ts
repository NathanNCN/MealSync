import Ingredients from "../Components/FormInputs/Ingredients";

// This file is used to get the nutrition of a meal


// Define the types for the nutrition
type nutrition = {
    cals: number,
    protien: number,
    carbs: number,
    fat: number
}

type IngredientsForNutrition = {
    name: string;
    amount: number;
    unit: string;
}

export async function getCals(meal: IngredientsForNutrition[]): Promise<nutrition> {

    // Get the USDA API key
    const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_FOOD_API_KEY;

    // Initialize the total nutrition
    let totalNutrition: nutrition = {
        cals: 0,
        protien: 0,
        carbs: 0,
        fat: 0
    };
    
    // Loop through the ingredients
    for (const ingredient of meal) {

        // Try to get the nutrition for the ingredient
        try {
            const response = await fetch(
                `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(ingredient.name)}`,
                { method: 'GET' }
            );

            // Check if the response is ok
            if (!response.ok) {
                console.error(`Failed to fetch data for ${ingredient.name}`);
                continue;
            }

            // Get the data and turn into json
            const data = await response.json();
            
            // Check if no foods found and or skip if no foods found
            if (!data.foods || data.foods.length === 0) {
                console.log(`No nutrition data found for ${ingredient.name}`);
                continue;
            }

            // Get the first food item from the response
            const food = data.foods[0];
            const nutrients = food.foodNutrients;

            // Get nutrients per 100g

            const getNutrient = (nutrientName: string) => {
                return nutrients.find((n: any) => n.nutrientName === nutrientName);
            }

            const caloriesNutrient = getNutrient("Energy");
            const proteinNutrient = getNutrient("Protein");
            const carbsNutrient = getNutrient("Carbohydrate, by difference");
            const fatNutrient = getNutrient("Total lipid (fat)");

            // Convert ingredient amount to grams for calculation
            let amountInGrams = ingredient.amount;
            switch (ingredient.unit.toLowerCase()) {
                case 'kg':
                    amountInGrams = ingredient.amount * 1000;
                    break;
                case 'mg':
                    amountInGrams = ingredient.amount / 1000;
                    break;
                case 'ml':
                case 'g':
                    amountInGrams = ingredient.amount;
                    break;
                case 'l':
                    amountInGrams = ingredient.amount * 1000;
                    break;
                case 'tsp':
                    amountInGrams = ingredient.amount * 5; 
                case 'tbsp':
                    amountInGrams = ingredient.amount * 15;
                    break;
                case 'cup':
                    amountInGrams = ingredient.amount * 240; 
                    break;
            }

            // Calculate nutrition based on amount 
            const multiplier = amountInGrams / 100;

            // Add the nutrition to the total nutrition
            totalNutrition.cals += (caloriesNutrient?.value || 0) * multiplier;
            totalNutrition.protien += (proteinNutrient?.value || 0) * multiplier;
            totalNutrition.carbs += (carbsNutrient?.value || 0) * multiplier;
            totalNutrition.fat += (fatNutrient?.value || 0) * multiplier;

    
        } catch (error) {
            console.error(`Error processing ${ingredient.name}:`, error);
            continue;
        }
    }

    // Round all values to 1 decimal place
    totalNutrition.cals = Math.round(totalNutrition.cals * 10) / 10;
    totalNutrition.protien = Math.round(totalNutrition.protien * 10) / 10;
    totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;
    totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
    console.log("Final nutrtion ", totalNutrition)

    return totalNutrition;
}
