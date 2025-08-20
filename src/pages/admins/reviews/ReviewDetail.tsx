import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Rate,
  Tag,
  Button,
  Space,
  Image,
  Avatar,
  Divider,
  Typography,
  Modal,
  message,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import { getAdminReviewDetails, approveReview, rejectReview, deleteAdminReview } from "../../../services/adminReviewService";
import type { IAdminReview } from "../../../interfaces/adminReview";

const { Title, Text, Paragraph } = Typography;

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Query để lấy chi tiết review
  const { data: review, isLoading, error } = useQuery({
    queryKey: ["admin-review-detail", id],
    queryFn: () => getAdminReviewDetails(Number(id)),
    enabled: !!id,
  });

  // Mutation approve review
  const approveMutation = useMutation({
    mutationFn: (reviewId: number) => approveReview(reviewId),
    onSuccess: () => {
      message.success("Đã duyệt review thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-review-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra khi duyệt review!");
    },
  });

  // Mutation reject review
  const rejectMutation = useMutation({
    mutationFn: (reviewId: number) => rejectReview(reviewId),
    onSuccess: () => {
      message.success("Đã từ chối review thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-review-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra khi từ chối review!");
    },
  });

  // Mutation delete review
  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteAdminReview(reviewId),
    onSuccess: () => {
      message.success("Đã xóa review thành công!");
      navigate("/admin/reviews");
    },
    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra khi xóa review!");
    },
  });

  const handleApprove = () => {
    if (review) {
      approveMutation.mutate(review.id);
    }
  };

  const handleReject = () => {
    if (review) {
      rejectMutation.mutate(review.id);
    }
  };

  const handleDelete = () => {
    if (review) {
      deleteMutation.mutate(review.id);
    }
    setDeleteModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description="Không thể tải thông tin review. Vui lòng thử lại."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/reviews")}
          className="mb-4"
        >
          Quay lại danh sách
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <Title level={2}>Chi tiết Review #{review.id}</Title>
            <Text type="secondary">
              Tạo lúc: {formatDate(review.created_at)}
            </Text>
          </div>
          
          <Space>
            {!review.is_approved && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleApprove}
                loading={approveMutation.isPending}
              >
                Duyệt
              </Button>
            )}
            
            {review.is_approved && (
              <Button
                icon={<CloseOutlined />}
                onClick={handleReject}
                loading={rejectMutation.isPending}
              >
                Từ chối
              </Button>
            )}
            
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteModalVisible(true)}
              loading={deleteMutation.isPending}
            >
              Xóa
            </Button>
          </Space>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Content */}
        <div className="lg:col-span-2">
          <Card title="Nội dung Review" className="mb-6">
            <div className="space-y-4">
              <div>
                <Text strong>Tiêu đề:</Text>
                <Title level={4} className="mt-1">{review.title}</Title>
              </div>
              
              <div>
                <Text strong>Đánh giá:</Text>
                <div className="mt-1">
                  <Rate disabled value={review.rating} />
                  <Text className="ml-2">({review.rating}/5 sao)</Text>
                </div>
              </div>
              
              <div>
                <Text strong>Nội dung:</Text>
                <Paragraph className="mt-1 bg-gray-50 p-4 rounded">
                  {review.comment}
                </Paragraph>
              </div>
              
              {review.images && review.images.length > 0 && (
                <div>
                  <Text strong>Hình ảnh:</Text>
                  <div className="mt-2">
                    <Image.PreviewGroup>
                      {review.images.map((image, index) => (
                        <Image
                          key={index}
                          width={100}
                          height={100}
                          src={image}
                          className="object-cover rounded mr-2"
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <Tag color={review.is_approved ? "green" : "orange"}>
                  {review.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                </Tag>
                
                {review.is_verified_purchase && (
                  <Tag color="blue">Đã xác thực mua hàng</Tag>
                )}
                
                <div className="flex items-center space-x-2">
                  <LikeOutlined />
                  <Text>{review.helpful_count}</Text>
                  <DislikeOutlined />
                  <Text>{review.not_helpful_count}</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div>
          {/* User Info */}
          <Card title="Thông tin người dùng" className="mb-4">
            <div className="text-center mb-4">
              <Avatar size={64} icon={<UserOutlined />} src={review.user?.avatar} />
              <Title level={5} className="mt-2 mb-1">{review.user?.full_name}</Title>
              <Text type="secondary">{review.user?.email}</Text>
            </div>
            
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Username">{review.user?.name}</Descriptions.Item>
              <Descriptions.Item label="Tổng reviews">{review.user?.total_reviews || 0}</Descriptions.Item>
              <Descriptions.Item label="Đánh giá TB">
                <Rate disabled value={review.user?.average_rating || 0} />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Product Info */}
          <Card title="Thông tin sản phẩm" className="mb-4">
            <div className="text-center mb-4">
              <img
                src={review.product?.image}
                alt={review.product?.name}
                className="w-20 h-20 object-cover rounded mx-auto"
              />
              <Title level={5} className="mt-2 mb-1">{review.product?.name}</Title>
              <Text type="secondary">{formatCurrency(review.product?.price || 0)}</Text>
            </div>
            
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Thương hiệu">{review.product?.brand?.name}</Descriptions.Item>
              <Descriptions.Item label="Đánh giá TB">
                <Rate disabled value={review.product?.average_rating || 0} />
              </Descriptions.Item>
              <Descriptions.Item label="Tổng reviews">{review.product?.total_reviews || 0}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Order Info */}
          {review.order && (
            <Card title="Thông tin đơn hàng">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Mã đơn hàng">{review.order.order_number}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={review.order.status?.color}>
                    {review.order.status?.name}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{formatCurrency(review.order.total_amount)}</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">{formatDate(review.order.created_at)}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa review"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        confirmLoading={deleteMutation.isPending}
      >
        <p>Bạn có chắc chắn muốn xóa review này không? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default ReviewDetail;
