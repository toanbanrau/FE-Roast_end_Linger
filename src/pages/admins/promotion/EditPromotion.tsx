import React, { useEffect } from "react";
import { Form, Input, Button, message, Select, DatePicker, InputNumber, Switch, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPromotionById, updatePromotion } from "../../../services/promotionService";
import { useNavigate, useParams } from "react-router-dom";
import type { IPromotionUpdate } from "../../../interfaces/promotion";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const EditPromotion: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Query để lấy thông tin promotion cần edit
  const { data: promotion, isLoading, error } = useQuery({
    queryKey: ["promotion", id],
    queryFn: () => getPromotionById(Number(id)),
    enabled: !!id,
  });

  // Mutation để update promotion
  const mutation = useMutation({
    mutationFn: (data: IPromotionUpdate) => updatePromotion(Number(id), data),
    onSuccess: () => {
      message.success("Cập nhật khuyến mãi thành công!");
      navigate("/admin/promotion");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["promotion", id] });
    },
    onError: (error) => {
      console.error("Error details:", error);
      message.error("Có lỗi xảy ra khi cập nhật khuyến mãi!");
    },
  });

  // Set form values khi có dữ liệu
  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        promotion_name: promotion.promotion_name,
        promotion_code: promotion.promotion_code,
        description: promotion.description,
        discount_type: promotion.discount_type,
        discount_value: parseFloat(promotion.discount_value),
        minimum_order_value: parseFloat(promotion.minimum_order_value),
        maximum_discount_amount: promotion.maximum_discount_amount ? parseFloat(promotion.maximum_discount_amount) : undefined,
        start_date: dayjs(promotion.start_date),
        end_date: dayjs(promotion.end_date),
        usage_limit: promotion.usage_limit,
        applies_to: promotion.applies_to,
        status: promotion.status,
      });
    }
  }, [promotion, form]);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    
    const formData: IPromotionUpdate = {
      promotion_name: values.promotion_name,
      promotion_code: values.promotion_code,
      description: values.description || "",
      discount_type: values.discount_type,
      discount_value: values.discount_value.toString(),
      minimum_order_value: values.minimum_order_value.toString(),
      maximum_discount_amount: values.maximum_discount_amount ? values.maximum_discount_amount.toString() : null,
      start_date: values.start_date.format("YYYY-MM-DD HH:mm:ss"),
      end_date: values.end_date.format("YYYY-MM-DD HH:mm:ss"),
      usage_limit: values.usage_limit || null,
      applies_to: values.applies_to,
      status: values.status,
    };

    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu!</div>
        <Button onClick={() => navigate("/admin/promotion")} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Không tìm thấy khuyến mãi!</div>
        <Button onClick={() => navigate("/admin/promotion")} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa khuyến mãi</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-2xl bg-white p-6 rounded-lg shadow"
      >
        <Form.Item
          label="Tên khuyến mãi"
          name="promotion_name"
          rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
        >
          <Input placeholder="Nhập tên khuyến mãi" />
        </Form.Item>

        <Form.Item
          label="Mã khuyến mãi"
          name="promotion_code"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
        >
          <Input placeholder="Nhập mã khuyến mãi (VD: SUMMER2024)" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={3} placeholder="Nhập mô tả khuyến mãi (nếu có)" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Loại giảm giá"
            name="discount_type"
            rules={[{ required: true, message: "Vui lòng chọn loại giảm giá!" }]}
          >
            <Select>
              <Option value="percentage">Phần trăm (%)</Option>
              <Option value="fixed_amount">Số tiền cố định (VNĐ)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá trị giảm"
            name="discount_value"
            rules={[{ required: true, message: "Vui lòng nhập giá trị giảm!" }]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Nhập giá trị"
              className="w-full"
              formatter={(value) => {
                const discountType = form.getFieldValue("discount_type");
                return discountType === "percentage" ? `${value}%` : `${value}`;
              }}
              parser={(value) => Number(value?.replace(/[^\d.]/g, ""))}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Giá trị đơn hàng tối thiểu"
            name="minimum_order_value"
            rules={[{ required: true, message: "Vui lòng nhập giá trị tối thiểu!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập giá trị (VNĐ)"
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ""))}
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá tối đa"
            name="maximum_discount_amount"
            tooltip="Để trống nếu không giới hạn"
          >
            <InputNumber
              min={0}
              placeholder="Nhập giá trị (VNĐ)"
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ""))}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn ngày bắt đầu"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn ngày kết thúc"
              className="w-full"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Giới hạn sử dụng"
            name="usage_limit"
            tooltip="Để trống nếu không giới hạn"
          >
            <InputNumber
              min={1}
              placeholder="Nhập số lượt sử dụng"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Áp dụng cho"
            name="applies_to"
            rules={[{ required: true, message: "Vui lòng chọn đối tượng áp dụng!" }]}
          >
            <Select>
              <Option value="all">Tất cả sản phẩm</Option>
              <Option value="specific_categories">Danh mục cụ thể</Option>
              <Option value="specific_products">Sản phẩm cụ thể</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Trạng thái"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" loading={mutation.isPending}>
              Cập nhật khuyến mãi
            </Button>
            <Button onClick={() => navigate("/admin/promotion")}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPromotion;
