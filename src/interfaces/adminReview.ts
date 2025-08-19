// Admin Review Management Interfaces

export interface IAdminReviewUser {
  id: number;
  name: string;
  email: string;
  full_name: string;
}

export interface IAdminReviewProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface IAdminReviewOrder {
  id: number;
  order_number: string;
  status: string;
}

export interface IAdminReview {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  not_helpful_count: number;
  reviewed_at: string;
  created_at: string;
  user: IAdminReviewUser;
  product: IAdminReviewProduct;
  order: IAdminReviewOrder;
}

export interface IAdminReviewStatistics {
  total_reviews: number;
  approved_reviews: number;
  pending_reviews: number;
  average_rating: number;
}

export interface IAdminReviewsResponse {
  reviews: {
    data: IAdminReview[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  statistics: IAdminReviewStatistics;
}

export interface IAdminReviewQueryParams {
  page?: number;
  per_page?: number;
  status?: 'approved' | 'pending';
  rating?: number;
  verified_only?: boolean;
  search?: string;
  product_id?: number;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
}

export interface IAdminReviewActionResponse {
  success: boolean;
  message: string;
  review_id: number;
  action: 'approved' | 'rejected' | 'deleted' | 'updated';
  timestamp: string;
}

export interface IBulkReviewActionRequest {
  review_ids: number[];
  reason?: string;
}

export interface IBulkReviewActionResponse {
  success: boolean;
  message: string;
  processed_count: number;
  failed_count: number;
  failed_reviews: Array<{
    review_id: number;
    reason: string;
  }>;
}

export interface IReviewExportParams {
  status?: 'approved' | 'pending';
  rating?: number;
  verified_only?: boolean;
  search?: string;
  product_id?: number;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  format: 'csv' | 'excel';
}
