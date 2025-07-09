import React, { useEffect, useState } from "react";
import type { ShippingMethod } from "../../../interfaces/shippingMethod";
import { getAllShippingMethods } from "../../../services/shippingMethodService";
import { Link } from "react-router-dom";

const ListShippingMethod: React.FC = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShippingMethods();
        setShippingMethods(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Danh sách phương thức vận chuyển</h2>
        <Link to="/admin/shipping-method/add" className="btn btn-primary">Thêm mới</Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mã</th>
            <th>Mô tả</th>
            <th>Phí cơ bản</th>
            <th>Phí/km</th>
            <th>Miễn phí từ</th>
            <th>Thời gian (ngày)</th>
            <th>Khu vực</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {shippingMethods.map(method => (
            <tr key={method.id}>
              <td>{method.name}</td>
              <td>{method.code}</td>
              <td>{method.description}</td>
              <td>{Number(method.base_cost).toLocaleString()}đ</td>
              <td>{Number(method.cost_per_km).toLocaleString()}đ</td>
              <td>{method.free_shipping_threshold ? Number(method.free_shipping_threshold).toLocaleString() + "đ" : "-"}</td>
              <td>
                {method.estimated_days_min === method.estimated_days_max
                  ? method.estimated_days_min
                  : `${method.estimated_days_min} - ${method.estimated_days_max}`}
              </td>
              <td>
                {method.coverage_areas.map(area => (
                  <div key={area.city}>
                    <b>{area.city}</b>
                    {area.districts && (
                      <span>: {area.districts.join(", ")}</span>
                    )}
                  </div>
                ))}
              </td>
              <td>
                {method.is_active ? "Hoạt động" : "Ẩn"}
              </td>
              <td>
                <Link to={`/admin/shipping-method/edit/${method.id}`} className="btn btn-sm btn-warning">Sửa</Link>
                {/* Có thể thêm nút Xóa nếu muốn */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListShippingMethod; 