import {
  Form,
  Input,
  Button,
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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import {
  getProductById,
  updateAdminProduct,
} from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import { getAllOrigins } from "../../../services/originService";
import { getAttributeCombinations } from "../../../services/attributeService";

import type { IProductOrigin } from "../../../interfaces/product";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;

const ROAST_LEVELS = ["light", "medium", "medium-dark", "dark"];
const COFFEE_TYPES = ["arabica", "robusta", "blend"];

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedAttributeTypes, setSelectedAttributeTypes] = useState<
    string[]
  >([]);

  const hasVariants = Form.useWatch("has_variants", form);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: !!id,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const { data: brands, isLoading: isLoadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });
  const { data: origins, isLoading: isLoadingOrigins } = useQuery({
    queryKey: ["origins"],
    queryFn: getAllOrigins,
  });

  const { data: attributeGroups = [] } = useQuery({
    queryKey: ["attribute-combinations"],
    queryFn: getAttributeCombinations,
  });

  useEffect(() => {
    if (product) {
      // Chuẩn bị ảnh chính để hiển thị
      const primaryImageFile = product.primary_image
        ? [
            {
              uid: product.primary_image.id.toString(),
              name: `primary-image-${product.primary_image.id}`,
              status: "done" as const,
              url: product.primary_image.image_url,
            },
          ]
        : [];

      // Chuẩn bị album ảnh để hiển thị (loại bỏ ảnh chính)
      const albumImages =
        product.images
          ?.filter((img) => !img.is_primary)
          .map((img, index) => ({
            image: [
              {
                uid: img.id.toString(),
                name: `album-image-${img.id}`,
                status: "done" as const,
                url: img.image_url,
              },
            ],
            alt_text: img.alt_text,
            sort_order: img.sort_order,
          })) || [];

      form.setFieldsValue({
        ...product,
        // ✅ Extract IDs từ nested objects
        category_id: product.category?.id,
        brand_id: product.brand?.id,
        origin_id: product.origin?.id,
        base_price: product.base_price,
        primary_image: primaryImageFile,
        primary_alt_text: product.primary_image?.alt_text || "",
        primary_sort_order: product.primary_image?.sort_order || 1,
        album_images: albumImages,
        variants:
          (product as any)?.variants &&
          Array.isArray((product as any).variants) &&
          (product as any).variants.length > 0
            ? (product as any).variants.map((variant: any) => ({
                ...variant,
                // Map attributes để có thể edit
                ...variant.attributes?.reduce((acc: any, attr: any) => {
                  acc[attr.attribute_name] = attr.id;
                  return acc;
                }, {}),
                // Xử lý ảnh variant - chỉ sử dụng image_url
                image: variant.image_url
                  ? [
                      {
                        uid: variant.id.toString(),
                        name: `variant-${variant.id}`,
                        status: "done" as const,
                        url: variant.image_url,
                      },
                    ]
                  : [],
              }))
            : [{}],
      });

      // Set selected attribute types dựa trên variants hiện có
      if (
        product.has_variants &&
        (product as any).variants &&
        (product as any).variants.length > 0
      ) {
        const attributeNames = new Set<string>();
        (product as any).variants.forEach((variant: any) => {
          variant.attributes?.forEach((attr: any) => {
            attributeNames.add(attr.attribute_name);
          });
        });
        setSelectedAttributeTypes(Array.from(attributeNames));
      }
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateAdminProduct(Number(id), formData),
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err) => {
      message.error("Có lỗi xảy ra: " + err.message);
    },
  });

  const onFinish = async (values: unknown) => {
    const v = values as Record<string, unknown>;
    const formData = new FormData();

    // Thêm các trường cơ bản vào FormData
    const basicFields = [
      "product_name",
      "description",
      "short_description",
      "base_price", // ✅ Thêm base_price
      "coffee_type",
      "category_id",
      "brand_id",
      "origin_id",
      "roast_level",
      "flavor_profile",
      "strength_score",
      "meta_title",
      "meta_description",
      "has_variants",
      "status",
      "is_featured",
    ];

    basicFields.forEach((field) => {
      if (v[field] !== undefined && v[field] !== null) {
        if (typeof v[field] === "boolean") {
          formData.append(field, v[field] ? "1" : "0");
        } else {
          formData.append(field, String(v[field]));
        }
      }
    });

    // Xử lý base_price và stock_quantity
    if (!v.has_variants) {
      // Khi không có variants: gửi base_price và stock_quantity bình thường
      if (v.base_price) {
        formData.append("base_price", String(v.base_price));
      }
      if (v.stock_quantity) {
        formData.append("stock_quantity", String(v.stock_quantity));
      }
    }
    // Khi có variants: KHÔNG gửi base_price (để backend tự set null)

    // ===== XỬ LÝ ẢNH CHÍNH (CHỈ ẢNH MỚI) =====
    const processedImages: {
      image_file: File;
      alt_text: string;
      is_primary: boolean;
    }[] = [];

    // Thêm ảnh chính nếu có file mới
    if (
      v.primary_image &&
      Array.isArray(v.primary_image) &&
      v.primary_image.length > 0 &&
      (v.primary_image[0] as UploadFile).originFileObj
    ) {
      const primaryImageFile = (v.primary_image[0] as UploadFile)
        .originFileObj as File;
      const primaryAltText = (v.primary_alt_text as string) || "Ảnh chính";

      processedImages.push({
        image_file: primaryImageFile,
        alt_text: primaryAltText,
        is_primary: true,
      });
    }

    // ===== XỬ LÝ ALBUM ẢNH PHỤ (CHỈ ẢNH MỚI) =====
    if (v.album_images && Array.isArray(v.album_images)) {
      (v.album_images as unknown[]).forEach((imgRaw, index) => {
        const img = imgRaw as {
          image: UploadFile[];
          alt_text?: string;
        };

        if (
          img.image &&
          Array.isArray(img.image) &&
          img.image.length > 0 &&
          img.image[0].originFileObj
        ) {
          const albumImageFile = img.image[0].originFileObj as File;
          const albumAltText = img.alt_text || `Ảnh phụ ${index + 1}`;

          processedImages.push({
            image_file: albumImageFile,
            alt_text: albumAltText,
            is_primary: false,
          });
        }
      });
    }
    // ===== THÊM ẢNH MỚI VÀO FORMDATA =====
    processedImages.forEach((img, idx) => {
      formData.append(`images[${idx}][image_file]`, img.image_file);
      formData.append(`images[${idx}][alt_text]`, img.alt_text);
      formData.append(`images[${idx}][is_primary]`, img.is_primary ? "1" : "0");

      console.log(`📤 Đã thêm vào FormData - images[${idx}]:`, {
        fileName: img.image_file.name,
        altText: img.alt_text,
        isPrimary: img.is_primary,
      });
    });
    // ===== XỬ LÝ VARIANTS =====
    if (v.has_variants && v.variants && Array.isArray(v.variants)) {
      (v.variants as any[]).forEach((variant, idx) => {
        // Lấy attribute values từ các trường form (như AddProduct)
        const attrValues: number[] = [];
        selectedAttributeTypes.forEach((attrName) => {
          const attrValue = variant[attrName];
          if (attrValue) {
            attrValues.push(attrValue);
          }
        });

        // Thêm thông tin variant vào FormData
        formData.append(
          `variants[${idx}][variant_name]`,
          variant.variant_name || ""
        );
        formData.append(`variants[${idx}][sku_code]`, variant.sku_code || "");
        formData.append(`variants[${idx}][price]`, String(variant.price || 0));
        formData.append(
          `variants[${idx}][stock_quantity]`,
          String(variant.stock_quantity || 0)
        );
        formData.append(`variants[${idx}][status]`, variant.status ? "1" : "0");

        // Thêm attribute_values (match với JSON ví dụ)
        attrValues.forEach((attrVal, attrIdx) => {
          formData.append(
            `variants[${idx}][attribute_values][${attrIdx}]`,
            String(attrVal)
          );
        });

        console.log(`✅ Đã xử lý variant ${idx + 1}:`, {
          variant_name: variant.variant_name,
          sku_code: variant.sku_code,
          price: variant.price,
          stock_quantity: variant.stock_quantity,
          status: variant.status,
          attribute_values: attrValues,
        });

        // Thêm ảnh variant nếu có file mới
        if (
          variant.image &&
          Array.isArray(variant.image) &&
          variant.image.length > 0 &&
          variant.image[0].originFileObj
        ) {
          formData.append(
            `variants[${idx}][image_file]`,
            variant.image[0].originFileObj as File
          );
        }
      });
    }
    mutation.mutate(formData);
  };

  // Thêm hàm normFile
  const normFile = (
    e: { file: UploadFile; fileList: UploadFile[] } | UploadFile[]
  ) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e.fileList;
  };

  if (
    isLoadingProduct ||
    isLoadingCategories ||
    isLoadingBrands ||
    isLoadingOrigins
  )
    return <Spin tip="Đang tải dữ liệu..." />;

  return (
    <div className="p-5">
      <h2 className="mb-4 text-2xl font-bold">Edit Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        encType="multipart/form-data"
        className="max-w-[1200px]"
        initialValues={{
          has_variants: false,
          is_featured: false,
          status: "active",
          variants: [{}],
          strength_score: 5,
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            {/* Thông tin cơ bản */}
            <Card title="Thông tin cơ bản" className="mb-4">
              <Form.Item
                name="product_name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input placeholder="VD: Cà phê Arabica Ethiopia Premium" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả chi tiết"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả chi tiết" },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                />
              </Form.Item>
              <Form.Item
                name="short_description"
                label="Mô tả ngắn"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả ngắn" },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Tóm tắt ngắn gọn về sản phẩm..."
                />
              </Form.Item>
              {!hasVariants && (
                <Form.Item
                  name="base_price"
                  label="Giá cơ bản"
                  rules={[
                    {
                      required: !hasVariants,
                      message: "Vui lòng nhập giá cơ bản!",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    placeholder="Nhập giá cơ bản"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              )}

              {!hasVariants && (
                <Form.Item
                  name="stock_quantity"
                  label="Số lượng trong kho"
                  rules={[
                    {
                      required: !hasVariants,
                      message: "Vui lòng nhập số lượng!",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    placeholder="Nhập số lượng trong kho"
                  />
                </Form.Item>
              )}
            </Card>
            {/* Hình ảnh sản phẩm */}
            <Card title="Hình ảnh sản phẩm" className="mb-4">
              {/* Ảnh chính */}
              <Form.Item
                name="primary_image"
                label="Ảnh chính"
                getValueFromEvent={normFile}
                valuePropName="fileList"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={() => false}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
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
              <Form.Item
                name="primary_sort_order"
                label="Thứ tự ảnh chính"
                initialValue={1}
              >
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
                              name={[name, "image"]}
                              label="Ảnh phụ"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                            >
                              <Upload
                                listType="picture-card"
                                maxCount={1}
                                accept="image/*"
                                beforeUpload={() => false}
                                showUploadList={{
                                  showPreviewIcon: true,
                                  showRemoveIcon: true,
                                }}
                              >
                                <div>
                                  <UploadOutlined />
                                  <div style={{ marginTop: 8 }}>
                                    Tải ảnh phụ
                                  </div>
                                </div>
                              </Upload>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "alt_text"]}
                              label="Mô tả"
                            >
                              <Input placeholder="Mô tả ảnh phụ" />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...restField}
                              name={[name, "sort_order"]}
                              label="Thứ tự"
                              initialValue={key + 2}
                            >
                              <InputNumber min={2} className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button
                              danger
                              type="text"
                              onClick={() => remove(name)}
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
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
                  <Switch
                    checkedChildren="Có biến thể"
                    unCheckedChildren="Không biến thể"
                  />
                </Form.Item>
              }
            >
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
                                name={[name, "variant_name"]}
                                label="Tên biến thể"
                                rules={[
                                  {
                                    required: true,
                                    message: "Tên biến thể là bắt buộc",
                                  },
                                ]}
                              >
                                <Input placeholder="Tên biến thể (VD: 250g, 500g)" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "sku_code"]}
                                label="SKU Code"
                                rules={[
                                  {
                                    required: true,
                                    message: "SKU Code là bắt buộc",
                                  },
                                ]}
                              >
                                <Input placeholder="SKU Code" />
                              </Form.Item>
                            </Col>

                            {/* Attribute fields */}
                            {selectedAttributeTypes.map((attrName: string) => {
                              const attrGroup = (
                                attributeGroups as any
                              )?.attributes?.find(
                                (g: any) => g.attribute_name === attrName
                              );
                              return attrGroup ? (
                                <Col span={12} key={attrName}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, attrName]}
                                    label={attrName}
                                    rules={[
                                      {
                                        required: true,
                                        message: `Vui lòng chọn ${attrName}`,
                                      },
                                    ]}
                                  >
                                    <Select placeholder={`Chọn ${attrName}`}>
                                      {attrGroup.values.map((value: any) => (
                                        <Option key={value.id} value={value.id}>
                                          {value.value}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              ) : null;
                            })}

                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "price"]}
                                label="Giá"
                                rules={[
                                  {
                                    required: true,
                                    message: "Giá là bắt buộc",
                                  },
                                ]}
                              >
                                <InputNumber
                                  className="w-full"
                                  min={0}
                                  placeholder="Giá"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "stock_quantity"]}
                                label="Số lượng trong kho"
                                rules={[
                                  {
                                    required: true,
                                    message: "Số lượng là bắt buộc",
                                  },
                                ]}
                              >
                                <InputNumber
                                  className="w-full"
                                  min={0}
                                  placeholder="Số lượng trong kho"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, "image"]}
                                label="Ảnh biến thể"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                              >
                                <Upload
                                  listType="picture-card"
                                  accept="image/*"
                                  beforeUpload={() => false}
                                  maxCount={1}
                                  showUploadList={{
                                    showPreviewIcon: true,
                                    showRemoveIcon: true,
                                  }}
                                >
                                  <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>
                                      Tải ảnh lên
                                    </div>
                                  </div>
                                </Upload>
                              </Form.Item>
                            </Col>
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
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
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
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu!" },
                ]}
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
                rules={[{ required: true, message: "Vui lòng chọn xuất xứ!" }]}
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
                  {COFFEE_TYPES.map((type: string) => (
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
                  {ROAST_LEVELS.map((level: string) => (
                    <Option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Option>
                  ))}
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
                  <Option value="out_of_stock">Hết hàng</Option>
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
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
                block
              >
                Sửa Sản Phẩm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditProduct;
