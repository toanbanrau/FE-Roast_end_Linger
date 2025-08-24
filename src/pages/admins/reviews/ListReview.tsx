import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./ListReview.css";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Card,
  Modal,
  Tooltip,
  Rate,
  Image,
  DatePicker,
  Statistic,
  Row,
  Col,
  Avatar,
  Typography,
  Checkbox,
  Form,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  UserOutlined,
  VerifiedOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  IAdminReview,
  IAdminReviewQueryParams,
} from "../../../interfaces/adminReview";
import {
  getAdminReviews,
  approveReview,
  rejectReview,
  deleteAdminReview,
  bulkApproveReviews,
  bulkRejectReviews,
  replyToReview,
} from "../../../services/adminReviewService";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export default function ListReview() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<IAdminReviewQueryParams>({
    page: 1,
    per_page: 15,
  });
  const [form] = Form.useForm();
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<IAdminReview | null>(null);

  // State cho confirm modals
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingReview, setRejectingReview] = useState<IAdminReview | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReview, setDeletingReview] = useState<IAdminReview | null>(
    null
  );

  // Lấy danh sách reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["admin-reviews", filters],
    queryFn: () => getAdminReviews(filters),
  });

  // Mutation để approve review
  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      toast.success("Đã duyệt đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi duyệt đánh giá!");
    },
  });

  // Mutation để reject review
  const rejectMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason?: string }) =>
      rejectReview(reviewId, reason),
    onSuccess: () => {
      toast.success("Đã từ chối đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi từ chối đánh giá!");
    },
  });

  // Mutation để xóa review
  const deleteMutation = useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => {
      toast.success("Đã xóa đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa đánh giá!");
    },
  });

  // Mutation để bulk approve
  const bulkApproveMutation = useMutation({
    mutationFn: bulkApproveReviews,
    onSuccess: () => {
      toast.success("Đã duyệt các đánh giá được chọn!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setSelectedRowKeys([]);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi duyệt đánh giá!");
    },
  });

  // Mutation để bulk reject
  const bulkRejectMutation = useMutation({
    mutationFn: ({
      reviewIds,
      reason,
    }: {
      reviewIds: number[];
      reason?: string;
    }) => bulkRejectReviews(reviewIds, reason),
    onSuccess: () => {
      toast.success("Đã từ chối các đánh giá được chọn!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setSelectedRowKeys([]);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi từ chối đánh giá!");
    },
  });

  // Mutation để trả lời review
  const replyMutation = useMutation({
    mutationFn: replyToReview,
    onSuccess: () => {
      toast.success("Đã gửi trả lời thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsReplyModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi gửi trả lời!");
    },
  });

  // Xử lý mở modal trả lời
  const showReplyModal = (review: IAdminReview) => {
    setCurrentReview(review);
    setIsReplyModalVisible(true);
  };

  // Xử lý đóng modal
  const handleCancelReply = () => {
    setIsReplyModalVisible(false);
    form.resetFields();
  };

  // Xử lý submit form trả lời
  const handleReplySubmit = (values: { content: string }) => {
    if (currentReview) {
      replyMutation.mutate({
        review_id: currentReview.id,
        content: values.content,
        status: "active",
      });
    }
  };

  // Xử lý thay đổi filters
  const handleFilterChange = (
    key: keyof IAdminReviewQueryParams,
    value: string | number | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset về trang 1 khi filter
    }));
    setCurrentPage(1);
  };

  // Xử lý search
  const handleSearch = (value: string) => {
    handleFilterChange("search", value || undefined);
  };

  // Xử lý thay đổi date range
  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      handleFilterChange("date_from", dates[0].format("YYYY-MM-DD"));
      handleFilterChange("date_to", dates[1].format("YYYY-MM-DD"));
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.date_from;
        delete newFilters.date_to;
        return { ...newFilters, page: 1 };
      });
      setCurrentPage(1);
    }
  };

  // Xử lý approve review
  const handleApprove = (reviewId: number) => {
    Modal.confirm({
      title: "Xác nhận duyệt đánh giá",
      content: "Bạn có chắc chắn muốn duyệt đánh giá này?",
      onOk: () => approveMutation.mutate(reviewId),
    });
  };

  // Xử lý reject review - mở modal
  const handleReject = (review: IAdminReview) => {
    setRejectingReview(review);
    setIsRejectModalOpen(true);
  };

  // Xử lý xóa review - mở modal
  const handleDelete = (review: IAdminReview) => {
    setDeletingReview(review);
    setIsDeleteModalOpen(true);
  };

  // Xử lý xác nhận reject
  const handleConfirmReject = () => {
    if (rejectingReview) {
      rejectMutation.mutate({ reviewId: rejectingReview.id });
      setIsRejectModalOpen(false);
      setRejectingReview(null);
    }
  };

  // Xử lý xác nhận delete
  const handleConfirmDelete = () => {
    if (deletingReview) {
      deleteMutation.mutate(deletingReview.id);
      setIsDeleteModalOpen(false);
      setDeletingReview(null);
    }
  };

  // Xử lý bulk actions
  const handleBulkApprove = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một đánh giá!");
      return;
    }
    Modal.confirm({
      title: "Xác nhận duyệt đánh giá",
      content: `Bạn có chắc chắn muốn duyệt ${selectedRowKeys.length} đánh giá được chọn?`,
      onOk: () => bulkApproveMutation.mutate(selectedRowKeys as number[]),
    });
  };

  const handleBulkReject = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một đánh giá!");
      return;
    }
    Modal.confirm({
      title: "Xác nhận từ chối đánh giá",
      content: `Bạn có chắc chắn muốn từ chối ${selectedRowKeys.length} đánh giá được chọn?`,
      onOk: () =>
        bulkRejectMutation.mutate({ reviewIds: selectedRowKeys as number[] }),
    });
  };

  // Cấu hình row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: IAdminReview) => ({
      disabled: false,
      name: record.id.toString(),
    }),
  };

  // Cấu hình columns cho table
  const columns: ColumnsType<IAdminReview> = [
    {
      title: "STT",
      key: "stt",
      width: 50,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * 15 + index + 1,
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.product.image}
            alt={record.product.name}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <div className="font-medium text-gray-900 truncate max-w-[150px]">
              {record.product.name}
            </div>
            <div className="text-gray-500 text-sm">ID: {record.product.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Người đánh giá",
      key: "user",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.user.full_name}
          </div>
          <div className="text-gray-500 text-sm">{record.user.email}</div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 120,
      render: (_, record) => (
        <div className="text-center">
          <Rate disabled value={record.rating} style={{ fontSize: 14 }} />
          <div className="text-gray-500 text-xs mt-1">
            {record.rating}/5 sao
          </div>
        </div>
      ),
    },
    {
      title: "Nội dung",
      key: "content",
      width: 300,
      render: (_, record) => (
        <div>
          {record.title && (
            <div className="font-medium text-gray-900 mb-1 truncate">
              {record.title}
            </div>
          )}
          <div className="text-gray-600 text-sm line-clamp-2">
            {record.comment}
          </div>
          <div className="mt-1 space-x-1">
            {record.images && record.images.length > 0 && (
              <Tag>📷 {record.images.length} ảnh</Tag>
            )}
            {record.replies && record.replies.length > 0 && (
              <Tag color="purple">Đã trả lời</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={record.is_approved ? "green" : "orange"}>
            {record.is_approved ? "Đã duyệt" : "Chờ duyệt"}
          </Tag>
          {record.is_verified_purchase && (
            <div>
              <Tag color="blue" icon={<VerifiedOutlined />}>
                Đã mua
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 text-sm">
            {dayjs(record.created_at).format("DD/MM/YYYY")}
          </div>
          <div className="text-gray-500 text-xs">
            {dayjs(record.created_at).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/reviews/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Trả lời">
            <Button
              icon={<CommentOutlined />}
              onClick={() => showReplyModal(record)}
            />
          </Tooltip>
          {/* {!record.is_approved ? (
            <Tooltip title="Duyệt">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                loading={approveMutation.isPending}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Từ chối">
              <Button
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
                loading={rejectMutation.isPending}
              />
            </Tooltip>
          )} */}
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              loading={deleteMutation.isPending}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Quản lý đánh giá sản phẩm</Title>

      {/* Statistics Cards */}
      {reviewsData?.statistics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đánh giá"
                value={reviewsData.statistics.total_reviews}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã duyệt"
                value={reviewsData.statistics.approved_reviews}
                prefix={<CheckOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chờ duyệt"
                value={reviewsData.statistics.pending_reviews}
                prefix={<CloseOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={reviewsData.statistics.average_rating}
                precision={1}
                prefix={<StarOutlined />}
                suffix="/ 5"
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Search
              placeholder="Tìm kiếm theo user, sản phẩm, nội dung..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("status", value)}
            >
              <Option value="approved">Đã duyệt</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Số sao"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("rating", value)}
            >
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Sắp xếp"
              defaultValue="newest"
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("sort_by", value)}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
              <Option value="rating_high">Điểm cao</Option>
              <Option value="rating_low">Điểm thấp</Option>
              <Option value="helpful">Hữu ích nhất</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ width: "100%" }}
              onChange={handleDateRangeChange}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={4}>
            <Checkbox
              checked={filters.verified_only}
              onChange={(e) =>
                handleFilterChange("verified_only", e.target.checked)
              }
            >
              Chỉ đã mua hàng
            </Checkbox>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Text>Đã chọn {selectedRowKeys.length} đánh giá</Text>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleBulkApprove}
              loading={bulkApproveMutation.isPending}
            >
              Duyệt tất cả
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={handleBulkReject}
              loading={bulkRejectMutation.isPending}
            >
              Từ chối tất cả
            </Button>
          </Space>
        </Card>
      )}

      {/* Table */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={reviewsData?.reviews.data}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: filters.per_page || 15,
            total: reviewsData?.reviews.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đánh giá`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setFilters((prev) => ({
                ...prev,
                page,
                per_page: pageSize,
              }));
            },
          }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        title={`Trả lời đánh giá của ${currentReview?.user.full_name}`}
        open={isReplyModalVisible}
        onCancel={handleCancelReply}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleReplySubmit}>
          <Form.Item
            name="content"
            label="Nội dung trả lời"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung trả lời!" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập câu trả lời của bạn..."
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={replyMutation.isPending}
            >
              Gửi trả lời
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectingReview(null);
        }}
        onConfirm={handleConfirmReject}
        title="Xác nhận từ chối đánh giá"
        message={`Bạn có chắc muốn từ chối đánh giá này?`}
        confirmText="Từ chối"
        cancelText="Hủy"
        type="danger"
        isLoading={rejectMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingReview(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đánh giá"
        message={`Bạn có chắc muốn xóa vĩnh viễn đánh giá của "${deletingReview?.user.full_name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
