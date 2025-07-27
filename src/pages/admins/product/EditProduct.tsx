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
  getAdminProductDetail,
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
    queryFn: () => getAdminProductDetail(Number(id)),
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
                image: variant.image
                  ? [
                      {
                        uid: variant.id.toString(),
                        name: `variant-${variant.id}`,
                        status: "done" as const,
                        url: variant.image, // ← Đổi từ variant.image_url sang variant.image
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
    onSuccess: (data) => {
      console.log("=== UPDATE SUCCESS RESPONSE ===", data);
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err: any) => {
      console.error("=== UPDATE ERROR ===", err);
      const errorMessage =
        err?.response?.data?.message || err.message || "Có lỗi xảy ra";
      message.error("Lỗi cập nhật: " + errorMessage);
    },
  });

  const onFinish = async (values: unknown) => {
    const v = values as Record<string, unknown>;

    // Validation trước khi submit
    if (!v.product_name) {
      message.error("Tên sản phẩm là bắt buộc!");
      return;
    }
    if (!v.category_id) {
      message.error("Danh mục là bắt buộc!");
      return;
    }
    if (v.has_variants && (!v.variants || (v.variants as any[]).length === 0)) {
      message.error("Cần có ít nhất 1 variant khi bật has_variants!");
      return;
    }

    // Validation cho variants khi edit
    if (v.has_variants && v.variants && Array.isArray(v.variants)) {
      const variants = v.variants as any[];
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        // Kiểm tra các field bắt buộc
        if (!variant.variant_name?.trim()) {
          message.error(`Variant ${i + 1}: Tên variant là bắt buộc!`);
          return;
        }
        if (!variant.sku_code?.trim()) {
          message.error(`Variant ${i + 1}: SKU code là bắt buộc!`);
          return;
        }
        if (!variant.price || variant.price <= 0) {
          message.error(`Variant ${i + 1}: Giá phải lớn hơn 0!`);
          return;
        }

        // Kiểm tra attribute values
        const hasAllAttributes = selectedAttributeTypes.every(
          (attrName) => variant[attrName] && variant[attrName] !== ""
        );
        if (!hasAllAttributes) {
          message.error(`Variant ${i + 1}: Cần chọn đầy đủ thuộc tính!`);
          return;
        }
      }
    }

    console.log("=== FORM VALUES ===", v); // Debug form values

    const formData = new FormData();

    // Thêm các trường bắt buộc - KHÔNG bỏ qua nếu undefined
    formData.append("product_name", String(v.product_name || ""));
    formData.append("description", String(v.description || ""));
    formData.append("short_description", String(v.short_description || ""));
    formData.append("category_id", String(v.category_id || ""));
    formData.append("brand_id", String(v.brand_id || ""));
    formData.append("origin_id", String(v.origin_id || ""));
    formData.append("coffee_type", String(v.coffee_type || ""));
    formData.append("roast_level", String(v.roast_level || ""));
    formData.append("flavor_profile", String(v.flavor_profile || ""));
    formData.append("strength_score", String(v.strength_score || ""));
    formData.append("meta_title", String(v.meta_title || ""));
    formData.append("meta_description", String(v.meta_description || ""));
    formData.append("has_variants", v.has_variants ? "1" : "0");
    formData.append("status", String(v.status || "active"));
    formData.append("is_featured", v.is_featured ? "1" : "0");

    // Xử lý base_price và stock_quantity cho sản phẩm không có variants
    if (!v.has_variants) {
      formData.append("base_price", String(v.base_price || "0"));
      formData.append("stock_quantity", String(v.stock_quantity || "0"));
    }

    // ===== XỬ LÝ VARIANTS =====
    if (
      v.has_variants &&
      v.variants &&
      Array.isArray(v.variants) &&
      v.variants.length > 0
    ) {
      console.log("=== PROCESSING VARIANTS FOR EDIT ===");

      (v.variants as any[]).forEach((variant, idx) => {
        console.log(`Variant ${idx}:`, {
          id: variant.id,
          variant_name: variant.variant_name,
          sku_code: variant.sku_code,
          hasId: !!variant.id,
          action: variant.id ? "UPDATE" : "CREATE",
        });

        // ⭐ QUAN TRỌNG: Gửi ID để backend biết UPDATE hay CREATE
        // Theo API docs: Nếu có ID → UPDATE existing, không có ID → CREATE new
        if (variant.id) {
          formData.append(`variants[${idx}][id]`, String(variant.id));
        }

        formData.append(
          `variants[${idx}][variant_name]`,
          String(variant.variant_name || "")
        );
        formData.append(
          `variants[${idx}][sku_code]`,
          String(variant.sku_code || "")
        );
        formData.append(
          `variants[${idx}][price]`,
          String(variant.price || "0")
        );
        formData.append(
          `variants[${idx}][stock_quantity]`,
          String(variant.stock_quantity || "0")
        );
        formData.append(`variants[${idx}][status]`, variant.status ? "1" : "0");

        // Attribute values - cần gửi dưới dạng array theo API format
        const attributeValues: string[] = [];
        selectedAttributeTypes.forEach((attrName) => {
          const attrValue = variant[attrName];
          if (attrValue) {
            attributeValues.push(String(attrValue));
          }
        });

        // Gửi attribute_values dưới dạng array
        attributeValues.forEach((value, attrIdx) => {
          formData.append(
            `variants[${idx}][attribute_values][${attrIdx}]`,
            value
          );
        });
      });
    }

    // ===== XỬ LÝ ẢNH =====
    const processedImages: {
      image_file: File;
      alt_text: string;
      is_primary: boolean;
    }[] = [];

    let hasPrimaryImage = false;

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
      hasPrimaryImage = true;
    }

    // Thêm album ảnh phụ nếu có file mới
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

    // Thêm ảnh vào FormData
    processedImages.forEach((img, idx) => {
      formData.append(`images[${idx}][image_file]`, img.image_file);
      formData.append(`images[${idx}][alt_text]`, img.alt_text);
      formData.append(`images[${idx}][is_primary]`, img.is_primary ? "1" : "0");
    });

    // Nếu không có ảnh mới nào, thêm flag để backend giữ ảnh cũ
    if (processedImages.length === 0) {
      formData.append("keep_existing_images", "1");
    }

    // Thêm flag để backend biết đây là edit
    formData.append("is_edit", "1");

    // Debug FormData
    console.log("=== FORMDATA ENTRIES ===");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    // Thêm debug log để kiểm tra
    console.log("=== SENDING REQUEST TO API ===");
    console.log("Endpoint:", `/products/${id}/with-variants`);
    console.log("Method:", "POST"); // Backend yêu cầu POST thay vì PUT
    console.log("FormData size:", [...formData.entries()].length, "entries");

    // Thêm timeout để đảm bảo console log hiển thị trước khi gửi request
    setTimeout(() => {
      mutation.mutate(formData);
    }, 100);
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
                              return attrGroup?.values ? (
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
