import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Row,
  Col,
  Tag,
  Descriptions,
  Table,
  Spin,
} from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { getAttributeById } from "../../../services/attributeService";
import type { IAttributeValue } from "../../../interfaces/attribute";

const { Title } = Typography;

const AttributeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const attributeId = Number(id);

  // Query
  const { data: attribute, isLoading } = useQuery({
    queryKey: ["attribute", attributeId],
    queryFn: () => getAttributeById(attributeId),
    enabled: !!attributeId,
  });

  // Table columns for attribute values
  const columns: ColumnsType<IAttributeValue> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Thứ tự",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
  ];

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
          <EyeOutlined />
          <span>Chi tiết thuộc tính</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <EyeOutlined style={{ marginRight: 8 }} />
          Chi tiết thuộc tính: {attribute.attribute_name}
        </Title>
      </div>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/attribute")}
          >
            Quay lại danh sách
          </Button>
          <Link to={`/admin/attribute/edit/${attribute.id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Chỉnh sửa thuộc tính
            </Button>
          </Link>
          <Link to={`/admin/attribute/${attribute.id}/values`}>
            <Button type="dashed" icon={<SettingOutlined />}>
              Quản lý giá trị
            </Button>
          </Link>
        </Space>
      </Card>

      <Row gutter={24}>
        {/* Attribute Information */}
        <Col span={12}>
          <Card title="Thông tin thuộc tính" style={{ marginBottom: 24 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên thuộc tính">
                {attribute.attribute_name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại thuộc tính">
                <Tag color="blue">
                  {attribute.attribute_type === "select" ? "Lựa chọn" : attribute.attribute_type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {attribute.description}
              </Descriptions.Item>
              <Descriptions.Item label="Bắt buộc">
                <Tag color={attribute.is_required ? "red" : "default"}>
                  {attribute.is_required ? "Bắt buộc" : "Tùy chọn"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thứ tự hiển thị">
                {attribute.sort_order}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={attribute.status ? "success" : "error"}>
                  {attribute.status ? "Hoạt động" : "Tạm dừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {attribute.created_at ? new Date(attribute.created_at).toLocaleString("vi-VN") : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {attribute.updated_at ? new Date(attribute.updated_at).toLocaleString("vi-VN") : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Statistics */}
        <Col span={12}>
          <Card title="Thống kê" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                      {attribute.attribute_values?.length || 0}
                    </div>
                    <div style={{ color: "#666" }}>Tổng giá trị</div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                      {attribute.attribute_values?.filter(v => v.status).length || 0}
                    </div>
                    <div style={{ color: "#666" }}>Đang hoạt động</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Attribute Values */}
      <Card 
        title={`Danh sách giá trị (${attribute.attribute_values?.length || 0})`}
        extra={
          <Link to={`/admin/attribute/${attribute.id}/values`}>
            <Button type="primary" size="small">
              Quản lý giá trị
            </Button>
          </Link>
        }
      >
        <Table
          columns={columns}
          dataSource={attribute.attribute_values || []}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} giá trị`,
          }}
        />
      </Card>
    </div>
  );
};

export default AttributeDetail;
