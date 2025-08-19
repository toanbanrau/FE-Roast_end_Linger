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
  Slider,
  InputNumber,
  Row,
  Col,
  Modal,
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
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";

  // State cho search input để có thể type realtime
  const [searchValue, setSearchValue] = useState(search);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ? parseInt(minPrice) : 0,
    maxPrice ? parseInt(maxPrice) : 10000000
  ]);

  // Tạo query params cho API
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("category_id", categoryId);
    if (brandId) params.set("brand_id", brandId);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    return params;
  }, [page, search, status, categoryId, brandId, minPrice, maxPrice]);

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
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc muốn xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

  // Handler cho search với debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Debounce search - chỉ search sau 500ms không type
    const timeoutId = setTimeout(() => {
      updateSearchParams({ search: value });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [updateSearchParams]);

  // Handler cho price range
  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
    updateSearchParams({
      min_price: value[0] > 0 ? value[0].toString() : "",
      max_price: value[1] < 10000000 ? value[1].toString() : ""
    });
  }, [updateSearchParams]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchValue("");
    setPriceRange([0, 10000000]);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

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
      <Card className="mb-6" title="Bộ lọc tìm kiếm">
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} md={8}>
            <div>
              <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
              <Input
                placeholder="Tìm kiếm sản phẩm, danh mục, thương hiệu..."
                allowClear
                prefix={<SearchOutlined />}
                size="large"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </Col>

          {/* Status Filter */}
          <Col xs={24} sm={12} md={4}>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: "100%" }}
                value={status || undefined}
                onChange={(value) => updateSearchParams({ status: value || "" })}
              >
                <Option value="active">Đang bán</Option>
                <Option value="inactive">Ngừng bán</Option>
                <Option value="out_of_stock">Hết hàng</Option>
              </Select>
            </div>
          </Col>

          {/* Category Filter */}
          <Col xs={24} sm={12} md={4}>
            <div>
              <label className="block text-sm font-medium mb-2">Danh mục</label>
              <Select
                placeholder="Chọn danh mục"
                allowClear
                style={{ width: "100%" }}
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
            </div>
          </Col>

          {/* Brand Filter */}
          <Col xs={24} sm={12} md={4}>
            <div>
              <label className="block text-sm font-medium mb-2">Thương hiệu</label>
              <Select
                placeholder="Chọn thương hiệu"
                allowClear
                style={{ width: "100%" }}
                value={brandId ? parseInt(brandId) : undefined}
                onChange={(value) => updateSearchParams({ brand_id: value || "" })}
              >
                {brands?.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.brand_name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          {/* Price Range Filter */}
          <Col xs={24} md={8}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Khoảng giá: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VNĐ
              </label>
              <Slider
                range
                min={0}
                max={10000000}
                step={100000}
                value={priceRange}
                onChange={handlePriceRangeChange}
                tooltip={{
                  formatter: (value) => `${value?.toLocaleString()} VNĐ`
                }}
              />
              <Row gutter={8} className="mt-2">
                <Col span={12}>
                  <InputNumber
                    placeholder="Giá từ"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(value) => handlePriceRangeChange([value || 0, priceRange[1]])}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    placeholder="Giá đến"
                    min={priceRange[0]}
                    max={10000000}
                    value={priceRange[1]}
                    onChange={(value) => handlePriceRangeChange([priceRange[0], value || 10000000])}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>
            </div>
          </Col>

          {/* Reset Button */}
          <Col xs={24} md={4}>
            <div className="flex items-end h-full">
              <Button
                onClick={handleResetFilters}
                style={{ width: "100%" }}
                className="mb-2"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </Col>
        </Row>
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
