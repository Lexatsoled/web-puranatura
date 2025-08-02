import { useApi } from '../utils/api';
import { ReviewFormData } from '../schemas/validationSchemas';

export const useReviewsService = () => {
  const api = useApi();

  return {
    // Obtener reseñas de un producto
    getProductReviews: (productId: string) =>
      api.get<Review[]>(`/products/${productId}/reviews`, {
        // Configuración específica de rate limiting para este endpoint
        rateLimitConfig: {
          maxRequests: 30,  // 30 solicitudes
          timeWindow: 60000 // por minuto
        }
      }),

    // Crear una nueva reseña
    createReview: (productId: string, review: ReviewFormData) =>
      api.post<Review>(`/products/${productId}/reviews`, review),

    // Marcar una reseña como útil
    markReviewAsHelpful: (reviewId: string) =>
      api.post<{ helpfulCount: number }>(`/reviews/${reviewId}/helpful`),

    // Reportar una reseña
    reportReview: (reviewId: string, reason: string) =>
      api.post(`/reviews/${reviewId}/report`, { reason }),
  };
};

// Tipos
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}
