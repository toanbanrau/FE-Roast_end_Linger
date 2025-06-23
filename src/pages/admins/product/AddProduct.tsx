import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Spin,
  Row,
  Col,
  Upload,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { createAdminProduct } from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import { getAllOrigins } from "../../../services/originService";

import type { IProductCreate, IProductOrigin } from "../../../interfaces/product";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";

const { TextArea } = Input;
const { Option } = Select;

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const hasVariants = Form.useWatch('has_variants', form);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getAllCategories });
  const { data: brands, isLoading: isLoadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getAllBrands });
  const { data: origins, isLoading: isLoadingOrigins } = useQuery({ queryKey: ['origins'], queryFn: getAllOrigins });

  const mutation = useMutation({
    mutationFn: (product: IProductCreate) => createAdminProduct(product),
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm sản phẩm!");
    },
  });

  const onFinish = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((img: any, idx: number) => {
          formData.append(`images[${idx}][image_file]`, img.originFileObj);
          formData.append(`images[${idx}][alt_text]`, img.alt_text || '');
          formData.append(`images[${idx}][sort_order]`, img.sort_order || idx + 1);
          formData.append(`images[${idx}][is_primary]`, img.is_primary ? '1' : '0');
        });
      } else if (typeof value !== 'undefined' && value !== null) {
        formData.append(key, value);
      }
    });
    mutation.mutate(formData);
  };
  
  if (isLoadingCategories || isLoadingBrands || isLoadingOrigins) return <Spin />;

  return (
    <div className="p-5">
      {" "}
      <h2 className="mb-4 text-2xl font-bold">Add New Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        encType="multipart/form-data"
        className="max-w-3xl"
        initialValues={{ has_variants: false, is_featured: false, status: 'active', variants: [{}] }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name="product_name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input />{" "}
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <TextArea rows={6} />{" "}
            </Form.Item>
            <Form.Item
              name="short_description"
              label="Short Description"
              rules={[{ required: true }]}
            >
              <TextArea rows={3} />{" "}
            </Form.Item>
            <Form.Item name="images" label="Ảnh sản phẩm" valuePropName="fileList" rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 ảnh!' }]}>
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>

            {/* Variants Section */}
            {hasVariants && (
              <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
                <h4>Quản lý biến thể</h4>
                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={16} style={{ marginBottom: 8, alignItems: 'center' }}>
                          <Col span={6}>
                            <Form.Item {...restField} name={[name, 'variant_name']} rules={[{ required: true, message: 'Nhập tên biến thể' }]}>
                              <Input placeholder="Tên biến thể (Màu, Size)" />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item {...restField} name={[name, 'sku_code']} rules={[{ required: true, message: 'Nhập SKU' }]}>
                              <Input placeholder="SKU" />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, message: 'Nhập giá' }]}>
                              <InputNumber min={0} placeholder="Giá biến thể" style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item {...restField} name={[name, 'stock_quantity']} rules={[{ required: true, message: 'Nhập số lượng' }]}>
                              <InputNumber min={0} placeholder="Số lượng" style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm biến thể
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            )}
          </Col>
          <Col span={8}>
            {!hasVariants && (
              <>
                <Form.Item
                  name="base_price"
                  label="Base Price"
                  rules={[{ required: !hasVariants, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber min={0} className="w-full" />{" "}
                </Form.Item>
                <Form.Item
                  name="stock_quantity"
                  label="Stock Quantity"
                  rules={[{ required: !hasVariants, message: 'Vui lòng nhập số lượng!' }]}
                >
                  <InputNumber min={0} className="w-full" />{" "}
                </Form.Item>
              </>
            )}
            <Form.Item
              name="category_id"
              label="Category"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              {" "}
              <Select>
                {categories?.map((cat: ICategory) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.category_name}{" "}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
            <Form.Item name="brand_id" label="Brand" rules={[{ required: true }]}>
              {" "}
              <Select>
                {brands?.map((brand: IBrand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.brand_name}{" "}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
            <Form.Item name="origin_id" label="Origin" rules={[{ required: true }]}>
              {" "}
              <Select>
                {origins?.map((origin: IProductOrigin) => (
                  <Option key={origin.id} value={origin.id}>
                    {origin.origin_name}{" "}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
            <Form.Item name="status" label="Status" valuePropName="checked">
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="is_featured"
              label="Featured Product"
              valuePropName="checked"
            >
              <Switch />{" "}
            </Form.Item>
            <Form.Item
              name="has_variants"
              label="Has Variants"
              valuePropName="checked"
            >
              <Switch />{" "}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {" "}
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Add Product{" "}
          </Button>
        </Form.Item>
      </Form>{" "}
    </div>
  );
};

export default AddProduct;
