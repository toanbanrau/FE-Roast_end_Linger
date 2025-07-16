import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProducts,
  deleteAdminProduct,
} from "../../../services/productService";
import type { IProduct } from "../../../interfaces/product";
import { Table, Image, Button, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

// Interface phù hợp với dữ liệu trả về từ API admin

export default function ListProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  // Mutation xóa sản phẩm
  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      alert("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    },
  });

  // Hàm xóa sản phẩm
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: ["primary_image", "image_url"],
      key: "image",
      render: (_: unknown, record: IProduct) => (
        <Image
          src={record.primary_image?.image_url || "/placeholder.svg"}
          alt={record.primary_image?.alt_text || record.product_name}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
          preview={false}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Giá",
      dataIndex: "display_price",
      key: "display_price",
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "category_name"],
      key: "category",
      render: (_: unknown, record: IProduct) =>
        record.category?.category_name || "",
    },
    {
      title: "Brand",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
      render: (_: unknown, record: IProduct) => record.brand?.brand_name || "",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        switch (status) {
          case "active":
            return <span style={{ color: "#52c41a" }}>Đang bán</span>;
          case "inactive":
            return <span style={{ color: "#ff4d4f" }}>Ngừng bán</span>;
          case "out_of_stock":
            return <span style={{ color: "#faad14" }}>Hết hàng</span>;
          default:
            return status;
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: IProduct) => (
        <Space>
          <Link to={`/admin/product/edit/${record.id}`}>
            <Button type="link">Sửa</Button>
          </Link>
          <Link to={`/admin/product/${record.id}`}>
            <Button type="link">Xem</Button>
          </Link>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id, record.product_name)}
            loading={deleteMutation.isPending}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/product/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Sản Phẩm
      </button>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        bordered
        loading={isLoading}
      />
    </>
  );
}
