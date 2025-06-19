import React, { useEffect } from "react";
import { Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getBrandById, updateBrand } from "../../../services/brandService";
import type { IBrand } from "../../../interfaces/brand";

const EditBrand: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["brands", id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateBrand(Number(id), formData),
    onSuccess: () => {
      message.success("Cập nhật thương hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      navigate("admin/brand");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật thương hiệu!");
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        logo: data.logo
          ? [
              {
                uid: "-1",
                name: "logo.jpg",
                status: "done",
                url: data.logo,
              },
            ]
          : [],
      });
    }
  }, [data, form]);

  const onFinish = (values: IBrand) => {
    const formData = new FormData();
    formData.append("brand_name", values.brand_name);
    formData.append("description", values.description || "");
    formData.append("website", values.website || "");

    const file = values.logo?.[0]?.originFileObj;
    if (file) {
      formData.append("logo", file);
    }

    mutation.mutate(formData);
  };

  if (isLoading) return <Spin />;

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
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      >
        <Upload
          name="logo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Chọn file logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Website" name="website">
        <Input placeholder="Nhập website (nếu có)" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          className="w-full"
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditBrand;
