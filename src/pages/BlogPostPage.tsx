import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blog';

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (postId) {
      const foundPost = blogPosts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
        
        // Set SEO metadata
        document.title = `${foundPost.title} | Pureza Naturalis Blog`;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', foundPost.summary);
        }

        // Get related posts (other posts excluding current one)
        const related = blogPosts
          .filter(p => p.id !== postId)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        navigate('/blog');
      }
    }
    setIsLoading(false);
  }, [postId, navigate]);

  if (isLoading) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Artículo no encontrado</h1>
          <Link 
            to="/blog" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6">
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600">Inicio</Link>
          <span className="mx-2">›</span>
          <Link to="/blog" className="hover:text-green-600">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{post.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-green-800 font-display mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {post.summary}
                  </p>
                </header>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-green prose-headings:text-green-800 prose-a:text-green-600 prose-strong:text-green-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags/Categories (if we had them) */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      Bienestar
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      Salud Natural
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      Medicina Herbal
                    </span>
                  </div>
                </div>

                {/* Share/Back Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/blog"
                    className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ← Volver al Blog
                  </Link>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center justify-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ↑ Ir al inicio
                  </button>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  📧 Suscríbete a nuestro Newsletter
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Recibe consejos de bienestar y ofertas especiales directamente en tu email.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Suscribirse
                  </button>
                </div>
              </motion.div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-6">
                    📚 Artículos Relacionados
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {relatedPost.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-3">
                  🌿 ¿Necesitas Asesoría?
                </h3>
                <p className="text-green-100 mb-4 text-sm">
                  Nuestros expertos en bienestar están aquí para ayudarte a encontrar los productos perfectos para tu salud.
                </p>
                <Link
                  to="/contacto"
                  className="inline-block w-full text-center bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Contactar Experto
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
