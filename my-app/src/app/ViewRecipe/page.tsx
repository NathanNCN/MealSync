'use client'

import Nav from "../Components/Nav";
import { FaClock } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

export default function ViewRecipe() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Nav/>
            {/* Banner Image */}
            <div className="w-full h-[300px] relative">
                <img 
                    src="https://placehold.co/1920x300" 
                    alt="Recipe Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="container mx-auto px-4 h-full flex items-end pb-8">
                        <h1 className="text-4xl font-bold text-white">Spaghetti Carbonara</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Time and Difficulty */}
                <div className="flex gap-6 mb-12">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaClock size={20} />
                        <span>30 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                        <IoMdSpeedometer size={20} />
                        <span>Medium</span>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>Spaghetti</span>
                                <span className="text-gray-600">500g</span>
                            </li>
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>Eggs</span>
                                <span className="text-gray-600">4 pieces</span>
                            </li>
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>Pecorino Romano</span>
                                <span className="text-gray-600">100g</span>
                            </li>
                            <li className="flex justify-between border-b pb-2 items-center">
                                <span>Black Pepper</span>
                                <span className="text-gray-600">to taste</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Steps Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Steps</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Step Carousel */}
                        <div className="relative">
                            <div className="flex items-center">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <MdNavigateBefore size={24} />
                                </button>
                                
                                <div className="flex-1">
                                    <div className="text-center mb-4">
                                        <span className="text-sm text-gray-500">Step 1 of 4</span>
                                    </div>
                                    
                                    {/* Step Content */}
                                    <div className="space-y-4">
                                        <div className="w-1/2 h-1/4 mx-auto">
                                            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                                                <img 
                                                    src="https://placehold.co/800x600" 
                                                    alt="Step 1"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-gray-700">
                                            Bring a large pot of salted water to boil. Add spaghetti and cook according to package instructions until al dente.
                                        </p>
                                    </div>
                                </div>

                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <MdNavigateNext size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}