import { useApi } from '../utils/api';
import { ReviewFormData } from '../schemas/validationSchemas';

// Expone operaciones CRUD para reseñas aprovechando el cliente Axios centralizado.
export const useReviewsService = () => {
  const api = useApi();

  return {
    // Obtener reseñas de un producto (se podría activar rate limiting específico si el backend lo expone).
    getProductReviews: (productId: string) =>
      api.get<Review[]>(`/products/${productId}/reviews`),

    // Crear una nueva reseña asociada a un producto.
    createReview: (productId: string, review: ReviewFormData) =>
      api.post<Review>(`/products/${productId}/reviews`, review),

    // Marcar una reseña como útil (incrementa helpfulCount).
    markReviewAsHelpful: (reviewId: string) =>
      api.post<{ helpfulCount: number }>(`/reviews/${reviewId}/helpful`),

    // Reportar una reseña para que el backend tome acciones de moderación.
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
