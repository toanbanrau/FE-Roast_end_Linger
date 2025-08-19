import { useState } from "react";
import { Table, Button, message, Modal, Space, Input, Select, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategoriesAdmin,
  deleteCategory,
  bulkActionCategories,
} from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";

const { Search } = Input;
const { Option } = Select;

const ListCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      message.success("Xóa danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Xóa danh mục thất bại!";
      message.error(errorMessage);
    },
  });

  // Bulk action mutation
  const bulkMutation = useMutation({
    mutationFn: bulkActionCategories,
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setSelectedRowKeys([]);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Thao tác thất bại!";
      message.error(errorMessage);
    },
  });

  // Fetch categories with filters
  const { data: categoryResponse, isLoading } = useQuery({
    queryKey: ["admin-categories", searchText, statusFilter],
    queryFn: () =>
      getAllCategoriesAdmin({
        search: searchText || undefined,
        status: statusFilter,
        per_page: 50,
      }),
  });

  const categories = categoryResponse?.data?.data || [];

  const handleDeleteCategory = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa danh mục này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  // Bulk action handlers
  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một danh mục!");
      return;
    }

    const actionText = {
      activate: "kích hoạt",
      deactivate: "tạm dừng",
      delete: "xóa",
    };

    Modal.confirm({
      title: `Bạn có chắc muốn ${actionText[action]} ${selectedRowKeys.length} danh mục đã chọn?`,
      content:
        action === "delete" ? "Hành động này không thể hoàn tác." : undefined,
      okText: "Xác nhận",
      okType: action === "delete" ? "danger" : "primary",
      cancelText: "Hủy",
      onOk: () => {
        bulkMutation.mutate({
          action,
          category_ids: selectedRowKeys.map((key) => Number(key)),
        });
      },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "category_name",
      key: "category_name",
      width: 200,
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text: string) =>
        text || <span style={{ color: "#aaa" }}>Không có mô tả</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 150,
    },
    {
      title: "Danh mục cha",
      dataIndex: "parent",
      key: "parent",
      width: 150,
      render: (parent: ICategory | null) =>
        parent ? (
          parent.category_name
        ) : (
          <span style={{ color: "#aaa" }}>Danh mục gốc</span>
        ),
    },
    {
      title: "Thứ tự",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as const,
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: unknown, record: ICategory) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/category/edit/${record.id}`)}
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteCategory(record.id)}
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div>
      {/* Header with filters and actions */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Quản lý Danh mục</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/category/add")}
          >
            Thêm Danh Mục
          </Button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm theo tên, mô tả hoặc slug..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => !e.target.value && setSearchText("")}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Tạm dừng</Option>
          </Select>
        </div>

        {/* Bulk actions */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 16 }}>
              Đã chọn {selectedRowKeys.length} danh mục
            </span>
            <Space>
              <Button size="small" onClick={() => handleBulkAction("activate")}>
                Kích hoạt
              </Button>
              <Button
                size="small"
                onClick={() => handleBulkAction("deactivate")}
              >
                Tạm dừng
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleBulkAction("delete")}
              >
                Xóa
              </Button>
            </Space>
          </div>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={isLoading}
        rowSelection={rowSelection}
        pagination={{
          total: categoryResponse?.data?.total || 0,
          pageSize: categoryResponse?.data?.per_page || 50,
          current: categoryResponse?.data?.current_page || 1,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} danh mục`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ListCategory;
