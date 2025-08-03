import Ingredients from "../Components/FormInputs/Ingredients";

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
    const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_FOOD_API_KEY;
    let totalNutrition: nutrition = {
        cals: 0,
        protien: 0,
        carbs: 0,
        fat: 0
    };
    
    for (const ingredient of meal) {
        try {
            const response = await fetch(
                `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(ingredient.name)}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                console.error(`Failed to fetch data for ${ingredient.name}`);
                continue;
            }

            const data = await response.json();
            
            // Skip if no foods found
            if (!data.foods || data.foods.length === 0) {
                console.log(`No nutrition data found for ${ingredient.name}`);
                continue;
            }

            // Get the first food item
            const food = data.foods[0];
            const nutrients = food.foodNutrients;

            // Get nutrients per 100g
            const caloriesNutrient = nutrients.find((n: any) => n.nutrientName === "Energy" && n.unitName === "KCAL");
            const proteinNutrient = nutrients.find((n: any) => n.nutrientName === "Protein");
            const carbsNutrient = nutrients.find((n: any) => n.nutrientName === "Carbohydrate, by difference");
            const fatNutrient = nutrients.find((n: any) => n.nutrientName === "Total lipid (fat)");

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
                    amountInGrams = ingredient.amount * 5; // approximate
                    break;
                case 'tbsp':
                    amountInGrams = ingredient.amount * 15; // approximate
                    break;
                case 'cup':
                    amountInGrams = ingredient.amount * 240; // approximate
                    break;
            }

            // Calculate nutrition based on amount (nutrients are per 100g in USDA API)
            const multiplier = amountInGrams / 100;

            totalNutrition.cals += (caloriesNutrient?.value || 0) * multiplier;
            totalNutrition.protien += (proteinNutrient?.value || 0) * multiplier;
            totalNutrition.carbs += (carbsNutrient?.value || 0) * multiplier;
            totalNutrition.fat += (fatNutrient?.value || 0) * multiplier;

            console.log(`Calculated nutrition for ${ingredient.name}:`, {
                amount: amountInGrams,
                calories: (caloriesNutrient?.value || 0) * multiplier,
                protein: (proteinNutrient?.value || 0) * multiplier,
                carbs: (carbsNutrient?.value || 0) * multiplier,
                fat: (fatNutrient?.value || 0) * multiplier
            });

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
