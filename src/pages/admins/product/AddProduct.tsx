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
  Card,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { getAttributeCombinations } from '../../../services/productService';
import { useEffect, useState } from 'react';

import { createAdminProduct } from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import { getAllOrigins } from "../../../services/originService";

import type { IProductOrigin } from "../../../interfaces/product";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";

const { TextArea } = Input;
const { Option } = Select;

const COFFEE_TYPES = ['arabica', 'robusta', 'blend'];

interface AttributeValue {
  id: number;
  value: string;
  price_adjustment?: string;
  sort_order?: number;
}

interface AttributeGroup {
  attribute_name: string;
  values: AttributeValue[];
}

type UploadChangeParam = {
  file: UploadFile;
  fileList: UploadFile[];
};

const normFile = (e: UploadChangeParam | UploadFile[]) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e.fileList;
};

const beforeUpload = (file: RcFile) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('Bạn chỉ có thể tải lên file ảnh!');
  }
  return false;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const hasVariants = Form.useWatch('has_variants', form);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getAllCategories });
  const { data: brands, isLoading: isLoadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getAllBrands });
  const { data: origins, isLoading: isLoadingOrigins } = useQuery({ queryKey: ['origins'], queryFn: getAllOrigins });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createAdminProduct(formData),
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm sản phẩm!");
    },
  });

  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  useEffect(() => {
    getAttributeCombinations().then(data => {
      setAttributeGroups(data);
      setLoadingAttributes(false);
    }).catch(() => setLoadingAttributes(false));
  }, []);

  const filteredAttributeGroups = attributeGroups.filter(group => 
    selectedAttributes.includes(group.attribute_name)
  );

  const onFinish = async (values: Record<string, unknown>) => {
    const formData = new FormData();

    // Xử lý ảnh chính và album ảnh phụ
    const images: {
      image_file: File;
      alt_text: string;
      sort_order: number;
      is_primary: boolean;
    }[] = [];
    // Ảnh chính
    if (values.primary_image && Array.isArray(values.primary_image) && values.primary_image.length > 0) {
      images.push({
        image_file: values.primary_image[0].originFileObj as File,
        alt_text: (values.primary_alt_text as string) || '',
        sort_order: Number(values.primary_sort_order) || 1,
        is_primary: true
      });
    }
    // Album ảnh phụ
    if (values.album_images && Array.isArray(values.album_images)) {
      (values.album_images as unknown[]).forEach((imgRaw, idx: number) => {
        const img = imgRaw as { image: UploadFile[]; alt_text?: string; sort_order?: number };
        if (img.image && Array.isArray(img.image) && img.image.length > 0) {
          images.push({
            image_file: img.image[0].originFileObj as File,
            alt_text: img.alt_text || '',
            sort_order: Number(img.sort_order) || (idx + 2),
            is_primary: false
          });
        }
      });
    }
    // Đưa images vào formData
    images.forEach((img, idx) => {
      formData.append(`images[${idx}][image_file]`, img.image_file);
      formData.append(`images[${idx}][alt_text]`, img.alt_text);
      formData.append(`images[${idx}][sort_order]`, String(img.sort_order));
      formData.append(`images[${idx}][is_primary]`, img.is_primary ? '1' : '0');
    });

    // Xử lý các trường cơ bản khác
    Object.entries(values).forEach(([key, value]) => {
      if (
        key === 'primary_image' ||
        key === 'primary_alt_text' ||
        key === 'primary_sort_order' ||
        key === 'album_images' ||
        key === 'images'
      ) {
        // Đã xử lý ở trên
        return;
      }
      if (key === 'variants' && Array.isArray(value) && values.has_variants) {
        value.forEach((variant, idx) => {
          // Lấy các id thuộc tính từ 3 trường
          const attrIds = attributeGroups.map(group => variant[group.attribute_name]).filter(Boolean);
          attrIds.forEach((attrVal, attrIdx) => {
            formData.append(`variants[${idx}][attribute_values][${attrIdx}]`, String(attrVal));
          });
          Object.entries(variant).forEach(([variantKey, variantValue]) => {
            if (variantValue !== undefined && variantValue !== null) {
              if (variantKey === 'image' && Array.isArray(variantValue) && variantValue.length > 0) {
                formData.append(`variants[${idx}][image_file]`, variantValue[0].originFileObj as File);
              } else if (
                variantKey === 'sku_code' ||
                variantKey === 'variant_name' ||
                variantKey === 'price' ||
                variantKey === 'stock_quantity'
              ) {
                formData.append(`variants[${idx}][${variantKey}]`, String(variantValue));
              } else if (variantKey === 'status') {
                formData.append(`variants[${idx}][status]`, variantValue ? '1' : '0');
              }
            }
          });
        });
      } else if (typeof value !== 'undefined' && value !== null && key !== 'variants') {
        // Luôn gửi các trường khác (kể cả base_price)
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    // Log dữ liệu FormData gửi đi
    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    mutation.mutate(formData);
  };
  
  if (isLoadingCategories || isLoadingBrands || isLoadingOrigins || loadingAttributes) return <Spin />;

  return (
    <div className="p-5">
      <h2 className="mb-4 text-2xl font-bold">Add New Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        encType="multipart/form-data"
        className="max-w-[1200px]"
        initialValues={{ 
          has_variants: false, 
          is_featured: false, 
          status: 'active',
          variants: [{}],
          strength_score: 5
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            {/* Thông tin cơ bản */}
            <Card title="Thông tin cơ bản" className="mb-4">
              <Form.Item
                name="product_name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="VD: Cà phê Arabica Ethiopia Premium" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả chi tiết"
                rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết" }]}
              >
                <TextArea rows={6} placeholder="Mô tả chi tiết về sản phẩm..." />
              </Form.Item>

              <Form.Item
                name="short_description"
                label="Mô tả ngắn"
                rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
              >
                <TextArea rows={3} placeholder="Tóm tắt ngắn gọn về sản phẩm..." />
              </Form.Item>

              <Form.Item
                name="base_price"
                label="Giá cơ bản"
                rules={[
                  { required: true, message: "Vui lòng nhập giá cơ bản!" }
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Nhập giá cơ bản"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Card>

            {/* Hình ảnh sản phẩm */}
            <Card title="Hình ảnh sản phẩm" className="mb-4">
              {/* Ảnh chính */}
              <Form.Item
                name="primary_image"
                label="Ảnh chính"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh chính!' }]}
                getValueFromEvent={normFile}
                valuePropName="fileList"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={beforeUpload}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh chính</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item name="primary_alt_text" label="Mô tả ảnh chính">
                <Input placeholder="Mô tả ảnh chính sản phẩm" />
              </Form.Item>
              <Form.Item name="primary_sort_order" label="Thứ tự ảnh chính" initialValue={1}>
                <InputNumber min={1} className="w-full" />
              </Form.Item>

              {/* Album ảnh phụ */}
              <Form.List name="album_images">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card key={key} className="mb-2" size="small">
                        <Row gutter={8}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'image']}
                              label="Ảnh phụ"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                              rules={[{ required: true, message: 'Chọn ảnh phụ!' }]}
                            >
                              <Upload
                                listType="picture-card"
                                maxCount={1}
                                accept="image/*"
                                beforeUpload={beforeUpload}
                              >
                                <div>
                                  <UploadOutlined />
                                  <div style={{ marginTop: 8 }}>Tải ảnh phụ</div>
                                </div>
                              </Upload>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'alt_text']}
                              label="Mô tả"
                            >
                              <Input placeholder="Mô tả ảnh phụ" />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'sort_order']}
                              label="Thứ tự"
                              initialValue={key + 2}
                            >
                              <InputNumber min={2} className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button danger type="text" onClick={() => remove(name)}>
                              Xóa
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm ảnh phụ
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

            {/* Biến thể sản phẩm */}
            <Card 
              title="Biến thể sản phẩm" 
              className="mb-4"
              extra={
                <Form.Item name="has_variants" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Có biến thể" unCheckedChildren="Không biến thể" />
                </Form.Item>
              }
            >
              {/* Chọn thuộc tính cho sản phẩm */}
              {hasVariants && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Chọn thuộc tính cho sản phẩm này:</h4>
                  <div className="space-y-2">
                    {attributeGroups.map((group) => (
                      <label key={group.attribute_name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(group.attribute_name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttributes([...selectedAttributes, group.attribute_name]);
                            } else {
                              setSelectedAttributes(selectedAttributes.filter(attr => attr !== group.attribute_name));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="font-medium">{group.attribute_name}</span>
                        <span className="text-sm text-gray-600">
                          ({group.values.map(v => v.value).join(', ')})
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedAttributes.length === 0 && (
                    <div className="text-sm text-orange-600 mt-2">
                      ⚠️ Vui lòng chọn ít nhất 1 thuộc tính để tạo biến thể
                    </div>
                  )}
                </div>
              )}

              {hasVariants && (
                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card key={key} className="mb-4" size="small">
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'variant_name']}
                                label="Tên biến thể"
                                rules={[{ required: true, message: 'Tên biến thể là bắt buộc' }]}
                              >
                                <Input placeholder="Tên biến thể (VD: 250g, 500g)" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'sku_code']}
                                label="Mã SKU"
                                rules={[{ required: true, message: 'Mã SKU là bắt buộc' }]}
                              >
                                <Input placeholder="Nhập mã SKU" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'price']}
                                label="Giá"
                                rules={[{ required: true, message: 'Giá là bắt buộc' }]}
                              >
                                <InputNumber
                                  className="w-full"
                                  min={0}
                                  placeholder="Nhập giá"
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'stock_quantity']}
                                label="Số lượng trong kho"
                                rules={[{ required: true, message: 'Số lượng là bắt buộc' }]}
                              >
                                <InputNumber
                                  className="w-full"
                                  min={0}
                                  placeholder="Số lượng trong kho"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'status']}
                                label="Trạng thái"
                                valuePropName="checked"
                                initialValue={true}
                                rules={[{ required: true, message: 'Trạng thái biến thể là bắt buộc' }]}
                              >
                                <Switch checkedChildren="Đang bán" unCheckedChildren="Ngừng bán" />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'image']}
                                label="Ảnh biến thể"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: 'Vui lòng chọn ảnh cho biến thể!' }]}
                              >
                                <Upload
                                  listType="picture-card"
                                  accept="image/*"
                                  beforeUpload={beforeUpload}
                                  maxCount={1}
                                >
                                  <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                  </div>
                                </Upload>
                              </Form.Item>
                            </Col>
                            {filteredAttributeGroups.map((group) => (
                              <Col span={8} key={group.attribute_name}>
                                <Form.Item
                                  {...restField}
                                  name={[name, group.attribute_name]}
                                  label={group.attribute_name}
                                  rules={[{ required: true, message: `Chọn ${group.attribute_name.toLowerCase()}!` }]}
                                >
                                  <Select placeholder={`Chọn ${group.attribute_name.toLowerCase()}`}>
                                    {group.values.map((opt) => (
                                      <Option key={opt.id} value={opt.id}>{opt.value}</Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                            ))}
                          </Row>
                          <Button 
                            type="text" 
                            danger
                            onClick={() => remove(name)}
                            icon={<MinusCircleOutlined />}
                            className="absolute top-2 right-2"
                          >
                            Xóa
                          </Button>
                        </Card>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          disabled={selectedAttributes.length === 0}
                        >
                          Thêm biến thể
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              )}
            </Card>
          </Col>

          <Col span={8}>
            {/* Phân loại */}
            <Card title="Phân loại" className="mb-4">
              <Form.Item
                name="category_id"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories?.map((cat: ICategory) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="brand_id"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
              >
                <Select placeholder="Chọn thương hiệu">
                  {brands?.map((brand: IBrand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.brand_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="origin_id"
                label="Xuất xứ"
                rules={[{ required: true, message: 'Vui lòng chọn xuất xứ!' }]}
              >
                <Select placeholder="Chọn xuất xứ">
                  {origins?.map((origin: IProductOrigin) => (
                    <Option key={origin.id} value={origin.id}>
                      {origin.origin_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            {/* Thông tin cà phê */}
            <Card title="Thông tin cà phê" className="mb-4">
              <Form.Item
                name="coffee_type"
                label="Loại cà phê"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn loại cà phê">
                  {COFFEE_TYPES.map(type => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="roast_level"
                label="Mức độ rang"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn mức độ rang">
                  <Option value="light">Light</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="dark">Medium-Dark</Option>
                  <Option value="extra_dark">Dark</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="flavor_profile"
                label="Hương vị"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: Hương vị đậm đà, hậu vị ngọt" />
              </Form.Item>

              <Form.Item
                name="strength_score"
                label="Điểm đánh giá độ mạnh"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={10} step={0.1} className="w-full" />
              </Form.Item>
            </Card>

            {/* SEO & Trạng thái */}
            <Card title="SEO & Trạng thái" className="mb-4">
              <Form.Item
                name="meta_title"
                label="Meta Title"
                rules={[{ required: true }]}
              >
                <Input placeholder="Tiêu đề SEO" />
              </Form.Item>

              <Form.Item
                name="meta_description"
                label="Meta Description"
                rules={[{ required: true }]}
              >
                <TextArea rows={3} placeholder="Mô tả SEO" />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="active">Đang bán</Option>
                  <Option value="inactive">Ngừng bán</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="is_featured"
                label="Sản phẩm nổi bật"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddProduct;
