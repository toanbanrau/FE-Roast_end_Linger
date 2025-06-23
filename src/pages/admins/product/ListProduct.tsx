import { Table, Button, Popconfirm, message, Tag, Space, Image } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAdminProducts,
  deleteAdminProduct
} from "../../../services/productService";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type {
  IAdminProduct,
  IAdminProductListResponse
} from "../../../interfaces/product";
import type { TableProps } from "antd";

const ListProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data, isLoading } = useQuery<IAdminProductListResponse, Error>({
    queryKey: ["admin-products", page, pageSize],
    queryFn: () => getAdminProducts({ page, per_page: pageSize }),
  });

  const products = data?.data || [];
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa sản phẩm!");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns: TableProps<IAdminProduct>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Ảnh",
      dataIndex: "primary_image",
      key: "primary_image",
      width: 80,
      render: (image) => <Image src={image?.image_url} alt="product" width={50} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      width: 250,
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "category_name"],
      key: "category",
      width: 150,
      render: (_, record) => record.category?.category_name || "",
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
      width: 150,
      render: (_, record) => record.brand?.brand_name || "",
    },
    {
      title: "Giá (₫)",
      dataIndex: "base_price",
      key: "base_price",
      width: 120,
      render: (price) => Number(price).toLocaleString(),
    },
    {
      title: "Kho",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: 80,
    },
    {
      title: "Nổi bật",
      dataIndex: "is_featured",
      key: "is_featured",
      width: 80,
      render: (is_featured) => is_featured ? <Tag color="gold">Nổi bật</Tag> : null,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/product/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản Lý Sản Phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/product/add")}
        >
          Thêm Sản Phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.current_page || page,
          pageSize: meta?.per_page || pageSize,
          total: meta?.total || 0,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
};

export default ListProduct;
