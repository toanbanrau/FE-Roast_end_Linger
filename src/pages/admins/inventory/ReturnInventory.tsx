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
} from "antd";
import { ArrowLeftOutlined, UndoOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { returnInventory } from "../../../services/inventoryService";
import { getAdminProducts } from "../../../services/productService";
import { getAllOrders } from "../../../services/adminOrderService";
import type { IReturnInventoryRequest, IReturnInventoryResponse } from "../../../interfaces/inventory";
import type { IProduct } from "../../../interfaces/product";

const { Option } = Select;
const { TextArea } = Input;

export default function ReturnInventory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [returnResult, setReturnResult] = useState<IReturnInventoryResponse | null>(null);

  // Lấy danh sách sản phẩm
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  // Lấy danh sách đơn hàng (để chọn đơn hàng hoàn trả)
  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders({ per_page: 100 }),
  });

  // Mutation hoàn trả
  const returnMutation = useMutation({
    mutationFn: returnInventory,
    onSuccess: (data) => {
      setReturnResult(data);
      toast.success(`Hoàn trả thành công! Mã giao dịch: ${data.transaction_code}`);
      form.resetFields();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Hoàn trả thất bại!";
      toast.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const returnData: IReturnInventoryRequest = {
      product_id: values.product_id,
      product_variant_id: values.product_variant_id || undefined,
      quantity: values.quantity,
      order_id: values.order_id || undefined,
      lot_id: values.lot_id || undefined,
      notes: values.notes,
    };

    returnMutation.mutate(returnData);
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
          <h1 className="text-2xl font-bold">Hoàn trả hàng</h1>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={returnResult ? 12 : 24}>
          <Card title="Thông tin hoàn trả">
            <Alert
              message="Lưu ý"
              description="Hoàn trả hàng sẽ tăng số lượng tồn kho của sản phẩm. Nếu chỉ định lô hàng cụ thể, hàng sẽ được hoàn về lô đó, ngược lại sẽ tạo lô mới."
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số lượng hoàn trả"
                    name="quantity"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập số lượng hoàn trả"
                      style={{ width: "100%" }}
                      min={1}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Đơn hàng liên quan" name="order_id">
                    <Select
                      placeholder="Chọn đơn hàng (tùy chọn)"
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {ordersData?.orders?.map((order) => (
                        <Option key={order.id} value={order.id}>
                          {order.order_number} - {order.customer_info.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Mã lô cụ thể" name="lot_id">
                <InputNumber
                  placeholder="Nhập ID lô hàng (tùy chọn)"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>

              <Form.Item label="Lý do hoàn trả" name="notes">
                <TextArea
                  placeholder="Nhập lý do hoàn trả"
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
                    icon={<UndoOutlined />}
                    loading={returnMutation.isPending}
                    size="large"
                  >
                    Hoàn trả
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

        {returnResult && (
          <Col span={12}>
            <Card title="Kết quả hoàn trả" className="border-green-200">
              <Alert
                message="Hoàn trả thành công!"
                description={
                  <div>
                    <p><strong>Mã giao dịch:</strong> {returnResult.transaction_code}</p>
                    <p><strong>Số lượng hoàn trả:</strong> {returnResult.returned_quantity}</p>
                    <p><strong>Lô được cập nhật:</strong> {returnResult.lot_updated.lot_number}</p>
                    <p><strong>Số lượng còn lại trong lô:</strong> {returnResult.lot_updated.remaining_quantity}</p>
                  </div>
                }
                type="success"
                showIcon
              />

              <div className="mt-4">
                <Button
                  type="primary"
                  onClick={() => {
                    setReturnResult(null);
                    form.resetFields();
                  }}
                >
                  Hoàn trả tiếp
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
