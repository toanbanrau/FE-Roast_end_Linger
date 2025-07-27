import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { importInventory } from "../../../services/inventoryService";
import { getAdminProducts } from "../../../services/productService";
import type { IImportInventoryRequest } from "../../../interfaces/inventory";
import type { IProduct } from "../../../interfaces/product";
import dayjs from "dayjs";

interface ProductsResponse {
  data: IProduct[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: unknown;
}

const { Option } = Select;
const { TextArea } = Input;

export default function ImportInventory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Lấy danh sách sản phẩm
  const { data: productsResponse, isLoading: productsLoading } =
    useQuery<ProductsResponse>({
      queryKey: ["admin-products"],
      queryFn: () => getAdminProducts(),
    });

  // Xử lý response có cấu trúc phân trang
  const products: IProduct[] = productsResponse?.data || [];

  // Mutation nhập kho
  const importMutation = useMutation({
    mutationFn: importInventory,
    onSuccess: (data) => {
      toast.success(`Nhập kho thành công! Mã lô: ${data.lot_number}`);
      navigate("/admin/inventory");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Nhập kho thất bại!";
      toast.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const importData: IImportInventoryRequest = {
      product_id: values.product_id,
      product_variant_id: values.product_variant_id || undefined,
      supplier_name: values.supplier_name,
      supplier_code: values.supplier_code,
      quantity: values.quantity,
      unit_cost: values.unit_cost,
      manufacturing_date: values.manufacturing_date?.format("YYYY-MM-DD"),
      expiry_date: values.expiry_date?.format("YYYY-MM-DD"),
      import_date:
        values.import_date?.format("YYYY-MM-DD") ||
        dayjs().format("YYYY-MM-DD"),
      storage_location: values.storage_location,
      notes: values.notes,
    };

    importMutation.mutate(importData);
  };

  const handleProductChange = (productId: number) => {
    const product = products?.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    form.setFieldsValue({ product_variant_id: undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/inventory")}
          >
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Nhập kho</h1>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            import_date: dayjs(),
            quantity: 1,
            unit_cost: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sản phẩm"
                name="product_id"
                rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
              >
                <Select
                  placeholder="Chọn sản phẩm"
                  loading={productsLoading}
                  onChange={handleProductChange}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {products?.map((product) => (
                    <Option key={product.id} value={product.id}>
                      {product.product_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Biến thể sản phẩm" name="product_variant_id">
                <Select
                  placeholder="Chọn biến thể (tùy chọn)"
                  allowClear
                  disabled={!selectedProduct?.has_variants}
                >
                  {selectedProduct?.variants?.map((variant) => (
                    <Option key={variant.id} value={variant.id}>
                      {variant.variant_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên nhà cung cấp" name="supplier_name">
                <Input placeholder="Nhập tên nhà cung cấp" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Mã nhà cung cấp" name="supplier_code">
                <Input placeholder="Nhập mã nhà cung cấp" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  {
                    type: "number",
                    min: 1,
                    message: "Số lượng phải lớn hơn 0!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giá nhập (₫)"
                name="unit_cost"
                rules={[
                  { required: true, message: "Vui lòng nhập giá nhập!" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá nhập không được âm!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá nhập"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    Number(value!.replace(/\$\s?|(,*)/g, "")) as 0
                  }
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Vị trí lưu trữ" name="storage_location">
                <Select placeholder="Chọn vị trí lưu trữ" allowClear>
                  <Option value="Kho A-01">Kho A-01</Option>
                  <Option value="Kho A-02">Kho A-02</Option>
                  <Option value="Kho A-03">Kho A-03</Option>
                  <Option value="Kho B-01">Kho B-01</Option>
                  <Option value="Kho B-02">Kho B-02</Option>
                  <Option value="Kho B-03">Kho B-03</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Ngày sản xuất" name="manufacturing_date">
                <DatePicker
                  placeholder="Chọn ngày sản xuất"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Hạn sử dụng" name="expiry_date">
                <DatePicker
                  placeholder="Chọn hạn sử dụng"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ngày nhập kho"
                name="import_date"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày nhập kho!" },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày nhập kho"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi chú" name="notes">
            <TextArea
              placeholder="Nhập ghi chú (tùy chọn)"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={importMutation.isPending}
                size="large"
              >
                Nhập kho
              </Button>
              <Button onClick={() => navigate("/admin/inventory")} size="large">
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
