import { useState } from "react";
import { Table, Button, Modal, Space, Input, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllCategoriesAdmin,
    deleteCategory,
} from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";
import { toast } from "react-toastify";
import "antd/dist/reset.css";

const { Search } = Input;

const ListCategory = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast.success("Xóa danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Xóa danh mục thất bại!";
            toast.error(errorMessage);
        },
    });

    // Fetch categories
    const { data: categoryResponse, isLoading } = useQuery({
        queryKey: ["admin-categories", searchText],
        queryFn: () =>
            getAllCategoriesAdmin({
                search: searchText || undefined,
                per_page: 50,
            }),
    });

    const categories = categoryResponse?.data?.data || [];

    const handleDeleteCategory = (id: number) => {
        // Modal.confirm({
        //     title: "Bạn có chắc muốn xóa danh mục này?",
        //     content: "Hành động này không thể hoàn tác.",
        //     okText: "Xóa",
        //     okType: "danger",
        //     cancelText: "Hủy",
        //     centered: true,
        //     zIndex: 2000,
        //     onOk: () => deleteMutation.mutate(id),
        //
        // });
        deleteMutation.mutate(id)
    };

    const columns = [
        {
            title: "STT",
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
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/category/edit/${record.id}`)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteCategory(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header with search + add button */}
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

                {/* Search */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <Search
                        placeholder="Tìm kiếm theo tên, mô tả hoặc slug..."
                        allowClear
                        style={{ width: 300 }}
                        onSearch={setSearchText}
                        onChange={(e) => !e.target.value && setSearchText("")}
                    />
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={isLoading}
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
