import React, { useMemo, useState } from 'react';
import { blogPosts } from '../data/blog';
import { BlogPost } from '../types';
import BlogPostModal from '../components/BlogPostModal';
import { sanitizeBlogPostContent } from '../src/utils/contentSanitizers';

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const sanitizedPosts = useMemo(
    () => blogPosts.map((post) => sanitizeBlogPostContent(post)),
    []
  );

  return (
    <>
      <div className="bg-emerald-50 py-16 md:py-24">
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
            {sanitizedPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-green-800 font-display mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{post.summary}</p>
                  <button
                    onClick={() => handleReadMore(post)}
                    className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-300 self-start mt-auto"
                  >
                    Leer más &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BlogPostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />
    </>
  );
};

export default BlogPage;
