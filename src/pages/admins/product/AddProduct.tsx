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
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useState, useEffect } from "react";
import { getAttributeCombinations } from "../../../services/productService";

import { createAdminProduct } from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import { getAllOrigins } from "../../../services/originService";

import type { IProductOrigin } from "../../../interfaces/product";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const COFFEE_TYPES = ["arabica", "robusta", "blend"];

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

// Removed PredefinedVariant interface - not needed

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
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("Bạn chỉ có thể tải lên file ảnh!");
  }
  return false;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const hasVariants = Form.useWatch("has_variants", form);

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

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createAdminProduct(formData),
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      // Lấy message tổng quát
      const message = error?.response?.data?.message || "Có lỗi xảy ra";

      // Lấy danh sách lỗi chi tiết
      const errors = error?.response?.data?.errors;

      if (errors) {
        // Duyệt qua từng lỗi và show toast
        Object.values(errors).forEach((errArr: any) => {
          if (Array.isArray(errArr)) {
            errArr.forEach((msg) => toast.error(msg));
          } else {
            toast.error(String(errArr));
          }
        });
      } else {
        toast.error(message);
      }
    },
  });

  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(true);
  // State để track thuộc tính được chọn cho biến thể
  const [selectedAttributeTypes, setSelectedAttributeTypes] = useState<
    string[]
  >([]);

  // Function để tạo SKU unique
  const generateUniqueSKU = (skuParts: string[], index: number) => {
    const timestamp = Date.now().toString().slice(-6); // Lấy 6 số cuối của timestamp
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${skuParts.join("-")}-${timestamp}-${randomNum}`;
  };

  // Function để tự động tạo tổ hợp variants từ thuộc tính đã chọn
  const generateVariantCombinations = () => {
    if (selectedAttributeTypes.length === 0) return [];

    const selectedGroups = attributeGroups.filter((group) =>
      selectedAttributeTypes.includes(group.attribute_name)
    );

    // Tạo cartesian product của các attribute values
    const combinations: any[] = [];

    function cartesianProduct(arrays: any[][], current: any[] = []) {
      if (current.length === arrays.length) {
        combinations.push([...current]);
        return;
      }

      const currentArray = arrays[current.length];
      for (const item of currentArray) {
        cartesianProduct(arrays, [...current, item]);
      }
    }

    const valueArrays = selectedGroups.map((group) => group.values);
    cartesianProduct(valueArrays);

    // Chuyển đổi thành format variant
    return combinations.map((combination, index) => {
      const variantName = combination.map((val) => val.value).join(" - ");
      const skuParts = combination.map((val) => {
        // Tạo SKU ngắn gọn
        if (val.value.includes("g")) return val.value.replace("g", "G");
        if (val.value.includes("Bean")) return "WB";
        if (val.value.includes("Ground")) return "GR";
        if (val.value.includes("Espresso")) return "ES";
        if (val.value.includes("French Press")) return "FP";
        if (val.value.includes("Pour Over")) return "PO";
        if (val.value.includes("Light")) return "LR";
        if (val.value.includes("Medium-Light")) return "ML";
        if (val.value.includes("Medium-Dark")) return "MD";
        if (val.value.includes("Medium")) return "MR";
        if (val.value.includes("Dark")) return "DR";
        if (val.value.includes("French")) return "FR";
        return val.value.substring(0, 2).toUpperCase();
      });

      return {
        variant_name: variantName,
        sku_code: generateUniqueSKU(skuParts, index),
        price: 150000, // Giá mặc định
        stock_quantity: 0,
        status: true,
        // Thêm attribute values cho form
        ...selectedGroups.reduce((acc, group, groupIndex) => {
          acc[group.attribute_name] = combination[groupIndex].id;
          return acc;
        }, {} as any),
      };
    });
  };

  // Removed predefined variants - now using dynamic generation

  useEffect(() => {
    getAttributeCombinations()
      .then((data) => {
        setAttributeGroups(data);
        setLoadingAttributes(false);
      })
      .catch(() => setLoadingAttributes(false));
  }, []);

  // Removed auto-generation logic - using manual Form.List instead

  const onFinish = async (values: Record<string, unknown>) => {
    const formData = new FormData();

    // Thêm các trường cơ bản vào FormData
    const basicFields = [
      "product_name",
      "description",
      "short_description",
      "coffee_type",
      "category_id",
      "brand_id",
      "origin_id",
      "roast_level",
      "flavor_profile",
      "strength_score",
      "meta_title",
      "meta_description",
      "status",
      "is_featured",
      "has_variants",
    ];

    basicFields.forEach((field) => {
      if (values[field] !== undefined && values[field] !== null) {
        if (typeof values[field] === "boolean") {
          formData.append(field, values[field] ? "1" : "0");
        } else {
          formData.append(field, String(values[field]));
        }
      }
    });

    // Xử lý base_price và stock_quantity
    if (!values.has_variants) {
      // Khi không có variants: gửi base_price và stock_quantity bình thường
      if (values.base_price) {
        formData.append("base_price", String(values.base_price));
      }
      if (values.stock_quantity) {
        formData.append("stock_quantity", String(values.stock_quantity));
      }
    }
    // Khi có variants: KHÔNG gửi base_price (để backend tự set null)

    // Xử lý ảnh chính và album ảnh phụ
    const images: {
      image_file: File;
      alt_text: string;
      is_primary: boolean;
    }[] = [];

    // Ảnh chính
    if (
      values.primary_image &&
      Array.isArray(values.primary_image) &&
      values.primary_image.length > 0
    ) {
      images.push({
        image_file: values.primary_image[0].originFileObj as File,
        alt_text: (values.primary_alt_text as string) || "Ảnh chính",
        is_primary: true,
      });
    }

    // Album ảnh phụ
    if (values.album_images && Array.isArray(values.album_images)) {
      (values.album_images as unknown[]).forEach((imgRaw) => {
        const img = imgRaw as {
          image: UploadFile[];
          alt_text?: string;
        };
        if (img.image && Array.isArray(img.image) && img.image.length > 0) {
          images.push({
            image_file: img.image[0].originFileObj as File,
            alt_text: img.alt_text || "Ảnh phụ",
            is_primary: false,
          });
        }
      });
    }

    // Đã xử lý tất cả dữ liệu ở trên, không cần loop Object.entries nữa

    // Xử lý variants nếu có
    if (
      values.has_variants &&
      values.variants &&
      Array.isArray(values.variants)
    ) {
      (values.variants as any[]).forEach((variant, idx) => {
        // Lấy attribute values từ các trường form
        const attrValues: number[] = [];
        attributeGroups.forEach((group) => {
          const attrValue = variant[group.attribute_name];
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

        // Thêm attribute_values
        attrValues.forEach((attrVal, attrIdx) => {
          formData.append(
            `variants[${idx}][attribute_values][${attrIdx}]`,
            String(attrVal)
          );
        });
      });
    }

    // Thêm ảnh chính và ảnh phụ vào FormData
    images.forEach((img, idx) => {
      formData.append(`images[${idx}][image_file]`, img.image_file);
      formData.append(`images[${idx}][alt_text]`, img.alt_text);
      formData.append(`images[${idx}][is_primary]`, img.is_primary ? "1" : "0");
    });

    // Thêm ảnh cho từng variant nếu có (đã xử lý trong loop trên)
    if (
      values.has_variants &&
      values.variants &&
      Array.isArray(values.variants)
    ) {
      (values.variants as any[]).forEach((variant, idx) => {
        if (
          variant.image &&
          Array.isArray(variant.image) &&
          variant.image.length > 0
        ) {
          formData.append(
            `variants[${idx}][image_file]`,
            variant.image[0].originFileObj as File
          );
        }
      });
    }

    // Log dữ liệu FormData gửi đi
    console.log("FormData entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    mutation.mutate(formData);
  };

  if (
    isLoadingCategories ||
    isLoadingBrands ||
    isLoadingOrigins ||
    loadingAttributes
  )
    return <Spin />;

  return (
    <div className="p-5">
      <h2 className="mb-4 text-2xl font-bold">Thêm Sản Phẩm</h2>
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
          strength_score: 5,
          variants: [],
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

              <Form.Item
                name="base_price"
                label="Giá cơ bản"
                rules={[
                  { required: true, message: "Vui lòng nhập giá cơ bản!" },
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
            </Card>

            {/* Hình ảnh sản phẩm */}
            <Card title="Hình ảnh sản phẩm" className="mb-4">
              {/* Ảnh chính */}
              <Form.Item
                name="primary_image"
                label="Ảnh chính"
                rules={[
                  { required: true, message: "Vui lòng chọn ảnh chính!" },
                ]}
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
                              rules={[
                                { required: true, message: "Chọn ảnh phụ!" },
                              ]}
                            >
                              <Upload
                                listType="picture-card"
                                maxCount={1}
                                accept="image/*"
                                beforeUpload={beforeUpload}
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
              {hasVariants ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 text-green-800">
                      <span className="text-lg">✨</span>
                      <span className="font-medium">
                        Tạo biến thể tùy chỉnh:
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Thêm từng biến thể một cách linh hoạt. Bạn có thể tự chọn
                      thuộc tính và nhập giá cho mỗi biến thể.
                    </p>
                  </div>

                  {/* Chọn thuộc tính cho biến thể */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium mb-3 text-purple-900">
                      🔧 Chọn thuộc tính làm biến thể:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {attributeGroups.map((group) => (
                        <label
                          key={group.attribute_name}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-purple-25 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 rounded"
                            checked={selectedAttributeTypes.includes(
                              group.attribute_name
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAttributeTypes([
                                  ...selectedAttributeTypes,
                                  group.attribute_name,
                                ]);
                              } else {
                                setSelectedAttributeTypes(
                                  selectedAttributeTypes.filter(
                                    (attr) => attr !== group.attribute_name
                                  )
                                );
                              }
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {group.attribute_name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {group.values.length} tùy chọn
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <div className="text-sm text-purple-800">
                        <span className="font-medium">💡 Mẹo:</span> Chọn thuộc
                        tính nào sẽ được sử dụng để tạo biến thể.
                        <br />
                        <span className="font-medium">⚠️ Lưu ý:</span> Sau khi
                        thêm biến thể, không thể bỏ chọn thuộc tính đã chọn.
                      </div>
                    </div>

                    {/* Nút tạo tổ hợp tự động */}
                    {selectedAttributeTypes.length >= 2 && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-800 mb-1">
                              🚀 Tạo tổ hợp tự động
                            </h4>
                            <p className="text-sm text-green-700">
                              Tạo tất cả{" "}
                              {selectedAttributeTypes.reduce(
                                (total, attrName) => {
                                  const group = attributeGroups.find(
                                    (g) => g.attribute_name === attrName
                                  );
                                  return total * (group?.values.length || 1);
                                },
                                1
                              )}{" "}
                              tổ hợp có thể từ{" "}
                              {selectedAttributeTypes.join(" + ")}
                            </p>
                          </div>
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                              const combinations =
                                generateVariantCombinations();
                              const currentVariants =
                                form.getFieldValue("variants") || [];
                              form.setFieldsValue({
                                variants: [...currentVariants, ...combinations],
                              });
                              message.success(
                                `Đã tạo ${combinations.length} biến thể tự động với SKU unique!`
                              );
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Tạo tổ hợp (
                            {selectedAttributeTypes.reduce(
                              (total, attrName) => {
                                const group = attributeGroups.find(
                                  (g) => g.attribute_name === attrName
                                );
                                return total * (group?.values.length || 1);
                              },
                              1
                            )}{" "}
                            biến thể)
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form List để thêm variants */}
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
                                  <Input placeholder="VD: 250g - Ground - Medium Roast" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "sku_code"]}
                                  label="Mã SKU"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Mã SKU là bắt buộc",
                                    },
                                  ]}
                                >
                                  <Input placeholder="VD: ARA-250G-GR-MR" />
                                </Form.Item>
                              </Col>

                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "price"]}
                                  label="Giá (VNĐ)"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Giá là bắt buộc",
                                    },
                                    {
                                      type: "number",
                                      min: 1000,
                                      message: "Giá phải lớn hơn 1,000 VNĐ",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    className="w-full"
                                    min={0}
                                    placeholder="Nhập giá..."
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "stock_quantity"]}
                                  label="Số lượng tồn kho"
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
                                    placeholder="Số lượng..."
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "status"]}
                                  label="Trạng thái"
                                  valuePropName="checked"
                                  initialValue={true}
                                >
                                  <Switch
                                    checkedChildren="Đang bán"
                                    unCheckedChildren="Ngừng bán"
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "image"]}
                                  label="Ảnh biến thể (tùy chọn)"
                                  valuePropName="fileList"
                                  getValueFromEvent={normFile}
                                >
                                  <Upload
                                    listType="picture-card"
                                    accept="image/*"
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
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

                              {/* Thuộc tính sản phẩm - chỉ hiển thị thuộc tính đã chọn */}
                              {selectedAttributeTypes.length > 0 && (
                                <Col span={24}>
                                  <h5 className="font-medium mb-3 text-gray-900">
                                    Chọn thuộc tính cho biến thể này:
                                  </h5>
                                  <Row gutter={16}>
                                    {attributeGroups
                                      .filter((group) =>
                                        selectedAttributeTypes.includes(
                                          group.attribute_name
                                        )
                                      )
                                      .map((group) => (
                                        <Col
                                          span={8}
                                          key={group.attribute_name}
                                        >
                                          <Form.Item
                                            {...restField}
                                            name={[name, group.attribute_name]}
                                            label={group.attribute_name}
                                            rules={[
                                              {
                                                required: true,
                                                message: `Chọn ${group.attribute_name.toLowerCase()}!`,
                                              },
                                            ]}
                                          >
                                            <Select
                                              placeholder={`Chọn ${group.attribute_name.toLowerCase()}`}
                                            >
                                              {group.values.map((opt) => (
                                                <Option
                                                  key={opt.id}
                                                  value={opt.id}
                                                >
                                                  {opt.value}
                                                </Option>
                                              ))}
                                            </Select>
                                          </Form.Item>
                                        </Col>
                                      ))}
                                  </Row>
                                </Col>
                              )}

                              {selectedAttributeTypes.length === 0 && (
                                <Col span={24}>
                                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="text-sm text-orange-800">
                                      <span className="font-medium">
                                        ⚠️ Lưu ý:
                                      </span>{" "}
                                      Vui lòng chọn ít nhất 1 thuộc tính ở phần
                                      "Chọn thuộc tính làm biến thể" bên trên để
                                      có thể cấu hình biến thể này.
                                    </div>
                                  </div>
                                </Col>
                              )}
                            </Row>

                            <Button
                              type="text"
                              danger
                              onClick={() => remove(name)}
                              icon={<MinusCircleOutlined />}
                              className="absolute top-2 right-2"
                            >
                              Xóa biến thể
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
                            Thêm biến thể mới
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      Sản phẩm này sẽ không có biến thể. Vui lòng nhập số lượng
                      tồn kho.
                    </p>
                  </div>

                  <Form.Item
                    name="stock_quantity"
                    label="Số lượng tồn kho"
                    rules={[
                      {
                        required: !hasVariants,
                        message: "Vui lòng nhập số lượng tồn kho!",
                      },
                      {
                        type: "number",
                        min: 0,
                        message: "Số lượng phải lớn hơn hoặc bằng 0!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      min={0}
                      placeholder="Nhập số lượng tồn kho"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </div>
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
                rules={[{ required: true , message:'Vui lòng nhập loại cà phê' }]}
              >
                <Select placeholder="Chọn loại cà phê">
                  {COFFEE_TYPES.map((type) => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="roast_level"
                label="Mức độ rang"
                rules={[{ required: true , message:'Vui lòng chọn mức độ rang'}]}
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
                rules={[{ required: true,message:'Vui lòng nhập hương vị' }]}
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
                rules={[{ required: true ,message:'Vui lòng nhập SEO & Trạng Thái'}]}
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
