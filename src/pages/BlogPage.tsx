import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';

const BlogPage: React.FC = () => {
  return (
    <div className="bg-emerald-100 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Nuestro Blog de Bienestar
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Artículos e información para inspirarte en tu camino hacia una
            vida más saludable y consciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col transform hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-green-800 font-display mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{post.summary}</p>
                <span className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-300 self-start mt-auto">
                  Leer más &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
