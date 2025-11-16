import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { generateProductSEO } from '../utils/seo';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useNavigationState } from '../hooks/useNavigationState';
import QuantitySelector from '../../components/QuantitySelector';
import ImageZoom from '../../components/ImageZoom';
import ProductTabs from '../../components/ProductTabs';
import ScientificReferences from '../../components/ScientificReferences';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore(state => state.addToCart);
  const getItemQuantity = useCartStore(state => state.getItemQuantity);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { returnToStore, getNavigationState } = useNavigationState();

  // Reset scroll to top when product changes
  useScrollToTop([productId]);

  // Verificar si hay estado de navegación guardado para mostrar el botón
  const hasStoredState = getNavigationState() !== null;

  useEffect(() => {
    if (productId) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        // Set SEO metadata
        const seoData = generateProductSEO(foundProduct);
        if (seoData.title) {
          document.title = seoData.title;
        }
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && seoData.description) {
          metaDescription.setAttribute('content', seoData.description);
        }
      } else {
        navigate('/tienda');
      }
    }
    setIsLoading(false);
  }, [productId, navigate]);

  if (isLoading) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <Link 
            to="/tienda" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
  };

  const handleWishlistToggle = () => {
    toggleItem(product);
  };

  return (
    <div className="bg-emerald-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex justify-between items-center mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
                Inicio
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/tienda" className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2">
                  Tienda
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.name}</span>
              </div>
            </li>
          </ol>
          
          {/* Botón Volver a la lista - solo si hay estado guardado */}
          {hasStoredState && (
            <button
              onClick={returnToStore}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Volver a la lista
            </button>
          )}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start"
        >
          {/* Galería de imágenes */}
          <div className="flex flex-col-reverse">
            {/* Imagen principal */}
            <div className="w-full">
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <ImageZoom
                  src={typeof product.images[selectedImageIndex] === 'string' ? product.images[selectedImageIndex] : product.images[selectedImageIndex].full}
                  alt={product.name}
                  zoom={2}
                  className="w-full max-w-lg mx-auto"
                />
              </div>
            </div>

            {/* Miniaturas */}
            <div className="mt-6 w-full max-w-2xl mx-auto lg:max-w-none">
              <div className="flex flex-wrap justify-center gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      index === selectedImageIndex 
                        ? 'ring-2 ring-green-600 shadow-lg transform scale-105' 
                        : 'border border-gray-200 hover:border-green-400 hover:shadow'
                    }`}
                  >
                    <span className="sr-only">Imagen {index + 1}</span>
                    <img 
                      src={typeof image === 'string' ? image : image.thumbnail || image.full} 
                      alt={`Vista ${index + 1}`} 
                      className="w-16 h-16 object-contain p-1" 
                    />
                    {index === selectedImageIndex && (
                      <span className="absolute inset-0 border-2 border-green-600 rounded-lg pointer-events-none"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">
              {product.name}
            </h1>
            
            <div className="mt-3">
              <p className="text-3xl text-gray-900 font-bold">
                {product.price.toFixed(2)} RDS
              </p>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <p className="font-semibold">Información Precio Comparativo:</p>
                <p>La cápsula le sale a 125 RDS</p>
              </div>
            </div>

            {/* Stock y disponibilidad - Solo mostrar disponibilidad general */}
            <div className="mt-6">
              {product.stock && product.stock > 0 ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">En stock</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Agotado</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <h3 className="sr-only">Descripción</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Beneficios */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Beneficios</h3>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredientes */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Ingredientes</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            )}



            {/* Selector de cantidad */}
            {product.stock > 0 && (
              <div className="mt-8">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-900">
                    Cantidad:
                  </label>
                  <QuantitySelector
                    min={1}
                    max={3}
                    value={selectedQuantity}
                    onChange={setSelectedQuantity}
                    size="md"
                    variant="white"
                    disabled={product.stock === 0}
                  />
                </div>
              </div>
            )}

            {/* Controles de acción */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 w-full px-6 py-3 rounded-md transition-colors font-medium ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {product.stock === 0 
                  ? 'Agotado' 
                  : quantity > 0 
                    ? `En carrito (${quantity}) - Añadir ${selectedQuantity} más` 
                    : `Agregar al carrito ${selectedQuantity > 1 ? `(${selectedQuantity})` : ''}`
                }
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3 rounded-md border transition-colors font-medium ${
                  inWishlist
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {inWishlist ? '❤️ En lista de deseos' : '🤍 Agregar a mi lista de deseos'}
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="grid grid-cols-1 gap-y-4">
                {product.brand && (
                  <div>
                    <span className="text-sm font-medium text-gray-900">Marca: </span>
                    <span className="text-sm text-gray-600">{product.brand}</span>
                  </div>
                )}
                {product.categories && product.categories.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-900">Categorías: </span>
                    <span className="text-sm text-gray-600">{product.categories.join(', ')}</span>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-900">Etiquetas: </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pestañas de información del producto */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 font-display">Información del producto</h3>
          <ProductTabs
            tabs={[
              {
                id: 'description',
                label: 'Descripción Detallada',
                content: (
                  <div>
                    {product.detailedDescription ? (
                      <>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Acerca de {product.name}</h4>
                        <p className="mb-6">{product.detailedDescription}</p>

                        {product.mechanismOfAction && (
                          <>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mecanismo de acción</h4>
                            <p className="mb-6">{product.mechanismOfAction}</p>
                          </>
                        )}

                        {product.benefitsDescription && product.benefitsDescription.length > 0 && (
                          <>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Beneficios</h4>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                              {product.benefitsDescription.map((benefit, idx) => (
                                <li key={idx} className="text-gray-700">{benefit}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        {product.healthIssues && product.healthIssues.length > 0 && (
                          <>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ayuda con</h4>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                              {product.healthIssues.map((issue, idx) => (
                                <li key={idx} className="text-gray-700">{issue}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-600">No hay información detallada disponible para este producto.</p>
                    )}
                  </div>
                ),
              },
              {
                id: 'components',
                label: 'Componentes',
                content: (
                  <div>
                    {product.components && product.components.length > 0 ? (
                      <>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Ingredientes activos</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Componente
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Cantidad
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {product.components.map((component, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{component.name}</div>
                                    <div className="text-sm text-gray-500">{component.description}</div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {component.amount || 'No especificado'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">No hay información sobre componentes disponible para este producto.</p>
                    )}
                  </div>
                ),
              },
              {
                id: 'usage',
                label: 'Modo de empleo',
                content: (
                  <div>
                    {product.usage || product.dosage || product.administrationMethod ? (
                      <>
                        {product.usage && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Instrucciones de uso</h4>
                            <p className="mb-6 text-gray-700">{product.usage}</p>
                          </>
                        )}
                        {product.dosage && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Dosis recomendada</h4>
                            <p className="mb-6 text-gray-700">{product.dosage}</p>
                          </>
                        )}
                        {product.administrationMethod && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Forma de administración</h4>
                            <p className="mb-6 text-gray-700">{product.administrationMethod}</p>
                          </>
                        )}

                        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                          <h4 className="text-lg font-medium text-blue-800 mb-2">Aviso importante</h4>
                          <p className="text-blue-700">Los suplementos dietéticos no deben utilizarse como sustituto de una dieta variada y equilibrada. No exceda la dosis diaria recomendada. Si está embarazada, amamantando, tomando medicamentos o tiene una condición médica, consulte a un profesional de la salud antes de usar.</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">No hay información sobre el modo de empleo disponible para este producto.</p>
                    )}
                  </div>
                ),
              },
              {
                id: 'faqs',
                label: 'Preguntas frecuentes',
                content: (
                  <div>
                    {product.faqs && product.faqs.length > 0 ? (
                      <div className="space-y-6">
                        {product.faqs.map((faq, idx) => (
                          <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h4>
                            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No hay preguntas frecuentes disponibles para este producto.</p>
                    )}
                  </div>
                ),
              },
              {
                id: 'scientific-references',
                label: 'Referencias Científicas',
                content: (
                  <ScientificReferences product={product} />
                ),
              },
            ]}
            className="mt-4"
          />
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          {(() => {
            // Definir sistemas sinérgicos específicos
            const energySystemProducts = ['102', 'pr-ashwagandha', '105', '1']; // CoQ10, Ashwagandha, Magnesio Citrato, Vitamina C
            const antiAgingSystemProducts = ['1', '9', 'prb-bamboo', '16', '6']; // Vitamina C, Colágeno, Bambú, Ácido Hialurónico, Vitamina E
            const articularSystemProducts = ['5', 'pr-collagen-peptides', 'pr-turmeric-advanced', 'pr-bamboo-extract']; // Glucosamina+Condroitina, Colágeno, Cúrcuma, Bambú
            
            // Verificar si el producto actual pertenece a un sistema sinérgico
            const isEnergySystemProduct = energySystemProducts.includes(product.id);
            const isAntiAgingSystemProduct = antiAgingSystemProducts.includes(product.id);
            const isArticularSystemProduct = articularSystemProducts.includes(product.id);
            
            let relatedProducts = [];
            
            if (isEnergySystemProduct) {
              // Si es producto del Sistema Energía Natural, mostrar otros componentes del sistema
              relatedProducts = energySystemProducts
                .filter(id => id !== product.id)
                .map(id => products.find(p => p.id === id))
                .filter(product => product !== undefined)
                .slice(0, 4);
            } else if (isAntiAgingSystemProduct) {
              // Si es producto del Sistema Anti-Edad, mostrar otros componentes del sistema
              relatedProducts = antiAgingSystemProducts
                .filter(id => id !== product.id)
                .map(id => products.find(p => p.id === id))
                .filter(product => product !== undefined)
                .slice(0, 4);
            } else if (isArticularSystemProduct) {
              // Si es producto del Sistema Articular Avanzado, mostrar otros componentes del sistema
              relatedProducts = articularSystemProducts
                .filter(id => id !== product.id)
                .map(id => products.find(p => p.id === id))
                .filter(product => product !== undefined)
                .slice(0, 4);
            } else {
              // Para otros productos, usar lógica de categorías comunes
              relatedProducts = products
                .filter(p => {
                  return p.categories && product.categories && 
                         p.categories.some(cat => product.categories!.includes(cat)) && 
                         p.id !== product.id;
                })
                .slice(0, 4);
            }
            
            return (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  {isEnergySystemProduct ? (
                    <span>⚡ <span className="text-red-600">Sistema Energía Natural</span> - Productos Complementarios</span>
                  ) : isAntiAgingSystemProduct ? (
                    <span>🌿 <span className="text-green-600">Sistema Anti-Edad</span> - Productos Complementarios</span>
                  ) : (
                    'Productos relacionados'
                  )}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/producto/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={typeof relatedProduct.images[0] === 'string' ? relatedProduct.images[0] : relatedProduct.images[0].full}
                        alt={relatedProduct.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
