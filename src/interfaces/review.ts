// Product Review Interfaces

export interface IReviewUser {
  id: number;
  name: string;
  full_name: string;
}

export interface IReview {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  helpfulness_ratio: number;
  user_helpfulness: boolean | null; // null = not voted, true = helpful, false = not helpful
  time_ago: string;
  created_at: string;
  user: IReviewUser;
}

export interface IRatingDistribution {
  "1": { count: number; percentage: number };
  "2": { count: number; percentage: number };
  "3": { count: number; percentage: number };
  "4": { count: number; percentage: number };
  "5": { count: number; percentage: number };
}

export interface IReviewStatistics {
  average_rating: number;
  total_reviews: number;
  verified_purchase_count: number;
  rating_distribution: IRatingDistribution;
}

export interface IReviewsResponse {
  reviews: {
    data: IReview[];
    current_page: number;
    per_page: number;
    total: number;
  };
  statistics: IReviewStatistics;
}

// Reviewable Products
export interface IReviewableProduct {
  order_item_id: number;
  order_number: string;
  order_id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image: {
      url: string;
      alt_text: string;
    };
    category: {
      id: number;
      name: string;
    };
  };
  variant?: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
  formatted_unit_price: string;
  purchased_at: string;
  days_since_purchase: number;
  can_review: boolean;
}

// Review Form Data
export interface IReviewForm {
  rating: number;
  title?: string;
  comment?: string;
  order_item_id: number;
  images?: File[];
}

// Review Query Parameters
export interface IReviewQueryParams {
  rating?: number; // 1-5
  verified_only?: boolean;
  sort_by?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  per_page?: number;
  page?: number;
}

// Review Helpfulness
export interface IReviewHelpfulness {
  is_helpful: boolean;
}

export interface IReviewHelpfulnessResponse {
  helpful_count: number;
  not_helpful_count: number;
  user_vote: boolean | null;
}

// API Response Types
export interface IReviewApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IReviewCreateResponse {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number;
  order_item_id: number;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  reviewed_at: string;
  created_at: string;
  user: IReviewUser;
}