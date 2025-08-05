import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Rate, Image, message, Modal, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getReviewableProducts, deleteProductReview } from '../../../services/reviewService';
import CreateReviewModal from '../../../components/CreateReviewModal';
import type { IReviewableProduct } from '../../../interfaces/review';

const { TabPane } = Tabs;

export default function MyReviews() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();

  // Fetch reviewable products
  const { data: reviewableProducts, isLoading } = useQuery({
    queryKey: ['reviewable-products'],
    queryFn: getReviewableProducts,
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: ({ productId, reviewId }: { productId: number; reviewId: number }) =>
      deleteProductReview(productId, reviewId),
    onSuccess: () => {
      message.success('Đã xóa đánh giá thành công!');
      queryClient.invalidateQueries({ queryKey: ['reviewable-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi xóa đánh giá!');
    },
  });

  const handleCreateReview = (productId?: number) => {
    setSelectedProductId(productId);
    setShowCreateModal(true);
  };

  const handleDeleteReview = (productId: number, reviewId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa đánh giá',
      content: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        deleteMutation.mutate({ productId, reviewId });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Đang tải...</div>
      </div>
    );
  }

  const canReviewProducts = reviewableProducts?.filter(item => item.can_review) || [];
  const reviewedProducts = reviewableProducts?.filter(item => !item.can_review) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá của tôi</h1>
          <p className="text-gray-600">Quản lý đánh giá và viết đánh giá cho sản phẩm đã mua</p>
        </div>
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => handleCreateReview()}
        >
          Viết đánh giá
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="can-review">
        <TabPane 
          tab={`Có thể đánh giá (${canReviewProducts.length})`} 
          key="can-review"
        >
          <div className="space-y-4">
            {canReviewProducts.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <ShoppingOutlined className="text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có sản phẩm nào để đánh giá
                  </h3>
                  <p className="text-gray-600">
                    Mua sắm và nhận hàng để có thể viết đánh giá nhé!
                  </p>
                </div>
              </Card>
            ) : (
              canReviewProducts.map((item) => (
                <ReviewableProductCard
                  key={item.order_item_id}
                  product={item}
                  onCreateReview={() => handleCreateReview(item.product.id)}
                />
              ))
            )}
          </div>
        </TabPane>

        <TabPane 
          tab={`Đã đánh giá (${reviewedProducts.length})`} 
          key="reviewed"
        >
          <div className="space-y-4">
            {reviewedProducts.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <EditOutlined className="text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có đánh giá nào
                  </h3>
                  <p className="text-gray-600">
                    Các đánh giá bạn đã viết sẽ hiển thị ở đây
                  </p>
                </div>
              </Card>
            ) : (
              reviewedProducts.map((item) => (
                <ReviewedProductCard
                  key={item.order_item_id}
                  product={item}
                  onDeleteReview={handleDeleteReview}
                />
              ))
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Create Review Modal */}
      <CreateReviewModal
        visible={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          setSelectedProductId(undefined);
        }}
        productId={selectedProductId}
      />
    </div>
  );
}

// Reviewable Product Card
interface ReviewableProductCardProps {
  product: IReviewableProduct;
  onCreateReview: () => void;
}

function ReviewableProductCard({ product, onCreateReview }: ReviewableProductCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <img
          src={product.product.image.url}
          alt={product.product.image.alt_text}
          className="w-20 h-20 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {product.product.name}
          </h3>
          {product.variant && (
            <p className="text-sm text-gray-600 mb-1">
              Phân loại: {product.variant.name}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Đơn hàng: {product.order_number} • 
            Mua {product.days_since_purchase} ngày trước • 
            Số lượng: {product.quantity}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {product.formatted_unit_price}
          </p>
        </div>

        <Button 
          type="primary" 
          onClick={onCreateReview}
          className="shrink-0"
        >
          Viết đánh giá
        </Button>
      </div>
    </Card>
  );
}

// Reviewed Product Card (placeholder - would need actual review data)
interface ReviewedProductCardProps {
  product: IReviewableProduct;
  onDeleteReview: (productId: number, reviewId: number) => void;
}

function ReviewedProductCard({ product, onDeleteReview }: ReviewedProductCardProps) {
  // This would need actual review data from API
  // For now, showing placeholder
  return (
    <Card>
      <div className="flex items-start gap-4">
        <img
          src={product.product.image.url}
          alt={product.product.image.alt_text}
          className="w-20 h-20 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">
            {product.product.name}
          </h3>
          
          {/* Placeholder review data */}
          <div className="mb-2">
            <Rate disabled value={5} className="text-sm" />
          </div>
          
          <p className="text-gray-700 mb-2">
            Sản phẩm rất tốt, chất lượng như mong đợi!
          </p>
          
          <p className="text-sm text-gray-500">
            Đánh giá vào 2 ngày trước
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button size="small" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => onDeleteReview(product.product.id, 1)} // Placeholder review ID
          >
            Xóa
          </Button>
        </div>
      </div>
    </Card>
  );
}
