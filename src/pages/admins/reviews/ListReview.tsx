import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Card,
  message,
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
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  UserOutlined,
  VerifiedOutlined,
  EyeOutlined,
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
} from "../../../services/adminReviewService";
import dayjs from "dayjs";

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

  // Lấy danh sách reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["admin-reviews", filters],
    queryFn: () => getAdminReviews(filters),
  });

  // Mutation để approve review
  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      message.success("Đã duyệt đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi duyệt đánh giá!");
    },
  });

  // Mutation để reject review
  const rejectMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason?: string }) =>
      rejectReview(reviewId, reason),
    onSuccess: () => {
      message.success("Đã từ chối đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi từ chối đánh giá!");
    },
  });

  // Mutation để xóa review
  const deleteMutation = useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => {
      message.success("Đã xóa đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa đánh giá!");
    },
  });

  // Mutation để bulk approve
  const bulkApproveMutation = useMutation({
    mutationFn: bulkApproveReviews,
    onSuccess: () => {
      message.success("Đã duyệt các đánh giá được chọn!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi duyệt đánh giá!");
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
      message.success("Đã từ chối các đánh giá được chọn!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi từ chối đánh giá!");
    },
  });

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

  // Xử lý reject review
  const handleReject = (reviewId: number) => {
    Modal.confirm({
      title: "Xác nhận từ chối đánh giá",
      content: "Bạn có chắc chắn muốn từ chối đánh giá này?",
      onOk: () => rejectMutation.mutate({ reviewId }),
    });
  };

  // Xử lý xóa review
  const handleDelete = (reviewId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa đánh giá",
      content:
        "Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.",
      okType: "danger",
      onOk: () => deleteMutation.mutate(reviewId),
    });
  };

  // Xử lý bulk actions
  const handleBulkApprove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một đánh giá!");
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
      message.warning("Vui lòng chọn ít nhất một đánh giá!");
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
      title: "STT", render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 200,
      render: (_, record) => (
        <Space>
          <Image
            src={record.product.image}
            alt={record.product.name}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div>
            <Text strong>{record.product.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.product.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Người đánh giá",
      key: "user",
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.user.full_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.user.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 120,
      render: (_, record) => (
        <div>
          <Rate
            disabled
            defaultValue={record.rating}
            style={{ fontSize: 14 }}
          />
          <br />
          <Text style={{ fontSize: 12 }}>{record.rating}/5 sao</Text>
        </div>
      ),
    },
    {
      title: "Nội dung",
      key: "content",
      width: 250,
      render: (_, record) => (
        <div>
          {record.title && (
            <Text strong style={{ display: "block", marginBottom: 4 }}>
              {record.title}
            </Text>
          )}
          <Text
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {record.comment}
          </Text>
          {record.images && record.images.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                📷 {record.images.length} ảnh
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <div>
          <Tag color={record.is_approved ? "green" : "orange"}>
            {record.is_approved ? "Đã duyệt" : "Chờ duyệt"}
          </Tag>
          {record.is_verified_purchase && (
            <Tag
              color="blue"
              icon={<VerifiedOutlined />}
              style={{ marginTop: 4 }}
            >
              Đã mua hàng
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Tương tác",
      key: "interaction",
      width: 100,
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 12, color: "#52c41a" }}>
            👍 {record.helpful_count}
          </Text>
          <br />
          <Text style={{ fontSize: 12, color: "#ff4d4f" }}>
            👎 {record.not_helpful_count}
          </Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      width: 120,
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 12 }}>
            {dayjs(record.created_at).format("DD/MM/YYYY")}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(record.created_at).format("HH:mm")}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/reviews/${record.id}`)}
            />
          </Tooltip>

          {!record.is_approved && (
            <Tooltip title="Duyệt đánh giá">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                loading={approveMutation.isPending}
              />
            </Tooltip>
          )}
          {!record.is_approved && (
            <Tooltip title="Từ chối đánh giá">
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
                loading={rejectMutation.isPending}
              />
            </Tooltip>
          )}
          <Tooltip title="Xóa đánh giá">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
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
          scroll={{ x: 1000 }}
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
    </div>
  );
}
