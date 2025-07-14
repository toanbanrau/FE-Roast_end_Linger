import { Button, Card, Tag, Spin, Descriptions, Select, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { 
  getContactById, 
  updateContactStatus, 
  getContactStatusOptions 
} from '../../../services/adminContactService';

const { Option } = Select;

export default function ViewContact() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Lấy chi tiết contact
  const { data: contact, isLoading } = useQuery({
    queryKey: ['admin-contact', id],
    queryFn: () => getContactById(Number(id)),
    enabled: !!id,
  });

  // Mutation cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: 'new' | 'processing' | 'resolved' }) =>
      updateContactStatus(Number(id), { status }),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-contact', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
    },
    onError: () => {
      message.error('Cập nhật trạng thái thất bại');
    },
  });

  const handleStatusChange = (status: 'new' | 'processing' | 'resolved') => {
    updateStatusMutation.mutate({ status });
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'new': 'orange',
      'processing': 'blue',
      'resolved': 'green',
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      'new': 'Mới',
      'processing': 'Đang xử lý',
      'resolved': 'Đã giải quyết',
    };
    return textMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy liên hệ!</p>
        <Button onClick={() => navigate('/admin/contact')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/contact')}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết liên hệ #{contact.id}</h1>
            <p className="text-gray-600">Xem thông tin chi tiết liên hệ từ khách hàng</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột chính - Thông tin liên hệ */}
        <div className="lg:col-span-2">
          {/* Thông tin khách hàng */}
          <Card title="Thông tin khách hàng" className="mb-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và tên">
                <span className="font-medium text-gray-900">{contact.full_name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-blue-500" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                    {contact.email}
                  </a>
                </div>
              </Descriptions.Item>
              {contact.phone_number && (
                <Descriptions.Item label="Số điện thoại">
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-green-500" />
                    <a href={`tel:${contact.phone_number}`} className="text-green-600 hover:text-green-800">
                      {contact.phone_number}
                    </a>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Nội dung liên hệ */}
          <Card title="Nội dung liên hệ">
            {contact.subject && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Chủ đề:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{contact.subject}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nội dung:</h3>
              <div className="text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Thông tin bổ sung */}
        <div>
          {/* Trạng thái và hành động */}
          <Card title="Quản lý trạng thái" className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái hiện tại:
                </label>
                <Tag color={getStatusColor(contact.status)} className="text-sm px-3 py-1">
                  {getStatusText(contact.status)}
                </Tag>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật trạng thái:
                </label>
                <Select
                  value={contact.status}
                  style={{ width: '100%' }}
                  onChange={handleStatusChange}
                  loading={updateStatusMutation.isPending}
                >
                  {getContactStatusOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          {/* Thông tin thời gian */}
          <Card title="Thông tin thời gian">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Ngày tạo">
                {new Date(contact.created_at).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(contact.updated_at).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <Button onClick={() => navigate('/admin/contact')}>
          Quay lại danh sách
        </Button>
        
        <div className="flex gap-2">
          {contact.email && (
            <Button
              type="default"
              icon={<MailOutlined />}
              onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
            >
              Gửi email
            </Button>
          )}
          {contact.phone_number && (
            <Button
              type="default"
              icon={<PhoneOutlined />}
              onClick={() => window.open(`tel:${contact.phone_number}`, '_blank')}
            >
              Gọi điện
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
