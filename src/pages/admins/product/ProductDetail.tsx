import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminProductDetail } from '../../../services/productService';
import { Card, Descriptions, Image, Tag, Table, Button, Spin } from 'antd';
import type { IAdminProductDetailResponse, IAdminProductImage } from '../../../interfaces/product';

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery<IAdminProductDetailResponse>({
    queryKey: ['admin-product-detail', id],
    queryFn: () => getAdminProductDetail(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <Spin tip="Đang tải chi tiết sản phẩm..." />;
  if (isError || !data) return <div>Lỗi tải chi tiết sản phẩm</div>;

  const product = data.data;
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Quay lại</Button>
      <Card>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <Image
              src={product.primary_image?.image_url || '/placeholder.svg'}
              alt={product.primary_image?.alt_text || product.product_name}
              width={240}
              height={240}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
            <div style={{ marginTop: 16 }}>
              <b>Ảnh phụ:</b>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {product.images?.length ? product.images.map((img: IAdminProductImage) => (
                  <Image
                    key={img.id}
                    src={img.image_url}
                    alt={img.alt_text}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                )) : <span>Không có</span>}
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Descriptions title="Thông tin sản phẩm" bordered column={1}>
              <Descriptions.Item label="Tên sản phẩm">{product.product_name}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
              <Descriptions.Item label="Giá">{product.formatted_price}</Descriptions.Item>
              <Descriptions.Item label="Danh mục">{product.category?.category_name}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{product.brand?.brand_name}</Descriptions.Item>
              <Descriptions.Item label="Xuất xứ">{product.origin?.origin_name}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={product.status === 'active' ? 'green' : 'red'}>
                  {product.status === 'active' ? 'Hiện' : 'Ẩn'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nổi bật">
                <Tag color={product.is_featured ? 'gold' : 'default'}>
                  {product.is_featured ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng kho">{product.stock_quantity}</Descriptions.Item>
              <Descriptions.Item label="Loại cà phê">{product.coffee_type}</Descriptions.Item>
              <Descriptions.Item label="Mức độ rang">{product.roast_level}</Descriptions.Item>
              <Descriptions.Item label="Hương vị">{product.flavor_profile}</Descriptions.Item>
              <Descriptions.Item label="Độ mạnh">{product.strength_score}</Descriptions.Item>
              <Descriptions.Item label="Meta title">{product.meta_title}</Descriptions.Item>
              <Descriptions.Item label="Meta description">{product.meta_description}</Descriptions.Item>
            </Descriptions>
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3>Biến thể sản phẩm</h3>
                <Table
                  dataSource={product.variants}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'Tên biến thể', dataIndex: 'variant_name', key: 'variant_name' },
                    { title: 'SKU', dataIndex: 'sku_code', key: 'sku_code' },
                    { title: 'Giá', dataIndex: 'price', key: 'price', render: (v: string) => Number(v).toLocaleString() + '₫' },
                    { title: 'Số lượng', dataIndex: 'stock_quantity', key: 'stock_quantity' },
                    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailAdmin;
