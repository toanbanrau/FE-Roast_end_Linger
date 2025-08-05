import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rate, Button, Select, Pagination, Avatar, Image, message } from 'antd';
import { LikeOutlined, DislikeOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getProductReviews, markReviewHelpfulness } from '../services/reviewService';
import type { IReview, IReviewQueryParams, IReviewsResponse } from '../interfaces/review';

const { Option } = Select;

interface ProductReviewsProps {
  productId: number;
  showCreateButton?: boolean;
  onCreateReview?: () => void;
}

export default function ProductReviews({ 
  productId, 
  showCreateButton = true,
  onCreateReview 
}: ProductReviewsProps) {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState<IReviewQueryParams>({
    sort_by: 'newest',
    per_page: 10,
    page: 1,
  });

  // Fetch reviews
  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId, queryParams],
    queryFn: () => getProductReviews(productId, queryParams),
  });

  // Mark helpfulness mutation
  const helpfulnessMutation = useMutation({
    mutationFn: ({ reviewId, isHelpful }: { reviewId: number; isHelpful: boolean }) =>
      markReviewHelpfulness(productId, reviewId, { is_helpful: isHelpful }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      message.success('Cảm ơn phản hồi của bạn!');
    },
    onError: () => {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleSortChange = (sortBy: string) => {
    setQueryParams(prev => ({ ...prev, sort_by: sortBy as any, page: 1 }));
  };

  const handleRatingFilter = (rating: number | undefined) => {
    setQueryParams(prev => ({ ...prev, rating, page: 1 }));
  };

  const handleVerifiedFilter = (verifiedOnly: boolean | undefined) => {
    setQueryParams(prev => ({ ...prev, verified_only: verifiedOnly, page: 1 }));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setQueryParams(prev => ({ ...prev, page, per_page: pageSize || prev.per_page }));
  };

  const handleHelpfulness = (reviewId: number, isHelpful: boolean) => {
    helpfulnessMutation.mutate({ reviewId, isHelpful });
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải đánh giá...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">Không thể tải đánh giá</div>;
  }

  const { reviews, statistics } = data;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {statistics.average_rating.toFixed(1)}
            </div>
            <Rate disabled value={statistics.average_rating} allowHalf className="mb-2" />
            <div className="text-gray-600">
              {statistics.total_reviews} đánh giá ({statistics.verified_purchase_count} đã mua hàng)
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const dist = statistics.rating_distribution[rating.toString() as keyof typeof statistics.rating_distribution];
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-8 text-sm">{rating} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-gray-600">{dist.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={queryParams.sort_by}
            onChange={handleSortChange}
            style={{ width: 150 }}
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="rating_high">Điểm cao</Option>
            <Option value="rating_low">Điểm thấp</Option>
            <Option value="helpful">Hữu ích nhất</Option>
          </Select>

          <Select
            placeholder="Lọc theo điểm"
            allowClear
            value={queryParams.rating}
            onChange={handleRatingFilter}
            style={{ width: 120 }}
          >
            {[5, 4, 3, 2, 1].map(rating => (
              <Option key={rating} value={rating}>{rating} ⭐</Option>
            ))}
          </Select>

          <Select
            placeholder="Đã mua hàng"
            allowClear
            value={queryParams.verified_only}
            onChange={handleVerifiedFilter}
            style={{ width: 140 }}
          >
            <Option value={true}>Đã mua hàng</Option>
            <Option value={false}>Tất cả</Option>
          </Select>
        </div>

        {showCreateButton && onCreateReview && (
          <Button type="primary" onClick={onCreateReview}>
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.data.map((review: IReview) => (
          <ReviewItem
            key={review.id}
            review={review}
            onHelpfulness={handleHelpfulness}
            isLoading={helpfulnessMutation.isPending}
          />
        ))}
      </div>

      {/* Pagination */}
      {reviews.total > reviews.per_page && (
        <div className="flex justify-center">
          <Pagination
            current={reviews.current_page}
            pageSize={reviews.per_page}
            total={reviews.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} đánh giá`
            }
          />
        </div>
      )}
    </div>
  );
}

// Review Item Component
interface ReviewItemProps {
  review: IReview;
  onHelpfulness: (reviewId: number, isHelpful: boolean) => void;
  isLoading: boolean;
}

function ReviewItem({ review, onHelpfulness, isLoading }: ReviewItemProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar icon={<UserOutlined />} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{review.user.name}</span>
            {review.is_verified_purchase && (
              <CheckCircleOutlined className="text-green-500" title="Đã mua hàng" />
            )}
          </div>
          <div className="text-sm text-gray-500">{review.time_ago}</div>
        </div>
      </div>

      {/* Rating and Title */}
      <div className="mb-3">
        <Rate disabled value={review.rating} className="mb-2" />
        {review.title && (
          <h4 className="font-medium text-gray-900">{review.title}</h4>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-3">{review.comment}</p>
      )}

      {/* Images */}
      {review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          <Image.PreviewGroup>
            {review.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                width={80}
                height={80}
                className="object-cover rounded"
              />
            ))}
          </Image.PreviewGroup>
        </div>
      )}

      {/* Helpfulness */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Đánh giá này có hữu ích không?</span>
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<LikeOutlined />}
            onClick={() => onHelpfulness(review.id, true)}
            loading={isLoading}
            type={review.user_helpfulness === true ? 'primary' : 'default'}
          >
            {review.helpful_count}
          </Button>
          <Button
            size="small"
            icon={<DislikeOutlined />}
            onClick={() => onHelpfulness(review.id, false)}
            loading={isLoading}
            type={review.user_helpfulness === false ? 'primary' : 'default'}
          >
            {review.not_helpful_count}
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          {review.helpfulness_ratio.toFixed(1)}% hữu ích
        </span>
      </div>
    </div>
  );
}
