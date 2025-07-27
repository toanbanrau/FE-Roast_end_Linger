# Hệ Thống Quản Lý Kho - Inventory Management System

## 📋 Tổng Quan

Hệ thống quản lý kho được thiết kế để quản lý tồn kho sản phẩm một cách chuyên nghiệp với các tính năng:

- **Quản lý lô hàng**: Theo dõi từng lô hàng nhập kho với thông tin chi tiết
- **Logic FIFO**: Xuất kho theo nguyên tắc "Nhập trước, xuất trước"
- **Quản lý hạn sử dụng**: Cảnh báo sản phẩm sắp hết hạn và xử lý hàng hết hạn
- **Thống kê lợi nhuận**: Báo cáo lợi nhuận theo tuần, tháng, năm
- **Tự động hóa**: Xử lý hàng hết hạn và tính toán thống kê tự động

## 🏗️ Cấu Trúc Database

### 1. Bảng `inventory_lots` - Quản lý lô hàng
```sql
- id: Khóa chính
- lot_number: Mã lô hàng (unique)
- product_id: ID sản phẩm
- product_variant_id: ID variant (nullable)
- supplier_name: Tên nhà cung cấp
- supplier_code: Mã nhà cung cấp
- quantity: Số lượng nhập
- unit_cost: Giá nhập đơn vị
- total_cost: Tổng giá nhập
- manufacturing_date: Ngày sản xuất
- expiry_date: Ngày hết hạn
- import_date: Ngày nhập kho
- storage_location: Vị trí lưu trữ
- notes: Ghi chú
- status: Trạng thái (active, expired, depleted)
- remaining_quantity: Số lượng còn lại
```

### 2. Bảng `inventory_transactions` - Giao dịch kho
```sql
- id: Khóa chính
- transaction_code: Mã giao dịch (unique)
- type: Loại giao dịch (import, export, adjustment, return, expiry)
- product_id: ID sản phẩm
- product_variant_id: ID variant (nullable)
- inventory_lot_id: ID lô hàng (nullable)
- order_id: ID đơn hàng (nullable)
- quantity: Số lượng
- unit_cost: Giá đơn vị
- total_cost: Tổng giá trị
- notes: Ghi chú
- reference_number: Số tham chiếu
- created_by: Người tạo
```

### 3. Bảng `profit_statistics` - Thống kê lợi nhuận
```sql
- id: Khóa chính
- period_type: Loại kỳ (daily, weekly, monthly, yearly)
- period_date: Ngày bắt đầu kỳ
- total_import_cost: Tổng chi phí nhập kho
- total_sales_revenue: Tổng doanh thu bán hàng
- total_profit: Tổng lợi nhuận
- profit_margin: Tỷ lệ lợi nhuận (%)
- total_import_quantity: Tổng số lượng nhập
- total_sales_quantity: Tổng số lượng bán
```

## 🔄 Logic Nghiệp Vụ

### 1. Logic FIFO (First In, First Out)
- Khi xuất kho, hệ thống sẽ ưu tiên xuất từ lô hàng cũ nhất
- Đảm bảo hàng hóa không bị tồn đọng quá lâu
- Tự động tính toán giá vốn chính xác

### 2. Quản lý Hạn Sử Dụng
- **Cảnh báo sắp hết hạn**: Sản phẩm trong vòng 30 ngày sẽ được đưa lên đầu với màu đỏ
- **Xử lý hàng hết hạn**: Tự động đánh dấu và xử lý hàng đã hết hạn
- **Trạng thái lô hàng**: active → expired → depleted

### 3. Tính Toán Lợi Nhuận
```
Lợi nhuận = Doanh thu bán hàng - Chi phí nhập kho
Tỷ lệ lợi nhuận = (Lợi nhuận / Doanh thu) × 100%
```

## 🚀 API Endpoints

### Quản Lý Lô Hàng
```http
GET /api/admin/inventory/lots - Lấy danh sách lô hàng
POST /api/admin/inventory/import - Nhập kho
POST /api/admin/inventory/export - Xuất kho thủ công
POST /api/admin/inventory/return - Hoàn trả hàng về kho
```

### Quản Lý Hạn Sử Dụng
```http
GET /api/admin/inventory/expiring - Sản phẩm sắp hết hạn
GET /api/admin/inventory/expired - Sản phẩm đã hết hạn
POST /api/admin/inventory/process-expired - Xử lý hàng hết hạn
```

### Thống Kê & Báo Cáo
```http
GET /api/admin/inventory/statistics - Thống kê tồn kho
GET /api/admin/inventory/transactions - Lấy danh sách giao dịch kho
GET /api/admin/inventory/profit-report - Báo cáo lợi nhuận
GET /api/admin/inventory/weekly-profit - Lợi nhuận theo tuần
GET /api/admin/inventory/monthly-profit - Lợi nhuận theo tháng
GET /api/admin/inventory/yearly-profit - Lợi nhuận theo năm
GET /api/admin/inventory/product-profit - Lợi nhuận theo sản phẩm
GET /api/admin/inventory/profit-comparison - So sánh lợi nhuận
```

## 💻 Console Commands

### 1. Xử lý hàng hết hạn
```bash
# Xem hàng hết hạn (không thay đổi dữ liệu)
php artisan inventory:process-expired --dry-run

# Xử lý hàng hết hạn thực tế
php artisan inventory:process-expired
```

