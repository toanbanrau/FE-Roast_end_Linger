import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Alert,
  Table,
} from "antd";
import { ArrowLeftOutlined, ExportOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { exportInventory } from "../../../services/inventoryService";
import { getAdminProducts } from "../../../services/productService";
import type { IExportInventoryRequest, IExportInventoryResponse } from "../../../interfaces/inventory";
import type { IProduct } from "../../../interfaces/product";

const { Option } = Select;
const { TextArea } = Input;

export default function ExportInventory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [exportResult, setExportResult] = useState<IExportInventoryResponse | null>(null);

  // Lấy danh sách sản phẩm
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  // Mutation xuất kho
  const exportMutation = useMutation({
    mutationFn: exportInventory,
    onSuccess: (data) => {
      setExportResult(data);
      toast.success(`Xuất kho thành công! Mã giao dịch: ${data.transaction_code}`);
      form.resetFields();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Xuất kho thất bại!";
      toast.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const exportData: IExportInventoryRequest = {
      product_id: values.product_id,
      product_variant_id: values.product_variant_id || undefined,
      quantity: values.quantity,
      notes: values.notes,
    };

    exportMutation.mutate(exportData);
  };

  const handleProductChange = (productId: number) => {
    const product = products?.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    form.setFieldsValue({ product_variant_id: undefined });
  };

  const resultColumns = [
    {
      title: "Mã lô",
      dataIndex: "lot_number",
      key: "lot_number",
    },
    {
      title: "Số lượng xuất",
      dataIndex: "quantity_exported",
      key: "quantity_exported",
      render: (value: number) => <span className="text-red-600">{value}</span>,
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
      render: (value: number) => <span className="text-green-600">{value}</span>,
    },
  ];

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
          <h1 className="text-2xl font-bold">Xuất kho</h1>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={exportResult ? 12 : 24}>
          <Card title="Thông tin xuất kho">
            <Alert
              message="Lưu ý"
              description="Hệ thống sẽ tự động xuất kho theo nguyên tắc FIFO (First In, First Out) - lô hàng nhập trước sẽ được xuất trước."
              type="info"
              showIcon
              className="mb-4"
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                quantity: 1,
              }}
            >
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
                    (option?.children as string)
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

              <Form.Item
                label="Số lượng xuất"
                name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng xuất"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>

              <Form.Item label="Lý do xuất kho" name="notes">
                <TextArea
                  placeholder="Nhập lý do xuất kho (tùy chọn)"
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
                    icon={<ExportOutlined />}
                    loading={exportMutation.isPending}
                    size="large"
                  >
                    Xuất kho
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/inventory")}
                    size="large"
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {exportResult && (
          <Col span={12}>
            <Card title="Kết quả xuất kho" className="border-green-200">
              <div className="mb-4">
                <Alert
                  message="Xuất kho thành công!"
                  description={
                    <div>
                      <p><strong>Mã giao dịch:</strong> {exportResult.transaction_code}</p>
                      <p><strong>Tổng số lượng xuất:</strong> {exportResult.exported_quantity}</p>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </div>

              <h4 className="mb-3">Chi tiết các lô bị ảnh hưởng:</h4>
              <Table
                columns={resultColumns}
                dataSource={exportResult.lots_affected}
                rowKey="lot_id"
                pagination={false}
                size="small"
              />

              <div className="mt-4">
                <Button
                  type="primary"
                  onClick={() => {
                    setExportResult(null);
                    form.resetFields();
                  }}
                >
                  Xuất kho tiếp
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
