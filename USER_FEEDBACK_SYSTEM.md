# User Feedback System Implementation

## Overview

A comprehensive user feedback system that includes ratings, reviews, surveys, and feedback forms to collect user insights and improve the product experience.

## Rating and Review Components

### Star Rating Component

```typescript
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  readonly = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleClick = (value: number) => {
    if (!interactive || readonly) return;
    setSelectedRating(value);
    onChange?.(value);
  };

  const handleMouseEnter = (value: number) => {
    if (!interactive || readonly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!interactive || readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || selectedRating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartial = starValue > displayRating && starValue - 1 < displayRating;

          return (
            <button
              key={index}
              type="button"
              className={`relative ${sizeClasses[size]} ${
                interactive && !readonly ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <StarIcon
                className={`${
                  isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                } ${sizeClasses[size]}`}
              />
              {isPartial && (
                <div className="absolute inset-0 overflow-hidden w-full">
                  <StarIcon
                    className={`text-yellow-400 fill-current ${sizeClasses[size]}`}
                    style={{
                      width: `${((displayRating - (starValue - 1)) * 100)}%`
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {displayRating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};
```

### Review Form Component

```typescript
interface ReviewFormProps {
  productId: string;
  onSubmit: (review: ReviewData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  authorEmail?: string;
  verified: boolean;
  images?: File[];
  helpful: number;
  notHelpful: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmit,
  onCancel,
  className = ''
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (!title.trim()) newErrors.title = 'Please enter a review title';
    if (!comment.trim()) newErrors.comment = 'Please enter your review';
    if (!authorName.trim()) newErrors.authorName = 'Please enter your name';

    if (authorEmail && !/\S+@\S+\.\S+/.test(authorEmail)) {
      newErrors.authorEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const reviewData: ReviewData = {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        verified: false, // Will be set by backend based on purchase verification
        images: images.length > 0 ? images : undefined,
        helpful: 0,
        notHelpful: 0
      };

      await onSubmit(reviewData);

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setAuthorName('');
      setAuthorEmail('');
      setImages([]);
      setErrors({});
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Please select images under 5MB.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating *
        </label>
        <StarRating
          rating={rating}
          onChange={setRating}
          interactive
          size="lg"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Summarize your experience"
          maxLength={100}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Tell others about your experience with this product"
          maxLength={1000}
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {comment.length}/1000
        </div>
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
        )}
      </div>

      {/* Author Name */}
      <div>
        <label htmlFor="author-name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="author-name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your name"
          maxLength={50}
        />
        {errors.authorName && (
          <p className="mt-1 text-sm text-red-600">{errors.authorName}</p>
        )}
      </div>

      {/* Author Email (Optional) */}
      <div>
        <label htmlFor="author-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address (Optional)
        </label>
        <input
          type="email"
          id="author-email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="your.email@example.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          We'll use this to verify your purchase (optional)
        </p>
        {errors.authorEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.authorEmail}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <PlusIcon className="w-6 h-6 text-gray-400" />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Upload up to 5 photos (max 5MB each)
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
```

### Review Display Component

```typescript
interface ReviewCardProps {
  review: ReviewData & {
    id: string;
    productId: string;
    createdAt: Date;
    updatedAt?: Date;
  };
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showProductInfo?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onNotHelpful,
  onReport,
  showProductInfo = false,
  className = ''
}) => {
  const [userVote, setUserVote] = useState<'helpful' | 'notHelpful' | null>(null);

  const handleHelpful = () => {
    if (userVote === 'helpful') return;
    setUserVote('helpful');
    onHelpful?.(review.id);
  };

  const handleNotHelpful = () => {
    if (userVote === 'notHelpful') return;
    setUserVote('notHelpful');
    onNotHelpful?.(review.id);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <article className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{review.authorName}</h4>
              {review.verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Compra verificada
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <StarRating rating={review.rating} size="sm" readonly />
              <span>•</span>
              <time dateTime={review.createdAt.toISOString()}>
                {formatDate(review.createdAt)}
              </time>
            </div>
          </div>
        </div>
        <button
          onClick={() => onReport?.(review.id)}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Report this review"
        >
          <FlagIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md border border-gray-300 flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-1 text-sm ${
              userVote === 'helpful'
                ? 'text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <ThumbsUpIcon className="w-4 h-4" />
            Útil ({review.helpful + (userVote === 'helpful' ? 1 : 0)})
          </button>
          <button
            onClick={handleNotHelpful}
            className={`flex items-center gap-1 text-sm ${
              userVote === 'notHelpful'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <ThumbsDownIcon className="w-4 h-4" />
            No útil ({review.notHelpful + (userVote === 'notHelpful' ? 1 : 0)})
          </button>
        </div>
        {showProductInfo && (
          <span className="text-sm text-gray-500">
            Para {review.productId}
          </span>
        )}
      </div>
    </article>
  );
};
```

### Review Summary Component

```typescript
interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: { [key: number]: number };
  showBreakdown?: boolean;
  className?: string;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  averageRating,
  totalReviews,
  distribution,
  showBreakdown = true,
  className = ''
}) => {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 4.0) return 'Muy bueno';
    if (rating >= 3.5) return 'Bueno';
    if (rating >= 3.0) return 'Regular';
    return 'Deficiente';
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="sm" readonly className="justify-center" />
          <div className="text-sm text-gray-600 mt-1">
            {totalReviews} reseñas
          </div>
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 mb-1">
            {getRatingText(averageRating)}
          </div>
          <div className="text-sm text-gray-600">
            Basado en {totalReviews} reseñas de clientes verificados
          </div>
        </div>
      </div>

      {showBreakdown && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = distribution[rating] || 0;
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

## Survey System

### Survey Component

```typescript
interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no';
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface SurveyProps {
  surveyId: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  onSubmit: (responses: SurveyResponse) => Promise<void>;
  onSkip?: () => void;
  className?: string;
}

interface SurveyResponse {
  surveyId: string;
  responses: { [questionId: string]: any };
  submittedAt: Date;
  userId?: string;
}

const Survey: React.FC<SurveyProps> = ({
  surveyId,
  title,
  description,
  questions,
  onSubmit,
  onSkip,
  className = ''
}) => {
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = !currentQ.required || responses[currentQ.id] !== undefined;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const surveyResponse: SurveyResponse = {
        surveyId,
        responses,
        submittedAt: new Date()
      };
      await onSubmit(surveyResponse);
    } catch (error) {
      console.error('Failed to submit survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              {question.question}
            </label>
            <StarRating
              rating={responses[question.id] || 0}
              onChange={(value) => handleResponse(question.id, value)}
              interactive
              size="lg"
              showValue
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <label htmlFor={`question-${question.id}`} className="block text-lg font-medium text-gray-900">
              {question.question}
            </label>
            <textarea
              id={`question-${question.id}`}
              value={responses[question.id] || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              {question.question}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={(e) => handleResponse(question.id, e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              {question.question}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="yes"
                  checked={responses[question.id] === 'yes'}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Sí</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="no"
                  checked={responses[question.id] === 'no'}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          Pregunta {currentQuestion + 1} de {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        {renderQuestion(currentQ)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <div className="flex gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Saltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : isLastQuestion ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Feedback Collection System

### Inline Feedback Component

```typescript
interface InlineFeedbackProps {
  title?: string;
  placeholder?: string;
  onSubmit: (feedback: string, rating?: number) => Promise<void>;
  showRating?: boolean;
  className?: string;
}

const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  title = "¿Qué te parece?",
  placeholder = "Comparte tus pensamientos...",
  onSubmit,
  showRating = false,
  className = ''
}) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(feedback.trim(), showRating ? rating : undefined);
      setFeedback('');
      setRating(0);
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`text-sm text-gray-600 hover:text-gray-800 underline ${className}`}
      >
        {title}
      </button>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {showRating && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación (opcional)
          </label>
          <StarRating
            rating={rating}
            onChange={setRating}
            interactive
            size="md"
          />
        </div>
      )}

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-3"
        rows={3}
        maxLength={500}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {feedback.length}/500
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedback.trim() || isSubmitting}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Implementation Strategy

### Data Storage

```typescript
// Review data structure
interface Review {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Survey data structure
interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  targetAudience?: 'all' | 'purchasers' | 'visitors';
  triggerEvent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Feedback data structure
interface Feedback {
  id: string;
  type: 'review' | 'survey' | 'inline' | 'bug_report';
  content: string;
  rating?: number;
  metadata: {
    url: string;
    userAgent: string;
    sessionId: string;
    userId?: string;
  };
  createdAt: Date;
}
```

### API Integration

```typescript
class FeedbackService {
  // Reviews
  async submitReview(
    review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Review> {
    const response = await api.post('/reviews', review);
    return response.data;
  }

  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: Review[];
    total: number;
    averageRating: number;
    distribution: { [key: number]: number };
  }> {
    const response = await api.get(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  }

  async voteOnReview(
    reviewId: string,
    vote: 'helpful' | 'notHelpful'
  ): Promise<void> {
    await api.post(`/reviews/${reviewId}/vote`, { vote });
  }

  // Surveys
  async getActiveSurveys(userId?: string): Promise<Survey[]> {
    const response = await api.get('/surveys/active', {
      params: { userId },
    });
    return response.data;
  }

  async submitSurveyResponse(response: SurveyResponse): Promise<void> {
    await api.post('/surveys/responses', response);
  }

  // General feedback
  async submitFeedback(
    feedback: Omit<Feedback, 'id' | 'createdAt'>
  ): Promise<Feedback> {
    const response = await api.post('/feedback', feedback);
    return response.data;
  }
}
```

## Analytics and Insights

### Review Analytics

```typescript
interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  verifiedReviewsPercentage: number;
  reviewsByProduct: { [productId: string]: number };
  reviewsOverTime: { date: string; count: number }[];
  topRatedProducts: { productId: string; averageRating: number }[];
  commonKeywords: { word: string; frequency: number }[];
}

class ReviewAnalyticsService {
  async getAnalytics(
    productId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<ReviewAnalytics> {
    const params = new URLSearchParams();
    if (productId) params.append('productId', productId);
    if (dateRange) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }

    const response = await api.get(`/analytics/reviews?${params}`);
    return response.data;
  }

  async getSentimentAnalysis(reviews: Review[]): Promise<{
    positive: number;
    negative: number;
    neutral: number;
    sentimentByRating: {
      [rating: number]: 'positive' | 'negative' | 'neutral';
    };
  }> {
    const response = await api.post('/analytics/reviews/sentiment', {
      reviews,
    });
    return response.data;
  }
}
```

## Moderation System

### Review Moderation

```typescript
interface ModerationAction {
  id: string;
  reviewId: string;
  action: 'approve' | 'reject' | 'flag' | 'delete';
  reason?: string;
  moderatorId: string;
  timestamp: Date;
}

class ModerationService {
  async moderateReview(
    reviewId: string,
    action: ModerationAction['action'],
    reason?: string
  ): Promise<void> {
    await api.post(`/moderation/reviews/${reviewId}`, {
      action,
      reason,
    });
  }

  async getPendingReviews(): Promise<Review[]> {
    const response = await api.get('/moderation/reviews/pending');
    return response.data;
  }

  async getModerationHistory(reviewId: string): Promise<ModerationAction[]> {
    const response = await api.get(`/moderation/reviews/${reviewId}/history`);
    return response.data;
  }
}
```

## Success Metrics

### Review System Metrics

- **Review Completion Rate**: Percentage of purchases that result in reviews
- **Average Rating**: Overall product rating trends
- **Helpful Votes**: User engagement with review content
- **Review Quality Score**: Based on length, detail, and user feedback

### Survey Metrics

- **Response Rate**: Percentage of users who complete surveys
- **Survey Completion Time**: Average time to complete surveys
- **Actionable Insights**: Number of survey responses leading to product improvements
- **Net Promoter Score**: Customer loyalty measurement

### Feedback System Metrics

- **Feedback Volume**: Total feedback submissions over time
- **Feedback Categories**: Distribution of feedback types (bug reports, feature requests, etc.)
- **Resolution Rate**: Percentage of feedback items addressed
- **User Satisfaction**: Follow-up survey results on feedback handling

This comprehensive user feedback system provides multiple channels for collecting user insights, from detailed product reviews to quick inline feedback, enabling continuous improvement of the Pureza Naturalis platform.
