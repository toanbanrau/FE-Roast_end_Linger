import { adminAxios } from "../configs/config";
import type {
  IAdminReview,
  IAdminReviewsResponse,
  IAdminReviewQueryParams,
  IAdminReviewStatistics,
  IAdminReviewActionResponse,
} from "../interfaces/adminReview";

/**
 * Admin Review Management Service
 * Handles all admin operations for managing product reviews
 */

// Get all reviews with admin filters and statistics
export const getAdminReviews = async (
  params?: IAdminReviewQueryParams
): Promise<IAdminReviewsResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.rating) queryParams.append('rating', params.rating.toString());
    if (params.verified_only !== undefined) queryParams.append('verified_only', params.verified_only.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.product_id) queryParams.append('product_id', params.product_id.toString());
    if (params.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  }

  const url = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await adminAxios.get(url);
  return response.data.data;
};

// Get single review details for admin
export const getAdminReviewDetails = async (reviewId: number): Promise<IAdminReview> => {
  const response = await adminAxios.get(`/reviews/${reviewId}`);
  return response.data.data;
};

// Update review approval status (Approve or Reject)
export const updateReviewApproval = async (
  reviewId: number,
  is_approved: 0 | 1
): Promise<IAdminReviewActionResponse> => {
  const response = await adminAxios.put(`/reviews/${reviewId}/approval`, { is_approved });
  return response.data.data;
};

// Approve a review
export const approveReview = async (reviewId: number): Promise<IAdminReviewActionResponse> => {
  return updateReviewApproval(reviewId, 1);
};

// Reject a review
export const rejectReview = async (
  reviewId: number
): Promise<IAdminReviewActionResponse> => {
  return updateReviewApproval(reviewId, 0);
};

// Delete a review (permanent removal)
export const deleteAdminReview = async (reviewId: number): Promise<IAdminReviewActionResponse> => {
  const response = await adminAxios.delete(`/reviews/${reviewId}`);
  return response.data.data;
};

// Update review content (admin override)
export const updateAdminReview = async (
  reviewId: number,
  updateData: {
    title?: string;
    comment?: string;
    rating?: number;
  }
): Promise<IAdminReview> => {
  const response = await adminAxios.put(`/admin/reviews/${reviewId}`, updateData);
  return response.data.data;
};

// Get review statistics for admin dashboard
export const getAdminReviewStatistics = async (): Promise<IAdminReviewStatistics> => {
  const response = await adminAxios.get('/admin/reviews/statistics');
  return response.data.data;
};

// Bulk approve reviews
export const bulkApproveReviews = async (reviewIds: number[]): Promise<IAdminReviewActionResponse> => {
  const response = await adminAxios.post('/admin/reviews/bulk-approve', {
    review_ids: reviewIds
  });
  return response.data.data;
};

// Bulk reject reviews
export const bulkRejectReviews = async (
  reviewIds: number[],
  reason?: string
): Promise<IAdminReviewActionResponse> => {
  const data = reason ? { review_ids: reviewIds, reason } : { review_ids: reviewIds };
  const response = await adminAxios.post('/admin/reviews/bulk-reject', data);
  return response.data.data;
};

// Get pending reviews count for admin dashboard
export const getPendingReviewsCount = async (): Promise<number> => {
  const response = await adminAxios.get('/admin/reviews/pending-count');
  return response.data.data.count;
};

// Export reviews data (CSV/Excel)
export const exportReviews = async (
  params?: IAdminReviewQueryParams,
  format: 'csv' | 'excel' = 'csv'
): Promise<Blob> => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.status) queryParams.append('status', params.status);
    if (params.rating) queryParams.append('rating', params.rating.toString());
    if (params.verified_only !== undefined) queryParams.append('verified_only', params.verified_only.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.product_id) queryParams.append('product_id', params.product_id.toString());
    if (params.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    queryParams.append('format', format);
  }

  const response = await adminAxios.get(`/admin/reviews/export?${queryParams.toString()}`, {
    responseType: 'blob'
  });

  return response.data;
};

// Reply to a review
export const replyToReview = async (payload: {
  review_id: number;
  content: string;
  status?: string;
}): Promise<IAdminReviewActionResponse> => {
  const response = await adminAxios.post("/review-replies", payload);
  return response.data.data;
};
