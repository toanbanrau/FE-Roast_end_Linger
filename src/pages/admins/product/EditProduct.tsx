import { Form, Input, Button, Select, InputNumber, Switch, message, Spin, Row, Col, Upload } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { getProductById, updateProduct } from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllBrands } from "../../../services/brandService";
import { getAllOrigins } from "../../../services/originService";

import type { IProductUpdate, IProductOrigin } from "../../../interfaces/product";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";

const { TextArea } = Input;
const { Option } = Select;

const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    
    const hasVariants = Form.useWatch('has_variants', form);

    const { data: product, isLoading: isLoadingProduct } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(Number(id)),
        enabled: !!id,
    });
    
    const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getAllCategories });
    const { data: brands, isLoading: isLoadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getAllBrands });
    const { data: origins, isLoading: isLoadingOrigins } = useQuery({ queryKey: ['origins'], queryFn: getAllOrigins });

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                ...product,
                base_price: product.base_price, 
                variants: product.variants?.length ? product.variants : [{}],
            });
        }
    }, [product, form]);

    const mutation = useMutation({
        mutationFn: (productData: IProductUpdate) => updateProduct(Number(id), productData),
        onSuccess: () => {
            message.success("Cập nhật sản phẩm thành công!");
            navigate("/admin/product");
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        },
        onError: (err) => {
            message.error("Có lỗi xảy ra: " + err.message);
        },
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'images' && Array.isArray(value)) {
                // Xử lý giữ/xóa/thêm/cập nhật ảnh theo logic API
                // Ví dụ: formData.append('images[keep][]', id), ...
            } else if (typeof value !== 'undefined' && value !== null) {
                formData.append(key, value);
            }
        });
        mutation.mutate(formData);
    };
    
    if (isLoadingProduct || isLoadingCategories || isLoadingBrands || isLoadingOrigins) return <Spin tip="Đang tải dữ liệu..." />;

    return (
        <div>
            <h2>Chỉnh Sửa Sản Phẩm</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} encType="multipart/form-data">
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item name="product_name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả chi tiết">
                            <TextArea rows={6} />
                        </Form.Item>
                        <Form.Item name="short_description" label="Mô tả ngắn">
                            <TextArea rows={3} />
                        </Form.Item>
                         <Form.Item name="images" label="Ảnh sản phẩm" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                            </Upload>
                        </Form.Item>

                        {hasVariants && (
                             <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
                                <h4>Quản lý biến thể</h4>
                                <Form.List name="variants">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Row key={key} gutter={16} style={{ marginBottom: 8, alignItems: 'center' }}>
                                                    <Col span={6}><Form.Item {...restField} name={[name, 'variant_name']} rules={[{ required: true, message: 'Nhập tên' }]}><Input placeholder="Tên biến thể" /></Form.Item></Col>
                                                     <Col span={5}><Form.Item {...restField} name={[name, 'sku_code']} rules={[{ required: true, message: 'Nhập SKU' }]}><Input placeholder="SKU" /></Form.Item></Col>
                                                    <Col span={5}><Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, message: 'Nhập giá' }]}><InputNumber min={0} placeholder="Giá" style={{ width: '100%' }} /></Form.Item></Col>
                                                    <Col span={5}><Form.Item {...restField} name={[name, 'stock_quantity']} rules={[{ required: true, message: 'Nhập số lượng' }]}><InputNumber min={0} placeholder="Số lượng" style={{ width: '100%' }} /></Form.Item></Col>
                                                    <Col span={1}><MinusCircleOutlined onClick={() => remove(name)} /></Col>
                                                </Row>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm biến thể</Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </div>
                        )}
                    </Col>
                    <Col span={8}>
                        <Form.Item name="has_variants" label="Có biến thể" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        
                        {!hasVariants && (
                            <>
                                <Form.Item name="base_price" label="Giá gốc" rules={[{ required: !hasVariants, message: 'Vui lòng nhập giá!' }]}>
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="stock_quantity" label="Số lượng kho" rules={[{ required: !hasVariants, message: 'Vui lòng nhập số lượng!' }]}>
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item name="category_id" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                            <Select placeholder="Chọn danh mục">{categories?.map((cat: ICategory) => <Option key={cat.id} value={cat.id}>{cat.category_name}</Option>)}</Select>
                        </Form.Item>
                        <Form.Item name="brand_id" label="Thương hiệu"><Select placeholder="Chọn thương hiệu">{brands?.map((brand: IBrand) => <Option key={brand.id} value={brand.id}>{brand.brand_name}</Option>)}</Select></Form.Item>
                        <Form.Item name="origin_id" label="Xuất xứ"><Select placeholder="Chọn xuất xứ">{origins?.map((origin: IProductOrigin) => <Option key={origin.id} value={origin.id}>{origin.origin_name}</Option>)}</Select></Form.Item>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Select><Option value="active">Active</Option><Option value="inactive">Inactive</Option></Select></Form.Item>
                        <Form.Item name="is_featured" label="Nổi bật" valuePropName="checked"><Switch /></Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                    Cập nhật sản phẩm
                </Button>
            </Form>
        </div>
    );
};

export default EditProduct;
