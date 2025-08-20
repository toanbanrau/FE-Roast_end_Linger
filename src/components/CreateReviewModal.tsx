import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Rate,
  Input,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UploadFile } from "antd/es/upload/interface";
import {
  createProductReview,
  getReviewableProducts,
} from "../services/reviewService";
import type { IReviewForm, IReviewableProduct } from "../interfaces/review";

const { TextArea } = Input;
const { Option } = Select;

interface CreateReviewModalProps {
  visible: boolean;
  onCancel: () => void;
  productId?: number; // If specified, only show this product
}

export default function CreateReviewModal({
  visible,
  onCancel,
  productId,
}: CreateReviewModalProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<IReviewableProduct | null>(null);

  // Fetch reviewable products
  const { data: reviewableProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["reviewable-products"],
    queryFn: getReviewableProducts,
    enabled: visible,
  });

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: ({
      productId,
      reviewData,
    }: {
      productId: number;
      reviewData: IReviewForm;
    }) => {
      console.log("🎯 Mutation function called with:", {
        productId,
        reviewData,
      });
      return createProductReview(productId, reviewData);
    },
    onMutate: (variables) => {
      console.log("🔄 Mutation starting with variables:", variables);
    },
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      message.success("Đánh giá của bạn đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewable-products"] });
      handleCancel();
    },
    onError: (error: any) => {
      console.error("❌ Mutation error:", error);
      console.error("❌ Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      const errorMessage =
        error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá!";
      message.error(errorMessage);
    },
    onSettled: () => {
      console.log("🏁 Mutation settled (completed)");
    },
  });

  // Filter products based on productId prop
  const filteredProducts =
    reviewableProducts?.filter((item) =>
      productId ? item.product.id === productId : true
    ) || [];

  // Debug log
  console.log("CreateReviewModal Debug:", {
    productId,
    reviewableProducts: reviewableProducts?.length || 0,
    filteredProducts: filteredProducts.length,
    selectedProduct: selectedProduct?.product.name || "None",
  });

  // Auto-select product if only one available
  useEffect(() => {
    if (filteredProducts.length === 1 && !selectedProduct) {
      console.log("🔄 Auto-selecting product:", filteredProducts[0]);
      setSelectedProduct(filteredProducts[0]);
      form.setFieldValue("order_item_id", filteredProducts[0].order_item_id);
      console.log(
        "✅ Set order_item_id to form:",
        filteredProducts[0].order_item_id
      );

      // Verify form value was set
      setTimeout(() => {
        const currentValue = form.getFieldValue("order_item_id");
        console.log("🔍 Current form order_item_id value:", currentValue);
      }, 100);
    }
  }, [filteredProducts, selectedProduct, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setSelectedProduct(null);
    onCancel();
  };

  const handleProductSelect = (orderItemId: number) => {
    const product = filteredProducts.find(
      (item) => item.order_item_id === orderItemId
    );
    setSelectedProduct(product || null);
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể upload file ảnh!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    return false; // Prevent auto upload
  };

  const onFinish = (values: any) => {
    console.log("onFinish called with values:", values);
    console.log("selectedProduct:", selectedProduct);

    if (!selectedProduct) {
      message.error("Vui lòng chọn sản phẩm để đánh giá!");
      return;
    }

    console.log("🔍 Form values received:", values);
    console.log("🔍 Rating value:", values.rating, typeof values.rating);
    console.log(
      "🔍 Order item ID:",
      values.order_item_id,
      typeof values.order_item_id
    );

    // Validate required fields
    if (!values.rating) {
      message.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    // Backup: If order_item_id is missing from form, use selectedProduct
    let orderItemId = values.order_item_id;
    if (!orderItemId && selectedProduct) {
      console.log("⚠️ order_item_id missing from form, using selectedProduct");
      orderItemId = selectedProduct.order_item_id;
    }

    if (!orderItemId) {
      message.error("Thiếu thông tin order item!");
      return;
    }

    const reviewData: IReviewForm = {
      rating: values.rating,
      title: values.title,
      comment: values.comment,
      order_item_id: orderItemId, // Use the backup orderItemId
      images: fileList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[],
    };

    console.log("Submitting review data:", reviewData);
    console.log("Product ID:", selectedProduct.product.id);

    console.log("🚀 About to call createMutation.mutate()");
    console.log("🔍 Mutation state:", {
      isPending: createMutation.isPending,
      isError: createMutation.isError,
      error: createMutation.error,
    });

    try {
      createMutation.mutate({
        productId: selectedProduct.product.id,
        reviewData,
      });
      console.log("✅ createMutation.mutate() called successfully");
    } catch (error) {
      console.error("❌ Error calling createMutation.mutate():", error);
    }
  };

  return (
    <Modal
      title="Viết đánh giá sản phẩm"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      {/* No products available message */}
      {!isLoadingProducts && filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            {productId
              ? "Bạn chưa mua sản phẩm này hoặc đã đánh giá rồi"
              : "Không có sản phẩm nào để đánh giá"}
          </div>
          <Button onClick={handleCancel}>Đóng</Button>
        </div>
      )}

      {/* Form - only show if has products */}
      {filteredProducts.length > 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log("Form validation failed:", errorInfo);
          }}
          className="space-y-4"
        >
          {/* Product Selection */}
          {!productId && filteredProducts.length > 1 && (
            <Form.Item
              label="Chọn sản phẩm"
              name="order_item_id"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
            >
              <Select
                placeholder="Chọn sản phẩm bạn muốn đánh giá"
                onChange={handleProductSelect}
                loading={isLoadingProducts}
              >
                {filteredProducts.map((item) => (
                  <Option key={item.order_item_id} value={item.order_item_id}>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image.url}
                        alt={item.product.image.alt_text}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        {item.variant && (
                          <div className="text-sm text-gray-500">
                            {item.variant.name}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Đơn hàng: {item.order_number}
                        </div>
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Selected Product Display */}
          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.product.image.url}
                  alt={selectedProduct.product.image.alt_text}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">
                    {selectedProduct.product.name}
                  </h4>
                  {selectedProduct.variant && (
                    <p className="text-sm text-gray-600">
                      {selectedProduct.variant.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Đơn hàng: {selectedProduct.order_number} • Mua{" "}
                    {selectedProduct.days_since_purchase} ngày trước
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rating */}
          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
          >
            <Rate allowClear={false} />
          </Form.Item>

          {/* Title */}
          <Form.Item label="Tiêu đề đánh giá" name="title">
            <Input
              placeholder="Tóm tắt ngắn gọn về trải nghiệm của bạn"
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* Comment */}
          <Form.Item label="Nội dung đánh giá" name="comment">
            <TextArea
              rows={4}
              placeholder="Chia sẻ chi tiết về sản phẩm: chất lượng, hương vị, đóng gói..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          {/* Images */}
          <Form.Item label="Hình ảnh (tùy chọn)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={5}
              multiple
            >
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <p className="text-sm text-gray-500 mt-2">
              Tối đa 5 ảnh, mỗi ảnh dưới 2MB. Hỗ trợ JPG, PNG, GIF.
            </p>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <div className="flex gap-3 justify-end">
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending}
                disabled={!selectedProduct}
              >
                {createMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
