import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductBySlug } from "../../../services/productService";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";
import { toast } from "react-toastify";
import type { IProduct } from "../../../interfaces/product";
import { useState, useMemo, useEffect } from "react";
import type { IAddProductToCartPayload } from "../../../interfaces/cart";
import { ChevronRight, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import {
  getProductStatusDisplay,
  isProductAvailable,
} from "../../../utils/productStatus";
import type {
  IProductVariant,
  IProductImage,
} from "../../../interfaces/product";
import ProductDetailSkeleton from "../../../components/ProductDetailSkeleton";
import ProductReviews from "../../../components/ProductReviews";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();
  const isLoggedIn = useUserStore((state) => !!state.user);
  const { addToCart } = useCartStore();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<IProduct | undefined>({
    queryKey: ["product-detail", slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
    retry: (failureCount, error) => {
      // Retry tối đa 2 lần, trừ khi là 404 (không tìm thấy)
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        return false; // Không retry nếu 404
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  type VariantWithAttributes = IProductVariant & {
    attributes?: { id: number; attribute_name: string; value: string }[];
  };
  const [selectedVariant, setSelectedVariant] =
    useState<VariantWithAttributes | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: number;
  }>({});

  const variants: VariantWithAttributes[] = useMemo(() => {
    return (
      (product &&
        (product as { variants?: VariantWithAttributes[] }).variants) ||
      []
    );
  }, [product]);
  const attributeGroups = useMemo(() => {
    if (!variants || variants.length === 0) return [];
    const groups: { name: string; values: { id: number; value: string }[] }[] =
      [];
    variants.forEach((variant: VariantWithAttributes) => {
      if (variant.attributes) {
        variant.attributes.forEach((attr) => {
          let group = groups.find((g) => g.name === attr.attribute_name);
          if (!group) {
            group = { name: attr.attribute_name, values: [] };
            groups.push(group);
          }
          if (!group.values.find((v) => v.id === attr.id)) {
            group.values.push({ id: attr.id, value: attr.value });
          }
        });
      }
    });
    return groups;
  }, [variants]);

  const handleSelectAttribute = (groupName: string, valueId: number) => {
    const newSelected = { ...selectedAttributes, [groupName]: valueId };
    setSelectedAttributes(newSelected);
    // Tìm variant phù hợp
    if (variants) {
      const found = variants.find((variant) => {
        if (!variant.attributes) return false;
        return attributeGroups.every((group) => {
          const attr = variant.attributes!.find(
            (a) => a.attribute_name === group.name
          );
          return attr && newSelected[group.name] === attr.id;
        });
      });
      setSelectedVariant(found || null);
    }
  };

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
      // Set selectedAttributes mặc định
      const defaultAttrs: { [key: string]: number } = {};
      variants[0].attributes?.forEach((attr) => {
        defaultAttrs[attr.attribute_name] = attr.id;
      });
      setSelectedAttributes(defaultAttrs);
    }
  }, [variants, selectedVariant]);

  // Chuẩn bị mảng album không lặp ảnh chính
  const albumImages: IProductImage[] = useMemo(() => {
    if (!product) return [];
    const allImages = (product.images || []) as IProductImage[];
    // Loại bỏ ảnh chính nếu bị lặp trong images
    return allImages.filter(
      (img) => img.image_url !== product.primary_image?.image_url
    );
  }, [product]);

  // Mảng ảnh hiển thị: chỉ gồm ảnh chính và album (không bao gồm ảnh variant)
  const displayImages: { url: string; type: string }[] = useMemo(() => {
    const arr: { url: string; type: string }[] = [];

    // Luôn thêm ảnh chính vào album
    if (product?.primary_image?.image_url)
      arr.push({ url: product.primary_image.image_url, type: "primary" });

    // Thêm các ảnh album
    albumImages.forEach((img) =>
      arr.push({ url: img.image_url, type: "album" })
    );

    // Loại trùng url
    return arr.filter(
      (img, idx, self) => self.findIndex((i) => i.url === img.url) === idx
    );
  }, [product, albumImages]);

  // State cho ảnh đang active
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    const variantImage = selectedVariant?.image || selectedVariant?.image_url;

    // Ưu tiên ảnh variant khi có variant được chọn (ảnh variant sẽ thay thế ảnh chính)
    if (variantImage) {
      setActiveImage(variantImage);
    }
    // Nếu không có variant hoặc variant không có ảnh, dùng ảnh chính
    else if (product?.primary_image?.image_url) {
      setActiveImage(product.primary_image.image_url);
    }
    // Fallback về ảnh album đầu tiên
    else if (albumImages.length > 0) {
      setActiveImage(albumImages[0].image_url);
    }
    // Cuối cùng dùng placeholder
    else {
      setActiveImage("/placeholder.svg");
    }
  }, [selectedVariant, product, albumImages]);

  // Mutation cho user đã đăng nhập
  const addCartMutation = useMutation({
    mutationFn: (value: IAddProductToCartPayload) => addToCart(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã thêm vào giỏ hàng!", { position: "top-right" });
    },
    onError: (error: unknown) => {
      console.error("Add to cart error:", error);
      let errorMessage = "Thêm vào giỏ hàng thất bại!";

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }

      toast.error(errorMessage, { position: "top-right" });
    },
  });

  // Hàm kiểm tra số lượng tồn kho
  const getAvailableStock = () => {
    if (!product) return 0;
    if (product.has_variants && selectedVariant) {
      return selectedVariant.stock_quantity || 0;
    }
    return product.stock_quantity || 0;
  };

  const isOutOfStock = () => {
    return getAvailableStock() < 1;
  };

  // SEO: Update document title and meta description
  useEffect(() => {
    if (product) {
      document.title = `${product.product_name} | Coffee Shop`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          product.short_description ||
            `Mua ${product.product_name} chất lượng cao tại Coffee Shop. ${
              product.description || ""
            }`
        );
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute(
          "content",
          `${product.product_name} | Coffee Shop`
        );
      }

      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute(
          "content",
          product.short_description ||
            `Mua ${product.product_name} chất lượng cao tại Coffee Shop.`
        );
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && product.primary_image?.image_url) {
        ogImage.setAttribute("content", product.primary_image.image_url);
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute(
          "content",
          `${window.location.origin}/product/${product.slug}`
        );
      }
    }
  }, [product]);

  // Lắng nghe param slug thay đổi để call API lại
  useEffect(() => {
    if (slug) {
      console.log("🔄 Slug changed, refetching product:", slug);

      // Reset selected variant khi chuyển sản phẩm
      setSelectedVariant(null);
      setSelectedAttributes({});
      setQuantity(1);

      // Scroll to top khi chuyển sản phẩm
      window.scrollTo({ top: 0, behavior: "smooth" });

      // useQuery sẽ tự động refetch khi slug thay đổi
      // Có thể thêm logic khác ở đây nếu cần
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error) {
    console.error("❌ Error loading product:", error);
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Lỗi khi tải sản phẩm
          </h1>
          <p className="text-gray-600 mb-6">
            {error instanceof Error
              ? error.message
              : "Đã xảy ra lỗi không xác định"}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900"
            >
              Thử lại
            </button>
            <Link
              to="/products"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Về trang sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-6">
            Sản phẩm với slug "{slug}" không tồn tại hoặc đã bị xóa.
          </p>
          <div className="space-x-4">
            <Link
              to="/products"
              className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900"
            >
              Xem tất cả sản phẩm
            </Link>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Trang Chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-amber-800">
          Sản Phẩm
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-stone-900">{product.product_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Album ảnh sản phẩm */}
        <div className="flex flex-col gap-4">
          <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.product_name}
              width={600}
              height={600}
              className="object-contain max-h-[500px]"
            />
          </div>
          <div className="flex gap-2 justify-center">
            {displayImages.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.type}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  activeImage === img.url
                    ? "border-amber-800"
                    : "border-transparent"
                }`}
                onClick={() => setActiveImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                {product.category?.category_name}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    color: getProductStatusDisplay(product.status).color,
                    backgroundColor: getProductStatusDisplay(product.status)
                      .bgColor,
                  }}
                >
                  {getProductStatusDisplay(product.status).text}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    getAvailableStock() > 0
                      ? "text-emerald-800 bg-emerald-100"
                      : "text-red-800 bg-red-100"
                  }`}
                >
                  {getAvailableStock() > 0
                    ? `Còn ${getAvailableStock()} sản phẩm`
                    : "Hết Hàng"}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              {product.product_name}
            </h1>
          </div>

          <div className="text-2xl font-semibold text-amber-800">
            {selectedVariant
              ? selectedVariant.display_price
              : product.display_price}
          </div>

          <p className="text-stone-600">
            {product.short_description || product.description}
          </p>

          {/* Hiển thị lựa chọn biến thể nếu có */}
          {product.has_variants && attributeGroups.length > 0 && (
            <div className="space-y-2">
              {attributeGroups.map((group) => (
                <div key={group.name}>
                  <label className="block text-sm font-medium mb-1">
                    {group.name}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    value={selectedAttributes[group.name] || ""}
                    onChange={(e) =>
                      handleSelectAttribute(group.name, Number(e.target.value))
                    }
                  >
                    <option value="">Chọn {group.name}</option>
                    {group.values.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <button
                  className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isOutOfStock() || !isProductAvailable(product.status)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-amber-800 hover:bg-amber-900 text-white"
                }`}
                onClick={() => {
                  // Kiểm tra số lượng muốn mua (chỉ cần kiểm tra này vì button đã disabled khi hết hàng)
                  if (quantity > getAvailableStock()) {
                    toast.error(
                      `Chỉ còn ${getAvailableStock()} sản phẩm trong kho!`
                    );
                    return;
                  }

                  if (
                    product.has_variants &&
                    attributeGroups.length > 0 &&
                    !selectedVariant
                  ) {
                    toast.error("Vui lòng chọn đầy đủ thuộc tính sản phẩm!");
                    return;
                  }
                  if (!isLoggedIn) {
                    toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
                    return;
                  }
                  addCartMutation.mutate({
                    product_id: product.id,
                    quantity,
                    ...(selectedVariant
                      ? { product_variant_id: selectedVariant.id }
                      : {}),
                  });
                }}
                disabled={
                  isOutOfStock() ||
                  !isProductAvailable(product.status) ||
                  addCartMutation.isPending
                }
              >
                <ShoppingBag className="h-5 w-5" />
                {isOutOfStock()
                  ? "Hết Hàng"
                  : !isProductAvailable(product.status)
                  ? "Không Khả Dụng"
                  : "Thêm vào Giỏ Hàng"}
              </button>

              {/* <SimpleBuyNowButton
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                disabled={
                  product.stock_quantity < 1 ||
                  (product.has_variants &&
                    attributeGroups.length > 0 &&
                    !selectedVariant)
                }
                className="flex-1"
              /> */}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-600 pt-4 border-t">
            <Truck className="h-4 w-4 text-amber-800" />
            <span>Miễn phí giao hàng cho đơn hàng trên $50</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium">Nguồn Gốc</h3>
              <p className="text-stone-600">{product.origin?.origin_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Mức Độ Rang</h3>
              <p className="text-stone-600">{product.roast_level}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Hương Vị</h3>
            <div className="flex flex-wrap gap-2">
              {product.flavor_profile &&
                product.flavor_profile.split(",").map((note, index) => (
                  <span
                    key={index}
                    className="text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {note.trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Mô tả sản phẩm
        </h2>
        <div className="prose max-w-none">
          <p>
            Ethiopian Yirgacheffe của chúng tôi là một loại cà phê đơn nguyên
            thực sự xuất sắc, nổi bật với các ghi chú hoa nhài và cam chanh cùng
            với vị ngọt mượt mà. Được trồng ở vùng cao nguyên Ethiopia, nơi khởi
            nguồn của cà phê, những hạt cà phê này được thu hoạch và chế biến
            cẩn thận để giữ nguyên đặc tính độc đáo của chúng.
          </p>
          <p>
            Vùng Yirgacheffe nổi tiếng với những loại cà phê được săn lùng nhiều
            nhất trên thế giới, và sản phẩm của chúng tôi cũng không phải ngoại
            lệ. Độ cao cao, đất đai màu mỡ và khí hậu lý tưởng tạo ra những điều
            kiện hoàn hảo để trồng cà phê với hương vị phức tạp.
          </p>
          <p>
            Chúng tôi rang các hạt cà phê này ở mức độ vừa để làm nổi bật độ
            sáng tự nhiên của chúng trong khi phát triển vị ngọt. Kết quả là một
            tách cà phê với hương hoa nhài và bergamot, độ chua chanh sôi nổi,
            và vị ngọt như mật ong lưu lại trên vòm miệng.
          </p>
          <p>
            Dù bạn pha chế bằng phương pháp pour-over, French press hay máy pha
            cà phê, bạn sẽ luôn cảm nhận được sự hoàn hảo trong từng ngụm cà
            phê.
          </p>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Đánh giá sản phẩm
        </h2>
        {product && (
          <ProductReviews productId={product.id} showCreateButton={false} />
        )}
      </div>
    </div>
  );
}
