import React from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromotion } from "../../../services/promotionService";
import { useNavigate } from "react-router-dom";
import type { IPromotionCreate } from "../../../interfaces/promotion";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const AddPromotion: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      toast.success("Thêm khuyến mãi thành công!");
      form.resetFields();
      navigate("/admin/promotion");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi thêm khuyến mãi!");
    },
  });

  const onFinish = (values: {
    promotion_name: string;
    promotion_code: string;
    description?: string;
    discount_type: string;
    discount_value: number;
    minimum_order_value: number;
    maximum_discount_amount?: number;
    start_date: any;
    end_date: any;
    usage_limit?: number;
    applies_to: string;
    status: boolean;
  }) => {
    console.log("Form values:", values);

    const formData: IPromotionCreate = {
      promotion_name: values.promotion_name,
      promotion_code: values.promotion_code,
      description: values.description || "",
      discount_type: values.discount_type,
      discount_value: values.discount_value.toString(),
      minimum_order_value: values.minimum_order_value.toString(),
      maximum_discount_amount: values.maximum_discount_amount
        ? values.maximum_discount_amount.toString()
        : null,
      start_date: values.start_date.format("YYYY-MM-DD HH:mm:ss"),
      end_date: values.end_date.format("YYYY-MM-DD HH:mm:ss"),
      usage_limit: values.usage_limit || null,
      applies_to: values.applies_to,
      status: values.status,
    };

    mutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thêm khuyến mãi mới</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-2xl bg-white p-6 rounded-lg shadow"
        initialValues={{
          discount_type: "percentage",
          applies_to: "all",
          status: true,
        }}
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
            rules={[
              { required: true, message: "Vui lòng chọn loại giảm giá!" },
            ]}
          >
            <Select disabled>
              <Option value="percentage">Phần trăm (%)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá trị giảm"
            name="discount_value"
            validateTrigger="onChange"
            extra="Giá trị khuyến mãi phải trong khoảng từ 1 đến 50."
            rules={[
              { required: true, message: "Vui lòng nhập giá trị giảm!" },
              () => ({
                validator(_, value) {
                  if (value && (value < 1 || value > 50)) {
                    return Promise.reject(
                      new Error("Giá trị khuyến mãi phải từ 1 đến 50%!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              min={1}
              max={50}
              placeholder="Nhập giá trị (1-50)"
              className="w-full"
              formatter={(value) => `${value}%`}
              parser={(value) => Number(value?.replace(/[^\d.]/g, ""))}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Giá trị đơn hàng tối thiểu"
            name="minimum_order_value"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị tối thiểu!" },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập giá trị (VNĐ)"
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ""))}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            extra="Ngày và giờ bắt đầu không được ở trong quá khứ."
            rules={[
              { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              () => ({
                validator(_, value) {
                  if (value && value.isBefore(dayjs())) {
                    return Promise.reject(
                      new Error("Ngày/giờ bắt đầu không được ở trong quá khứ!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn ngày bắt đầu"
              className="w-full"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              disabledTime={(date) => {
                if (date && date.isSame(dayjs(), "date")) {
                  const now = dayjs();
                  const range = (start: number, end: number) => {
                    const result = [];
                    for (let i = start; i < end; i++) {
                      result.push(i);
                    }
                    return result;
                  };
                  return {
                    disabledHours: () => range(0, now.hour()),
                    disabledMinutes: (hour) => {
                      if (hour === now.hour()) {
                        return range(0, now.minute());
                      }
                      return [];
                    },
                    disabledSeconds: (hour, minute) => {
                      if (hour === now.hour() && minute === now.minute()) {
                        return range(0, now.second());
                      }
                      return [];
                    },
                  };
                }
                return {};
              }}
            />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            dependencies={["start_date"]}
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue("start_date")) {
                    return Promise.resolve();
                  }
                  if (value.isBefore(getFieldValue("start_date"))) {
                    return Promise.reject(
                      new Error("Ngày kết thúc không được trước ngày bắt đầu!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn ngày kết thúc"
              className="w-full"
              disabledDate={(current) => {
                const startDate = form.getFieldValue("start_date");
                if (!startDate) {
                  return false;
                }
                return current && current < startDate.startOf("day");
              }}
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
            rules={[
              { required: true, message: "Vui lòng chọn đối tượng áp dụng!" },
            ]}
          >
            <Select>
              <Option value="all">Tất cả sản phẩm</Option>
              <Option value="specific_categories">Danh mục cụ thể</Option>
              <Option value="specific_products">Sản phẩm cụ thể</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
            >
              Thêm khuyến mãi
            </Button>
            <Button onClick={() => navigate("/admin/promotion")}>Hủy</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPromotion;
