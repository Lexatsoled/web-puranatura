import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
    onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };

    const cardImageUrl = product.images[1]?.full ?? product.images[0].full;

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
            onClick={() => onViewDetails(product)}
        >
            <div className="relative h-56 bg-gray-100 flex items-center justify-center">
                <img src={cardImageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="mt-auto flex justify-between items-center">
                    <p className="text-xl font-bold text-green-700">DOP ${product.price.toFixed(2)}</p>
                    <button
                        onClick={handleAddToCart}
                        className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-colors duration-300"
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;