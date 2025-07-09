import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Button,
  Card,
  Typography,
  Breadcrumb,
  Space,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAttributeById,
  updateAttribute,
} from "../../../services/attributeService";
import type { IUpdateAttributeRequest } from "../../../interfaces/attribute";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const EditAttribute: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  // Query
  const { data: attribute, isLoading } = useQuery({
    queryKey: ["attribute", id],
    queryFn: () => getAttributeById(Number(id)),
    enabled: !!id,
  });

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (data: IUpdateAttributeRequest) =>
      updateAttribute(Number(id), data),
    onSuccess: () => {
      message.success("Cập nhật thuộc tính thành công!");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      queryClient.invalidateQueries({ queryKey: ["attribute", id] });
      navigate("/admin/attribute");
    },
    onError: (error: any) => {
      console.error("Error updating attribute:", error);
      message.error("Có lỗi xảy ra khi cập nhật thuộc tính!");
    },
  });

  // Set form values when data loads
  useEffect(() => {
    if (attribute) {
      form.setFieldsValue({
        attribute_name: attribute.attribute_name,
        attribute_type: attribute.attribute_type,
        description: attribute.description,
        is_required: attribute.is_required,
        sort_order: attribute.sort_order,
        status: attribute.status,
      });
    }
  }, [attribute, form]);

  // Form submit
  const onFinish = (values: IUpdateAttributeRequest) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!attribute) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={3}>Không tìm thấy thuộc tính!</Title>
        <Button onClick={() => navigate("/admin/attribute")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>Trang chủ</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined />
          <span>Quản lý thuộc tính</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined />
          <span>Sửa thuộc tính</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <EditOutlined style={{ marginRight: 8 }} />
          Sửa thuộc tính: {attribute.attribute_name}
        </Title>
      </div>

      {/* Form */}
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="attribute_name"
                label="Tên thuộc tính"
                rules={[
                  { required: true, message: "Vui lòng nhập tên thuộc tính!" },
                  { min: 2, message: "Tên thuộc tính phải có ít nhất 2 ký tự!" },
                  { max: 100, message: "Tên thuộc tính không được quá 100 ký tự!" },
                ]}
              >
                <Input placeholder="VD: Weight, Size, Color..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="attribute_type"
                label="Loại thuộc tính"
                rules={[{ required: true, message: "Vui lòng chọn loại thuộc tính!" }]}
              >
                <Select placeholder="Chọn loại thuộc tính">
                  <Option value="select">Lựa chọn (Select)</Option>
                  <Option value="text">Văn bản (Text)</Option>
                  <Option value="number">Số (Number)</Option>
                  <Option value="color">Màu sắc (Color)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { max: 500, message: "Mô tả không được quá 500 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về thuộc tính này..."
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="sort_order"
                label="Thứ tự hiển thị"
                rules={[
                  { required: true, message: "Vui lòng nhập thứ tự!" },
                  { type: "number", min: 1, message: "Thứ tự phải lớn hơn 0!" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={999}
                  style={{ width: "100%" }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="is_required"
                label="Bắt buộc"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Bắt buộc"
                  unCheckedChildren="Tùy chọn"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Tạm dừng"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Actions */}
          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateMutation.isPending}
                size="large"
              >
                Cập nhật thuộc tính
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/attribute")}
                size="large"
              >
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditAttribute;
