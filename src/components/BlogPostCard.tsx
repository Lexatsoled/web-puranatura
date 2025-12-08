import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { BlogPost } from '../types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
      onClick={() => onClick(post)}
    >
      <div className="relative h-48">
        <OptimizedImage
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full"
          aspectRatio={1.5}
          blur={true}
        />
        <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <span className="text-sm text-green-600 font-semibold">
            {post.category || 'General'}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {post.date
              ? new Date(post.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-green-800 font-display mb-3 group-hover:text-green-600 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {post.summary || post.excerpt || ''}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              {post.readTime || 5} min de lectura
            </span>
          </div>
          <span className="font-semibold text-green-600 group-hover:text-green-800 transition-colors duration-300">
            Leer más &rarr;
          </span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostCard;
