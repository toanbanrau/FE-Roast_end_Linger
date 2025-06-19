import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
} from "antd";

const { TextArea } = Input;
const AddProduct = () => {
  return (
    <div className="p-5">
      {" "}
      <h2 className="mb-4 text-2xl font-bold">Add New Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-3xl"
      >
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
          <TextArea rows={4} />{" "}
        </Form.Item>
        <Form.Item
          name="short_description"
          label="Short Description"
          rules={[{ required: true }]}
        >
          <TextArea rows={2} />{" "}
        </Form.Item>
        <Form.Item
          name="base_price"
          label="Base Price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} className="w-full" />{" "}
        </Form.Item>
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true }]}
        >
          {" "}
          <Select>
            {categories?.map((category: any) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}{" "}
              </Select.Option>
            ))}
          </Select>{" "}
        </Form.Item>
        <Form.Item name="brand_id" label="Brand" rules={[{ required: true }]}>
          {" "}
          <Select>
            {brands?.map((brand: any) => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}{" "}
              </Select.Option>
            ))}
          </Select>{" "}
        </Form.Item>
        <Form.Item name="origin_id" label="Origin" rules={[{ required: true }]}>
          {" "}
          <Select>
            {origins?.map((origin: any) => (
              <Select.Option key={origin.id} value={origin.id}>
                {origin.name}{" "}
              </Select.Option>
            ))}
          </Select>{" "}
        </Form.Item>
        <Form.Item
          name="coffee_type"
          label="Coffee Type"
          rules={[{ required: true }]}
        >
          <Input />{" "}
        </Form.Item>
        <Form.Item
          name="roast_level"
          label="Roast Level"
          rules={[{ required: true }]}
        >
          {" "}
          <Select>
            <Select.Option value="light">Light</Select.Option>{" "}
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="dark">Dark</Select.Option>
          </Select>{" "}
        </Form.Item>
        <Form.Item
          name="flavor_profile"
          label="Flavor Profile"
          rules={[{ required: true }]}
        >
          <TextArea rows={2} />{" "}
        </Form.Item>
        <Form.Item
          name="strength_score"
          label="Strength Score (1-10)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={10} className="w-full" />{" "}
        </Form.Item>
        <Form.Item
          name="stock_quantity"
          label="Stock Quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} className="w-full" />{" "}
        </Form.Item>
        <Form.Item name="meta_title" label="Meta Title">
          <Input />{" "}
        </Form.Item>
        <Form.Item name="meta_description" label="Meta Description">
          <TextArea rows={2} />{" "}
        </Form.Item>
        <Form.Item
          name="has_variants"
          label="Has Variants"
          valuePropName="checked"
        >
          <Switch />{" "}
        </Form.Item>
        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch />{" "}
        </Form.Item>
        <Form.Item
          name="is_featured"
          label="Featured Product"
          valuePropName="checked"
        >
          <Switch />{" "}
        </Form.Item>
        <Form.Item>
          {" "}
          <Button type="primary" htmlType="submit">
            Add Product{" "}
          </Button>
        </Form.Item>
      </Form>{" "}
    </div>
  );
};

export default AddProduct;
