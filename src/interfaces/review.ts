export interface IReview {
    id: number;
    product_id: number;
    user_id: number;
    order_id: number | null;
    order_item_id: number | null;
    rating: number; // 1-5 stars
    title: string | null;
    comment: string | null;
    images: string[] | null; // Assuming JSON or comma-separated string of URLs
    is_verified_purchase: boolean;
    is_approved: boolean;
    helpful_count: number;
    not_helpful_count: number;
    reviewed_at: string; // The time user actually submitted the review
    created_at: string;
    updated_at: string;
} 