### 2. Tính toán thống kê lợi nhuận
```bash
# Tính toán tất cả thống kê
php artisan profit:calculate

# Tính toán theo ngày cụ thể
php artisan profit:calculate --type=daily --date=2024-01-15

# Tính toán theo tuần
php artisan profit:calculate --type=weekly --date=2024-01-15

# Tính toán theo tháng
php artisan profit:calculate --type=monthly --date=2024-01-15

# Tính toán theo năm
php artisan profit:calculate --type=yearly --year=2024
```

## 📊 Ví Dụ Sử Dụng

### 1. Nhập Kho
```php
// Nhập kho sản phẩm
$data = [
    'product_id' => 1,
    'product_variant_id' => 5, // nullable
    'supplier_name' => 'Nhà cung cấp ABC',
    'supplier_code' => 'ABC001',
    'quantity' => 100,
    'unit_cost' => 50000,
    'manufacturing_date' => '2024-01-01',
    'expiry_date' => '2024-12-31',
    'import_date' => '2024-01-15',
    'storage_location' => 'Khu A - Kệ 1',
    'notes' => 'Lô hàng chất lượng cao'
];

$lot = $inventoryService->importInventory($data);
```

### 2. Xuất Kho Tự Động
```php
// Khi có đơn hàng, hệ thống tự động xuất kho
$order = Order::find(1);
$inventoryService->processOrder($order);
```

### 3. Lấy Sản Phẩm Sắp Hết Hạn
```php
// Lấy sản phẩm sắp hết hạn trong 30 ngày
$expiringProducts = $inventoryService->getExpiringProducts(30);

foreach ($expiringProducts as $product) {
    echo "Sản phẩm: {$product['product_name']}";
    echo "Còn lại: {$product['days_until_expiry']} ngày";
    echo "Giá trị: {$product['total_value']} VNĐ";
}
```

### 4. Báo Cáo Lợi Nhuận
```php
// Báo cáo lợi nhuận theo tháng
$report = $profitService->getMonthlyProfitReport(2024);

foreach ($report['statistics'] as $stat) {
    echo "Tháng: {$stat['period_date']}";
    echo "Doanh thu: {$stat['total_sales_revenue']} VNĐ";
    echo "Lợi nhuận: {$stat['total_profit']} VNĐ";
    echo "Tỷ lệ: {$stat['profit_margin']}%";
}
```

## 🔧 Cấu Hình Tự Động

### 1. Cron Jobs (Thêm vào crontab)
```bash
# Xử lý hàng hết hạn hàng ngày lúc 2:00 AM
0 2 * * * cd /path/to/project && php artisan inventory:process-expired

# Tính toán thống kê lợi nhuận hàng ngày lúc 3:00 AM
0 3 * * * cd /path/to/project && php artisan profit:calculate
```

### 2. Kernel Schedule (app/Console/Kernel.php)
```php
protected function schedule(Schedule $schedule)
{
    // Xử lý hàng hết hạn hàng ngày
    $schedule->command('inventory:process-expired')
             ->daily()
             ->at('02:00');

    // Tính toán thống kê lợi nhuận hàng ngày
    $schedule->command('profit:calculate')
             ->daily()
             ->at('03:00');
}
```

## 🎯 Tính Năng Nổi Bật

### 1. Cảnh Báo Thông Minh
- Sản phẩm sắp hết hạn được đưa lên đầu với màu đỏ
- Thông báo số ngày còn lại đến hết hạn
- Tính toán giá trị hàng hết hạn

### 2. Báo Cáo Chi Tiết
- Lợi nhuận theo tuần, tháng, năm
- So sánh lợi nhuận giữa các kỳ
- Phân tích lợi nhuận theo sản phẩm
- Thống kê tồn kho real-time

### 3. Tự Động Hóa
- Xuất kho tự động khi có đơn hàng
- Xử lý hàng hết hạn tự động
- Tính toán thống kê định kỳ
- Đồng bộ stock giữa product và variants

### 4. Bảo Mật & Kiểm Soát
- Ghi log tất cả giao dịch kho
- Kiểm tra quyền truy cập
- Validation dữ liệu chặt chẽ
- Transaction để đảm bảo tính nhất quán

## 📈 Lợi Ích

1. **Quản lý kho chuyên nghiệp**: Theo dõi từng lô hàng chi tiết
2. **Tối ưu hóa chi phí**: Logic FIFO giúp giảm thiểu tồn kho
3. **Cảnh báo sớm**: Phát hiện sản phẩm sắp hết hạn kịp thời
4. **Báo cáo chính xác**: Thống kê lợi nhuận real-time
5. **Tự động hóa**: Giảm thiểu công việc thủ công
6. **Tính minh bạch**: Theo dõi được mọi giao dịch kho

## 🔮 Phát Triển Tương Lai

1. **Tích hợp barcode/QR code**: Quét mã để nhập/xuất kho
2. **Mobile app**: Quản lý kho trên điện thoại
3. **AI/ML**: Dự đoán nhu cầu tồn kho
4. **Tích hợp ERP**: Kết nối với hệ thống ERP
5. **Báo cáo nâng cao**: Dashboard với biểu đồ trực quan 