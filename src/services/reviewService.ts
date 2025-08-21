import { clientAxios } from "../configs/config";
import type {
  IReview,
  IReviewsResponse,
  IReviewableProduct,
  IReviewForm,
  IReviewQueryParams,
  IReviewHelpfulness,
  IReviewHelpfulnessResponse,
  IReviewApiResponse,
  IReviewCreateResponse,
} from "../interfaces/review";

// Get product reviews
export const getProductReviews = async (
  productId: number,
  params?: IReviewQueryParams
): Promise<IReviewsResponse> => {
  let url = `/products/${productId}/reviews`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    
    if (params.rating) queryParams.append('rating', params.rating.toString());
    if (params.verified_only !== undefined) queryParams.append('verified_only', params.verified_only.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await clientAxios.get(url);
  return response.data.data;
};

// Get reviewable products (requires auth)
export const getReviewableProducts = async (): Promise<IReviewableProduct[]> => {
  const response = await clientAxios.get('/reviews/reviewable-products');
  return response.data.data;
};

// Get reviewable products for specific order (requires auth)
export const getOrderReviewableProducts = async (orderId: number) => {
  console.log(`🔍 Getting reviewable products for order ${orderId}`);
  const response = await clientAxios.get(`/reviews/reviewable-products/${orderId}`);
  console.log(`📋 Order ${orderId} reviewable products:`, response.data);
  return response.data.data;
};

// Create product review (requires auth)
export const createProductReview = async (
  productId: number,
  reviewData: IReviewForm
): Promise<IReviewCreateResponse> => {
  console.log('🚀 Starting createProductReview:', { productId, reviewData });

  const formData = new FormData();

  // Required fields
  formData.append('rating', reviewData.rating.toString());
  formData.append('order_item_id', reviewData.order_item_id.toString());

  // Optional fields
  if (reviewData.title) formData.append('title', reviewData.title);
  if (reviewData.comment) formData.append('comment', reviewData.comment);

  // Images
  if (reviewData.images && reviewData.images.length > 0) {
    reviewData.images.forEach((file) => {
      formData.append('images[]', file);
    });
  }

  console.log('📤 Making API call to:', `/products/${productId}/reviews`);
  console.log('📋 FormData entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }

  try {
    const response = await clientAxios.post(`/products/${productId}/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ API Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw error;
  }
};

// Get review details
export const getReviewDetails = async (
  productId: number,
  reviewId: number
): Promise<IReview> => {
  const response = await clientAxios.get(`/products/${productId}/reviews/${reviewId}`);
  return response.data.data;
};

// Update review (requires auth)
export const updateProductReview = async (
  productId: number,
  reviewId: number,
  reviewData: Partial<IReviewForm>
): Promise<IReview> => {
  // If has images, use FormData with method override
  if (reviewData.images && reviewData.images.length > 0) {
    const formData = new FormData();
    
    // Method override for PUT with file upload
    formData.append('_method', 'PUT');
    
    if (reviewData.rating) formData.append('rating', reviewData.rating.toString());
    if (reviewData.title) formData.append('title', reviewData.title);
    if (reviewData.comment) formData.append('comment', reviewData.comment);
    
    // Replace all images
    reviewData.images.forEach((file) => {
      formData.append('images[]', file);
    });

    const response = await clientAxios.post(`/products/${productId}/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } else {
    // JSON update (no images)
    const { images, order_item_id, ...updateData } = reviewData;
    
    const response = await clientAxios.put(`/products/${productId}/reviews/${reviewId}`, updateData);
    return response.data.data;
  }
};

// Delete review (requires auth)
export const deleteProductReview = async (
  productId: number,
  reviewId: number
): Promise<void> => {
  await clientAxios.delete(`/products/${productId}/reviews/${reviewId}`);
};

// Mark review helpfulness (requires auth)
export const markReviewHelpfulness = async (
  productId: number,
  reviewId: number,
  helpfulness: IReviewHelpfulness
): Promise<IReviewHelpfulnessResponse> => {
  const response = await clientAxios.post(
    `/products/${productId}/reviews/${reviewId}/helpful`,
    helpfulness
  );
  return response.data.data;
};

// Helper function to check if user can review product
export const canUserReviewProduct = async (productId: number): Promise<boolean> => {
  try {
    const reviewableProducts = await getReviewableProducts();
    return reviewableProducts.some(item => item.product.id === productId);
  } catch (error) {
    return false;
  }
};

// Helper function to get user's review for a product
export const getUserReviewForProduct = async (
  productId: number,
  userId: number
): Promise<IReview | null> => {
  try {
    const reviews = await getProductReviews(productId, { per_page: 100 });
    return reviews.reviews.data.find(review => review.user.id === userId) || null;
  } catch (error) {
    return null;
  }
};
