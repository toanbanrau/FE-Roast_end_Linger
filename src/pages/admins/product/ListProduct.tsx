import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  getAdminProducts,
  deleteAdminProduct,
} from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import type { IProduct } from "../../../interfaces/product";
import {
  Table,
  Image,
  Button,
  Space,
  Card,
  Input,
  Select,
  Pagination,
  Tag,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;

// Interface phù hợp với dữ liệu trả về từ API admin

export default function ListProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy các query params từ URL
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const categoryId = searchParams.get("category_id") || "";
  const brandId = searchParams.get("brand_id") || "";

  // Tạo query params cho API
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("category_id", categoryId);
    if (brandId) params.set("brand_id", brandId);
    return params;
  }, [page, search, status, categoryId, brandId]);

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["admin-products", queryParams.toString()],
    queryFn: () => getAdminProducts(queryParams),
  });

  // Xử lý response có cấu trúc phân trang từ server
  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  // Debug log để kiểm tra cấu trúc meta
  console.log("Meta data:", meta);

  // Xử lý meta có thể là array hoặc object
  const totalItems = Array.isArray(meta?.total)
    ? meta.total[0]
    : meta?.total || 0;
  const currentPage = Array.isArray(meta?.current_page)
    ? meta.current_page[0]
    : meta?.current_page || 1;
  const perPage = Array.isArray(meta?.per_page)
    ? meta.per_page[0]
    : meta?.per_page || 10;

  console.log("Processed values:", { totalItems, currentPage, perPage });

  // Cập nhật query params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === 0) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      // Reset về trang 1 khi filter thay đổi (trừ khi đang thay đổi page)
      if (updates.page === undefined) {
        newParams.set("page", "1");
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Lấy danh sách categories và brands cho filter
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
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
      width: 60,
      render: (_: unknown, __: unknown, index: number) =>
        (currentPage - 1) * perPage + index + 1,
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
            return <Tag color="green">Đang bán</Tag>;
          case "inactive":
            return <Tag color="red">Ngừng bán</Tag>;
          case "out_of_stock":
            return <Tag color="orange">Hết hàng</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: IProduct) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/product/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/product/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id, record.product_name)}
            loading={deleteMutation.isPending}
          />
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

      {/* Bộ lọc */}
      <Card className="mb-6">
        <Space size="middle" wrap>
          <Search
            placeholder="Tìm kiếm sản phẩm, danh mục, thương hiệu..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={search}
            onSearch={(value) => updateSearchParams({ search: value })}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 180 }}
            value={status || undefined}
            onChange={(value) => updateSearchParams({ status: value || "" })}
          >
            <Option value="active">Đang bán</Option>
            <Option value="inactive">Ngừng bán</Option>
            <Option value="out_of_stock">Hết hàng</Option>
          </Select>

          <Select
            placeholder="Lọc theo danh mục"
            allowClear
            style={{ width: 180 }}
            value={categoryId ? parseInt(categoryId) : undefined}
            onChange={(value) =>
              updateSearchParams({ category_id: value || "" })
            }
          >
            {categories?.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.category_name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo thương hiệu"
            allowClear
            style={{ width: 180 }}
            value={brandId ? parseInt(brandId) : undefined}
            onChange={(value) => updateSearchParams({ brand_id: value || "" })}
          >
            {brands?.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.brand_name}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        bordered
        loading={isLoading}
        pagination={false}
      />

      {/* Ant Design Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={perPage}
          total={totalItems}
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`
          }
          onChange={(newPage) => {
            updateSearchParams({ page: newPage });
          }}
        />
      </div>
    </>
  );
}
