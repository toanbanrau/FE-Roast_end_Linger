import { Table, Button, Tag, Space, Input, Select, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAllBlogPosts,
  deleteBlogPost,
} from "../../../services/blogPostService";
import { getAllBlogCategories } from "../../../services/blogCategoryService";
import type {
  IAdminBlogPost,
  IAdminBlogPostListParams,
} from "../../../interfaces/blog";
import type { IAdminBlogCategory } from "../../../interfaces/category";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const ListBlogPost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State cho filters và pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  // Query parameters
  const queryParams: IAdminBlogPostListParams = {
    page: currentPage,
    per_page: pageSize,
    search: searchText || undefined,
    category_id: selectedCategory,
    status: selectedStatus as "draft" | "published" | "archived" | undefined,
  };

  // Fetch blog posts với pagination
  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", queryParams],
    queryFn: () => getAllBlogPosts(queryParams),
  });

  // Fetch categories cho filter
  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories,
  });

  // Debug data structure
  console.log("📊 Query Data:", data);
  console.log("📊 Blog Posts:", data?.data);

  const blogPosts = data?.data || [];
  const pagination = {
    current: data?.current_page || 1,
    pageSize: data?.per_page || 10,
    total: data?.total || 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} của ${total} bài viết`,
    onChange: (page: number, size?: number) => {
      setCurrentPage(page);
      if (size && size !== pageSize) {
        setPageSize(size);
      }
    },
  };

  const mutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      key: "category",
      render: (record: IAdminBlogPost) =>
        record.category?.category_name || "N/A",
    },
    {
      title: "Tác giả",
      key: "author",
      render: (record: IAdminBlogPost) => record.author?.name || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          published: { color: "green", text: "Đã xuất bản" },
          draft: { color: "orange", text: "Bản nháp" },
          archived: { color: "red", text: "Đã lưu trữ" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Lượt xem",
      dataIndex: "view_count",
      key: "view_count",
      width: 100,
      render: (count: number) => count?.toLocaleString() || 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: unknown, record: IAdminBlogPost) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/blog-post/${record.id}`)}
            title="Xem chi tiết"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/blog-post/edit/${record.id}`)}
            title="Chỉnh sửa"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý bài viết blog
          </h1>
          <p className="text-gray-600">
            Quản lý tất cả bài viết blog của hệ thống
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/blog-post/add")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm bài viết
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <Search
              placeholder="Tìm theo tiêu đề hoặc nội dung..."
              allowClear
              onSearch={(value) => {
                setSearchText(value);
                setCurrentPage(1);
              }}
              onChange={(e) => {
                if (!e.target.value) {
                  setSearchText("");
                  setCurrentPage(1);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <Select
              placeholder="Chọn danh mục"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
            >
              {categories?.map((category: IAdminBlogCategory) => (
                <Option key={category.id} value={category.id}>
                  {category.category_name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
              }}
            >
              <Option value="draft">Bản nháp</Option>
              <Option value="published">Đã xuất bản</Option>
              <Option value="archived">Đã lưu trữ</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số bài viết/trang
            </label>
            <Select
              value={pageSize}
              style={{ width: "100%" }}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
            >
              <Option value={10}>10 bài viết</Option>
              <Option value={20}>20 bài viết</Option>
              <Option value={50}>50 bài viết</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={blogPosts}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ListBlogPost;
