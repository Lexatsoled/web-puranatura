import React from 'react';
import { BlogPost } from '../types';

interface BlogPostModalProps {
    post: BlogPost | null;
    isOpen: boolean;
    onClose: () => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, isOpen, onClose }) => {
    if (!isOpen || !post) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                    <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">{post.title}</h2>
                    <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
                <div className="p-4 bg-gray-50 border-t text-right">
                   <button
                        onClick={onClose}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                    >
                        Cerrar
                    </button>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default BlogPostModal;
