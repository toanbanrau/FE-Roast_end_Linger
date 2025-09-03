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
  Modal,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  getAdminProductDetail,
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
import { toast } from "react-toastify";

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

  // Track deleted image IDs
  const deletedImageIdsRef = useRef<number[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  // Track which images are being replaced (for album images)
  const [replacedImageIds, setReplacedImageIds] = useState<Set<number>>(
    new Set()
  );

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
    // Handle image removal via
      // global click listener
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if this is a Form.List remove button
      if (target.textContent?.includes("Xóa")) {
        try {
          const card = target.closest(".ant-card");
          if (card) {
            const currentValues = form.getFieldsValue();
            const albumImages = currentValues.album_images || [];
            const allCards = Array.from(document.querySelectorAll(".ant-card"));
            const cardIndex = allCards.indexOf(card);

            if (cardIndex >= 0 && albumImages[cardIndex]) {
              const imageData = albumImages[cardIndex];

              if (
                imageData?.image?.[0]?.uid &&
                !isNaN(Number(imageData.image[0].uid))
              ) {
                const imageId = Number(imageData.image[0].uid);

                if (!deletedImageIdsRef.current.includes(imageId)) {
                  deletedImageIdsRef.current.push(imageId);
                  setDeletedImageIds([...deletedImageIdsRef.current]);
                  message.success("Ảnh phụ sẽ được xóa khi lưu sản phẩm");
                }
              }
            }
          }
        } catch (error) {
          console.error("Error in remove handler:", error);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    if (product) {
      // Reset tracking arrays when product changes
      deletedImageIdsRef.current = [];
      setReplacedImageIds(new Set());

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
          .map((img) => ({
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
                // Map attributes to their respective form fields
                ...(variant.attributes || []).reduce((acc: any, attr: any) => {
                  acc[attr.attribute_name] = attr.id; // The API returns the attribute_value_id directly as 'id'
                  return acc;
                }, {}),
                // Xử lý ảnh variant
                image: variant.image
                  ? [
                      {
                        uid: variant.id.toString(),
                        name: `variant-${variant.id}`,
                        status: "done" as const,
                        url: variant.image,
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
          (variant.attributes || []).forEach((attr: any) => {
            attributeNames.add(attr.attribute_name);
          });
        });
        setSelectedAttributeTypes(Array.from(attributeNames));
      }
    }
  }, [product, form, attributeGroups]);

  // Handle image removal
  const handleImageRemove = (
    file: UploadFile,
    imageType: "primary" | "album" | "variant"
  ) => {
    // Check if this is an existing image (numeric uid)
    if (file.uid && !isNaN(Number(file.uid))) {
      const imageId = Number(file.uid);

      // Add to deleted list if not already there
      if (!deletedImageIdsRef.current.includes(imageId)) {
        deletedImageIdsRef.current.push(imageId);
        message.success(
          `Ảnh ${
            imageType === "primary" ? "chính" : "phụ"
          } sẽ được xóa khi lưu sản phẩm`
        );
      }
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateAdminProduct(Number(id), formData),
    onSuccess: (data) => {
      console.log("=== UPDATE SUCCESS RESPONSE ===", data);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      // Reset tracking arrays
      deletedImageIdsRef.current = [];
      setReplacedImageIds(new Set());
    },
    onError: (err: any) => {
      console.error("=== UPDATE ERROR ===", err);
      let errorMessage = "Có lỗi xảy ra";

      if (err?.response?.data?.errors) {
        // Validation errors (422)
        const errors = err.response.data.errors;
        const errorList = Object.entries(errors).map(
          ([field, messages]: [string, any]) =>
            `${field}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }`
        );
        errorMessage = `Validation errors:\n${errorList.join("\n")}`;
        console.error("Validation errors:", errors);
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      message.error("Lỗi cập nhật: " + errorMessage);
    },
  });

  const onFinish = async (values: any) => {
    // Validation
    if (!values.product_name) {
      message.error("Tên sản phẩm là bắt buộc!");
      return;
    }
    if (!values.category_id) {
      message.error("Danh mục là bắt buộc!");
      return;
    }
    if (
      values.has_variants &&
      (!values.variants || values.variants.length === 0)
    ) {
      message.error("Cần có ít nhất 1 variant khi bật has_variants!");
      return;
    }

    // Validation cho variants
    if (
      values.has_variants &&
      values.variants &&
      Array.isArray(values.variants)
    ) {
      for (let i = 0; i < values.variants.length; i++) {
        const variant = values.variants[i];

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

        const hasAllAttributes = selectedAttributeTypes.every(
          (attrName) => variant[attrName] && variant[attrName] !== ""
        );
        if (!hasAllAttributes) {
          message.error(`Variant ${i + 1}: Cần chọn đầy đủ thuộc tính!`);
          return;
        }
      }
    }

    const formData = new FormData();

    // 1. THÔNG TIN SẢN PHẨM CƠ BẢN
    formData.append("product_name", String(values.product_name || ""));
    formData.append("description", String(values.description || ""));
    formData.append(
      "short_description",
      String(values.short_description || "")
    );
    formData.append("category_id", String(values.category_id || ""));
    formData.append("brand_id", String(values.brand_id || ""));
    formData.append("origin_id", String(values.origin_id || ""));
    formData.append("coffee_type", String(values.coffee_type || ""));
    formData.append("roast_level", String(values.roast_level || ""));
    formData.append("flavor_profile", String(values.flavor_profile || ""));
    formData.append("strength_score", String(values.strength_score || ""));
    formData.append("meta_title", String(values.meta_title || ""));
    formData.append("meta_description", String(values.meta_description || ""));
    formData.append("has_variants", values.has_variants ? "1" : "0");
    formData.append("status", String(values.status || "active"));
    formData.append("is_featured", values.is_featured ? "1" : "0");

    if (!values.has_variants) {
      formData.append("base_price", String(values.base_price || "0"));
      formData.append("stock_quantity", String(values.stock_quantity || "0"));
    }

    // 2. XỬ LÝ VARIANTS
    if (
      values.has_variants &&
      values.variants &&
      Array.isArray(values.variants) &&
      values.variants.length > 0
    ) {

      values.variants.forEach((variant: any, idx: number) => {
        console.log(`Variant ${idx}:`, {
          id: variant.id,
          variant_name: variant.variant_name,
          sku_code: variant.sku_code,
          action: variant.id ? "UPDATE" : "CREATE",
        });

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

        // Attribute values
        const attributeValues: string[] = [];
        selectedAttributeTypes.forEach((attrName) => {
          const attrValue = variant[attrName];
          if (attrValue) {
            attributeValues.push(String(attrValue));
          }
        });

        attributeValues.forEach((value, attrIdx) => {
          formData.append(
            `variants[${idx}][attribute_values][${attrIdx}]`,
            value
          );
        });

        // Xử lý ảnh variant nếu có
        if (
          variant.image &&
          Array.isArray(variant.image) &&
          variant.image.length > 0 &&
          variant.image[0].originFileObj
        ) {
          formData.append(
            `variants[${idx}][image_url]`,
            variant.image[0].originFileObj
          );
        }
      });
    }

    // 3. XỬ LÝ ẢNH THEO FORMAT API MỚI (docs/product_edit_api_guide.md v2.0)

    // Prepare images object for new API format
    const imagesData: any = {};

    // 3.1. Images to DELETE
    const finalDeletedIds =
      deletedImageIds.length > 0 ? deletedImageIds : deletedImageIdsRef.current;
    if (finalDeletedIds.length > 0) {
      imagesData.delete = finalDeletedIds;
    }

    // Check if uploading new primary image (needed for update logic)
    const hasNewPrimaryUpload = !!(
      values.primary_image &&
      Array.isArray(values.primary_image) &&
      values.primary_image.length > 0 &&
      values.primary_image[0].originFileObj
    );

    // 3.2. Images to KEEP (existing images not being deleted)
    const imagesToKeep: number[] = [];
    const imagesToUpdate: any[] = [];

    // BACKUP: Always check for deleted images by comparing form vs original
    if (product?.images) {
      const currentAlbumImages = values.album_images || [];
      const originalImageIds = product.images
        .filter((img) => !img.is_primary)
        .map((img) => img.id);
      const currentImageIds = currentAlbumImages
        .filter(
          (albumImg: any) =>
            albumImg.image?.[0]?.uid && !isNaN(Number(albumImg.image[0].uid))
        )
        .map((albumImg: any) => Number(albumImg.image[0].uid));

      const deletedIds = originalImageIds.filter(
        (id) => !currentImageIds.includes(id)
      );

      if (deletedIds.length > 0) {
        imagesData.delete = deletedIds; // Use detected deleted IDs
      } else if (finalDeletedIds.length > 0) {
        // finalDeletedIds already set in imagesData.delete above
      }
    }

    if (product?.images) {
      // Use the actual deleted IDs (either from tracking or backup detection)
      const actualDeletedIds = imagesData.delete || [];

      product.images.forEach((img) => {
        // Skip deleted images
        if (!actualDeletedIds.includes(img.id)) {
          // Check if this is old primary image and we're uploading new primary
          if (img.is_primary && hasNewPrimaryUpload) {
            // DELETE old primary image completely
            if (!imagesData.delete) imagesData.delete = [];
            if (!imagesData.delete.includes(img.id)) {
              imagesData.delete.push(img.id);
            }
            return; // Skip adding to keep/update lists
          }

          imagesToKeep.push(img.id);

          // Check if we need to update metadata (alt_text, sort_order)
          let needsUpdate = false;
          let newAltText = img.alt_text;
          let newSortOrder = img.sort_order;

          if (img.is_primary) {
            // Primary image updates (only if not uploading new primary)
            if (
              values.primary_alt_text &&
              values.primary_alt_text !== img.alt_text
            ) {
              needsUpdate = true;
              newAltText = values.primary_alt_text;
            }
            if (
              values.primary_sort_order &&
              values.primary_sort_order !== img.sort_order
            ) {
              needsUpdate = true;
              newSortOrder = values.primary_sort_order;
            }
          } else {
            // Album image updates - check form values
            if (values.album_images && Array.isArray(values.album_images)) {
              const albumImage = values.album_images.find(
                (albumImg: any) =>
                  albumImg.image &&
                  albumImg.image[0] &&
                  albumImg.image[0].uid === img.id.toString()
              );

              if (albumImage) {
                if (
                  albumImage.alt_text &&
                  albumImage.alt_text !== img.alt_text
                ) {
                  needsUpdate = true;
                  newAltText = albumImage.alt_text;
                }
                if (
                  albumImage.sort_order &&
                  albumImage.sort_order !== img.sort_order
                ) {
                  needsUpdate = true;
                  newSortOrder = albumImage.sort_order;
                }
              }
            }
          }

          if (needsUpdate) {
            const updateData: any = {
              id: img.id,
              alt_text: newAltText,
              sort_order: newSortOrder,
            };

            imagesToUpdate.push(updateData);
          }
        }
      });
    }

    if (imagesToKeep.length > 0) {
      imagesData.keep = imagesToKeep;
    }

    if (imagesToUpdate.length > 0) {
      imagesData.update = imagesToUpdate;
    }

    // 3.3. NEW images to upload
    const newImages: any[] = [];

    // New primary image
    if (hasNewPrimaryUpload) {
      const primaryImageFile = values.primary_image[0].originFileObj;
      const primaryAltText = values.primary_alt_text || "Ảnh chính";

      newImages.push({
        image_file: primaryImageFile,
        alt_text: primaryAltText,
        is_primary: true,
      });
    }

    // New album images
    if (values.album_images && Array.isArray(values.album_images)) {
      values.album_images.forEach((img: any, index: number) => {
        if (
          img.image &&
          Array.isArray(img.image) &&
          img.image.length > 0 &&
          img.image[0].originFileObj
        ) {
          const albumImageFile = img.image[0].originFileObj;
          const albumAltText = img.alt_text || `Ảnh phụ ${index + 1}`;

          newImages.push({
            image_file: albumImageFile,
            alt_text: albumAltText,
            is_primary: false,
          });
        }
      });
    }

    if (newImages.length > 0) {
      imagesData.new = newImages;
    }

    // 4. ADD IMAGES DATA TO FORMDATA (New API Format)
    if (Object.keys(imagesData).length > 0) {
      // Convert images object to FormData format
      if (imagesData.delete && imagesData.delete.length > 0) {
        imagesData.delete.forEach((imageId: number, index: number) => {
          formData.append(`images[delete][${index}]`, String(imageId));
        });
      }

      if (imagesData.keep && imagesData.keep.length > 0) {
        imagesData.keep.forEach((imageId: number, index: number) => {
          formData.append(`images[keep][${index}]`, String(imageId));
        });
      }

      if (imagesData.update) {
        imagesData.update.forEach((img: any, index: number) => {
          formData.append(`images[update][${index}][id]`, String(img.id));
          formData.append(
            `images[update][${index}][alt_text]`,
            img.alt_text || ""
          );
          if (img.sort_order) {
            formData.append(
              `images[update][${index}][sort_order]`,
              String(img.sort_order)
            );
          }
          if (img.hasOwnProperty("is_primary")) {
            formData.append(
              `images[update][${index}][is_primary]`,
              img.is_primary ? "1" : "0"
            );
          }
        });
      }

      if (imagesData.new) {
        imagesData.new.forEach((img: any, index: number) => {
          formData.append(`images[new][${index}][image_file]`, img.image_file);
          formData.append(
            `images[new][${index}][alt_text]`,
            img.alt_text || ""
          );
          formData.append(
            `images[new][${index}][is_primary]`,
            img.is_primary ? "1" : "0"
          );
        });
      }
    }

    // Submit
    mutation.mutate(formData);
  };

  const normFile = (e: any) => {
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
      <h2 className="mb-4 text-2xl font-bold">Sửa Sản Phẩm</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        encType="multipart/form-data"

        initialValues={{
          has_variants: false,
          is_featured: false,
          status: "active",
          variants: [{}],
          strength_score: 5,
        }}
      >
        <Row gutter={24}>
          <Col span={17}>
            {/* Cột chính */}
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
                <Row gutter={16}>
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
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
                  </Col>
                </Row>
              )}
            </Card>

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
                  onRemove={(file) => {
                    if (file.uid && !isNaN(Number(file.uid))) {
                      const imageId = Number(file.uid);
                      if (!deletedImageIdsRef.current.includes(imageId)) {
                        deletedImageIdsRef.current.push(imageId);
                        message.success(
                          "Ảnh chính sẽ được xóa khi lưu sản phẩm"
                        );
                      }
                    }
                    return false;
                  }}
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
                                onRemove={(file) => {
                                  if (file.uid && !isNaN(Number(file.uid))) {
                                    const imageId = Number(file.uid);
                                    if (!deletedImageIdsRef.current.includes(imageId)) {
                                      deletedImageIdsRef.current.push(imageId);
                                      message.success(
                                        "Ảnh phụ sẽ được xóa khi lưu sản phẩm"
                                      );
                                    }
                                  }
                                  return false;
                                }}
                                showUploadList={{
                                  showPreviewIcon: true,
                                  showRemoveIcon: true,
                                }}
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
                              name={[name, "alt_text"]}
                              label="Mô tả"
                            >
                              <Input placeholder="Mô tả ảnh phụ" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "sort_order"]}
                              label="Thứ tự"
                              initialValue={key + 2}
                            >
                              <InputNumber min={2} className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Button
                              danger
                              type="text"
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
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

            <Card
              title="Biến thể sản phẩm"
              className="mb-4"
              extra={
                <div className="flex items-center gap-4">
                  {hasVariants && (
                    <div className="text-sm text-gray-500">
                      {form.getFieldValue("variants")?.length || 0} variants
                      {form.getFieldValue("variants")?.length > 0 && (
                        <span className="ml-2">
                          (
                          <span className="text-green-600">
                            {form
                              .getFieldValue("variants")
                              ?.filter((v: any) => v?.status !== false)
                              ?.length || 0}{" "}
                            hoạt động
                          </span>
                          )
                        </span>
                      )}
                    </div>
                  )}
                  <Form.Item
                    name="has_variants"
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch
                      checkedChildren="Có biến thể"
                      unCheckedChildren="Không biến thể"
                    />
                  </Form.Item>
                </div>
              }
            >
              {hasVariants && (
                <>
                {/* Phần chọn thuộc tính làm biến thể đã được ẩn */}

                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => {
                        const currentVariant = form.getFieldValue(["variants", name]);
                        const isExistingVariant = currentVariant?.id;

                        return (
                          <Card key={key} className="mb-4" size="small">
                            <Row gutter={24}>
                              {/* Cột Ảnh */}
                              <Col span={8}>
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
                                    onRemove={(file) => {
                                      handleImageRemove(file, "variant");
                                      return false;
                                    }}
                                    showUploadList={{
                                      showPreviewIcon: true,
                                      showRemoveIcon: true,
                                    }}
                                  >
                                    <div>
                                      <UploadOutlined />
                                      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                  </Upload>
                                </Form.Item>
                              </Col>

                              {/* Cột Thông Tin */}
                              <Col span={16}>
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "variant_name"]}
                                      label="Tên biến thể"
                                      rules={[{ required: true, message: "Tên biến thể là bắt buộc" }]}
                                    >
                                      <Input placeholder="Tên biến thể (VD: 250g, 500g)" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "sku_code"]}
                                      label="SKU Code"
                                      rules={[{ required: true, message: "SKU Code là bắt buộc" }]}
                                    >
                                      <Input placeholder="SKU Code" />
                                    </Form.Item>
                                  </Col>

                                  {/* Attribute fields */}
                                  {selectedAttributeTypes.map((attrName: string) => {
                                    const attrGroups = attributeGroups as any;
                                    const attributes = attrGroups?.attributes;
                                    const attrGroup = attributes?.find(
                                      (g: any) => g.attribute_name === attrName
                                    );

                                    if (!attrGroup || !attrGroup.values) return null;

                                    return (
                                      <Col span={12} key={attrName}>
                                        <Form.Item
                                          {...restField}
                                          name={[name, attrName]}
                                          label={attrName}
                                          rules={[{ required: true, message: `Vui lòng chọn ${attrName}` }]}
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
                                    );
                                  })}

                                  <Col span={12}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "price"]}
                                      label="Giá"
                                      rules={[{ required: true, message: "Giá là bắt buộc" }]}
                                    >
                                      <InputNumber
                                        className="w-full"
                                        min={0}
                                        placeholder="Giá"
                                        formatter={(value) =>
                                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "stock_quantity"]}
                                      label="Số lượng trong kho"
                                      rules={[{ required: true, message: "Số lượng là bắt buộc" }]}
                                    >
                                      <InputNumber
                                        className="w-full"
                                        min={0}
                                        placeholder="Số lượng trong kho"
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            {/* Status và Actions Row */}
                            <Row gutter={16} className="mt-4">
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "status"]}
                                  label="Trạng thái variant"
                                  valuePropName="checked"
                                  tooltip="Bật/tắt variant này. Variant bị tắt sẽ không hiển thị trên website"
                                >
                                  <Switch
                                    checkedChildren="Hoạt động"
                                    unCheckedChildren="Tạm dừng"
                                    defaultChecked={true}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <div className="text-right pt-6">
                                  {isExistingVariant && (
                                    <div className="text-xs text-gray-500 mb-2">
                                      ID: {currentVariant.id}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {isExistingVariant
                                      ? "Variant hiện có"
                                      : "Variant mới"}
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            {/* <Button
                              type="text"
                              danger
                              onClick={() => {
                                remove(name);
                              }}
                              icon={<MinusCircleOutlined />}
                              className="absolute top-2 right-2"
                            >
                              Xóa
                            </Button> */}
                          </Card>
                        );
                      })}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add({ status: true, stock_quantity: 0, price: 0 })}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm biến thể
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                </>
              )}
            </Card>
          </Col>

          <Col span={7}>
            {/* Cột phụ */}
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

            <Card title="Thông tin cà phê" className="mb-4">
              <Form.Item
                name="coffee_type"
                label="Loại cà phê"
                rules={[{ required: true ,message:"Vui lòng chọn loại cà phê"}]}
              >
                <Select placeholder="Chọn loại cà phê">
                  {COFFEE_TYPES.map((type: string) => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* <Form.Item
                name="roast_level"
                label="Mức độ rang"
                rules={[{ required: true ,message:'Vui lòng chọn mức độ rang'}]}
              >
                <Select placeholder="Chọn mức độ rang">
                  {ROAST_LEVELS.map((level: string) => (
                    <Option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              <Form.Item
                name="flavor_profile"
                label="Hương vị"
                rules={[{ required: true , message:"Hương vị không được bỏ trống"}]}
              >
                <Input placeholder="VD: Hương vị đậm đà, hậu vị ngọt" />
              </Form.Item>

              <Form.Item
                name="strength_score"
                label="Điểm đánh giá độ mạnh"
                rules={[{ required: true ,message:'Vui lòng nhập điểm đánh giá'}]}
              >
                <InputNumber min={1} max={10} step={0.1} className="w-full" />
              </Form.Item>
            </Card>

            <Card title="SEO & Trạng thái" className="mb-4">
              <Form.Item
                name="meta_title"
                label="Meta Title"
                rules={[{ required: true ,message:'Vui lòng nhập meta title' }]}
              >
                <Input placeholder="Tiêu đề SEO" />
              </Form.Item>

              <Form.Item
                name="meta_description"
                label="Meta Description"
                rules={[{ required: true , message:'Vui lòng nhập tiêu đề SEO' }]}
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
