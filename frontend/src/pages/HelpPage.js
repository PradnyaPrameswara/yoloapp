import React from 'react';
import { loadSignImages } from '../utils/imageImporter';

const HelpPage = ({ onNavigate }) => {
    const images = loadSignImages();

    const signs = [
        { name: 'Number 0', img: images.imgNum0 },
        { name: 'Number 1', img: images.imgNum1 },
        { name: 'Number 2', img: images.imgNum2 },
        { name: 'Number 3', img: images.imgNum3 },
        { name: 'Number 4', img: images.imgNum4 },
        { name: 'Number 5', img: images.imgNum5 },
        { name: 'Number 6', img: images.imgNum6 },
        { name: 'Number 7', img: images.imgNum7 },
        { name: 'Number 8', img: images.imgNum8 },
        { name: 'Number 9', img: images.imgNum9 },
        { name: 'Tambah (+)', img: images.imgTambah },
        { name: 'Kurang (-)', img: images.imgKurang },
        { name: 'Kali (x)', img: images.imgKali },
        { name: 'Bagi (/)', img: images.imgBagi },
        { name: 'Start', img: images.imgStart },
        { name: 'Undefined', img: images.imgUndefined },
    ].filter(sign => sign.img !== null); // Filter out signs with missing images

    return (
        <div className="w-full max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-center">Sign Language Guide</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {signs.map((sign) => (
                    <div key={sign.name} className="flex flex-col items-center bg-gray-700 p-4 rounded-lg">
                        {sign.img ? (
                            <img 
                                src={sign.img} 
                                alt={sign.name} 
                                className="w-full h-auto rounded-md mb-2 object-cover aspect-square"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div 
                            className="w-full aspect-square bg-gray-600 rounded-md mb-2 flex items-center justify-center text-gray-400 text-sm hidden"
                            style={{display: sign.img ? 'none' : 'flex'}}
                        >
                            Image not found
                        </div>
                        <p className="font-semibold text-center">{sign.name}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <button 
                    onClick={() => onNavigate('home')}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default HelpPage;
