'use client'
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useState } from 'react';


type StepsProps = {
    stepIndex: number;
    onRemove: () => void;
}

type Step = {
    directions: string,
    image?: File,
}

export default function Steps({ stepIndex, onRemove}: StepsProps) {

    const [imagePreview, setImagePreview] = useState<string>(``);

    const [currentStep, setCurrentStep] =  useState<Step>({
        directions: ``,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name, value} = e.target;
        if (name == `image` && e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];

            setImagePreview(URL.createObjectURL(file));
            setCurrentStep(prev => ({ ...prev, image: file }));
        } else{
            setCurrentStep( (prev)=>({...prev, [name]:value}))

        }
    }


    return (
        <div className="border rounded-lg p-4 relative">
            {/* Remove Button */}
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => onRemove()}
            >
                <FaTrash size={16} />
            </button>
            <p className="font-semibold mb-3">Step {stepIndex}</p>
            <div className="space-y-3">
                {/* Image Upload Box */}
                <div className="flex flex-col justify-center gap-10 items-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors">
                    {imagePreview ? (
                        <img 
                            src={imagePreview}
                            className="w-full h-full object-cover"
                        />
                    ):(
                     <input 
                        type="file"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                        id="step-image"
                    />)}
                    
                    <label htmlFor="step-image" className="cursor-pointer mt-10">
                        <FaPlus size={24} color="#9CA3AF" />
                    </label>
                    <p className="text-sm text-gray-500">Add Image (Optional)</p>

                </div>
                <textarea 
                    placeholder="Step description"
                    name="directions"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    required
                />
            </div>
        </div>
            
    )
}