import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "../../../services/brandService";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import type { IBrandCreate } from "../../../interfaces/brand";

const AddBrand: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation để thêm brand mới
  const mutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      message.success("Thêm thương hiệu thành công!");
      form.resetFields();
      navigate("/admin/brand");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => {
      console.error("Error details:", error);
      message.error("Có lỗi xảy ra khi thêm thương hiệu!");
    },
  });

  const onFinish = (values: IBrandCreate & { logo?: UploadFile[] }) => {
    console.log(values);
    
    const formData = new FormData();
    formData.append("brand_name", values.brand_name);
    formData.append("description", values.description || "");
    formData.append("website", values.website || "");

    if (values.logo && values.logo[0]?.originFileObj) {
      formData.append("logo", values.logo[0].originFileObj);
    }
    mutation.mutate(formData);
    console.log(formData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <Form.Item
        label="Tên thương hiệu"
        name="brand_name"
        rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu!" }]}
      >
        <Input placeholder="Nhập tên thương hiệu" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

      <Form.Item
        label="Logo"
        name="logo"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload
          name="logo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Chọn file logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Website" name="website">
        <Input placeholder="Nhập website (nếu có)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Thêm Thương Hiệu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddBrand;
