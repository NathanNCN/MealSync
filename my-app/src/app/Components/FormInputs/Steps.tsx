import { FaPlus, FaTrash } from 'react-icons/fa';


type StepsProps = {
    stepIndex: number;
    onRemove: () => void;
}

export default function Steps({ stepIndex, onRemove}: StepsProps) {
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
                    <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="step-image"
                    
                    />
                    <label htmlFor="step-image" className="cursor-pointer mt-10">
                        <FaPlus size={24} color="#9CA3AF" />
                    </label>
                    <p className="text-sm text-gray-500">Add Image (Optional)</p>

                </div>
                <textarea 
                    placeholder="Step description"
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    required
                />
            </div>
        </div>
            
    )
}