import type React from "react";
import { useState } from "react";
import { Edit2, Upload } from "lucide-react";
import { Form, Input, Select, DatePicker, Button, Upload as AntUpload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import AccountNav from "../../../components/AccountNav";
import { useUserStore } from "../../../stores/useUserStore";
import AddressManagement from "../../../components/address/AddressManagement";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import { getProfile } from "../../../services/authService";
import { clientAxios } from "../../../configs/config";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();

  // Custom update profile function sử dụng FormData với POST method
  const updateProfileWithFormData = async (data: any) => {
    console.log('updateProfile called with data:', data);

    // Tạo FormData
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Nếu là file, append trực tiếp
        if (value instanceof File) {
          console.log(`Appending file: ${key}`, value);
          formData.append(key, value);
        } else {
          // Nếu là string/number, convert thành string
          console.log(`Appending field: ${key} = ${value}`);
          formData.append(key, String(value));
        }
      }
    });

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log('Sending POST request to /profile with FormData');
    const response = await clientAxios.post("/profile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update profile response:', response.data);
    return response.data;
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileWithFormData,
    onSuccess: (response) => {
      message.success('Cập nhật thông tin thành công!');
      setUser(response.data); // Cập nhật user trong store
      setIsEditing(false);
      form.resetFields();
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;

      // Hiển thị lỗi validation chi tiết
      if (errorData?.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => {
              message.error(msg);
            });
          }
        });
      } else {
        const errorMessage = errorData?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        message.error(errorMessage);
      }
    },
  });



  const handleStartEdit = () => {
    console.log('Starting to edit profile...');
    console.log('Using current user data from store:', user);

    // Set form values với data hiện tại từ store (không cần gọi API)
    form.setFieldsValue({
      name: user?.name,
      full_name: user?.full_name,
      email: user?.email,
      address: user?.address,
      phone_number: user?.phone_number,
      date_of_birth: user?.date_of_birth ? dayjs(user.date_of_birth) : null,
      gender: user?.gender,
    });

    setIsEditing(true);
    console.log('Edit mode enabled');
  };

  const handleSubmit = (values: any) => {
    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Form values received:', JSON.stringify(values, null, 2));
    console.log('Avatar field:', values.avatar);

    if (values.avatar) {
      console.log('Avatar is array:', Array.isArray(values.avatar));
      console.log('Avatar array length:', values.avatar.length);

      if (values.avatar.length > 0) {
        console.log('First avatar item:', values.avatar[0]);
        console.log('Avatar item keys:', Object.keys(values.avatar[0]));
        console.log('originFileObj:', values.avatar[0].originFileObj);
        console.log('file:', values.avatar[0].file);
        console.log('response:', values.avatar[0].response);
        console.log('status:', values.avatar[0].status);

        // Thử cả originFileObj và file
        const fileObj = values.avatar[0].originFileObj || values.avatar[0].file || values.avatar[0];
        console.log('Detected file object:', fileObj);

        if (fileObj && fileObj instanceof File) {
          console.log('File details:', {
            name: fileObj.name,
            size: fileObj.size,
            type: fileObj.type,
            lastModified: fileObj.lastModified
          });
        }
      }
    }

    const payload: any = {
      name: values.name,
      full_name: values.full_name,
      address: values.address,
      phone_number: values.phone_number,
      gender: values.gender,
      date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : undefined,
    };

    // Chỉ gửi email nếu không phải tài khoản Google
    if (user?.provider !== 'google') {
      payload.email = values.email;
      console.log('✅ Email will be updated (regular account)');
    } else {
      console.log('❌ Email skipped (Google account)');
    }

    // Xử lý avatar - thử nhiều cách
    let avatarFile = null;
    if (values.avatar && values.avatar.length > 0) {
      const avatarItem = values.avatar[0];
      // Thử các cách khác nhau để lấy file
      avatarFile = avatarItem.originFileObj || avatarItem.file || avatarItem;

      if (avatarFile && avatarFile instanceof File) {
        payload.avatar = avatarFile;
        console.log('✅ Avatar file will be uploaded:', avatarFile);
        console.log('File info:', {
          name: avatarFile.name,
          size: avatarFile.size,
          type: avatarFile.type,
          lastModified: avatarFile.lastModified
        });
      } else {
        console.log('❌ No valid File object found');
        console.log('avatarFile type:', typeof avatarFile);
        console.log('avatarFile instanceof File:', avatarFile instanceof File);
        console.log('avatarFile:', avatarFile);
      }
    } else {
      console.log('❌ No avatar in form values');
    }

    console.log('Final payload for FormData:', payload);
    console.log('Payload keys:', Object.keys(payload));
    console.log('Avatar in payload:', !!payload.avatar);
    console.log('=== END FORM SUBMIT DEBUG ===');

    updateProfileMutation.mutate(payload);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Thông Tin Tài Khoản
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="profile" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Info */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Thông tin cá nhân</h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleCancel();
                  } else {
                    // Chuyển sang chế độ edit với data hiện tại
                    handleStartEdit();
                  }
                }}
                className="text-amber-800 hover:text-amber-900 flex items-center gap-1 text-sm font-medium"
              >
                <Edit2 className="h-4 w-4" />
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>
            <div className="p-6">
              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="space-y-4"
                >
                  {/* Avatar Upload */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback nếu avatar URL bị lỗi
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <Form.Item
                        name="avatar"
                        className="mb-0"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                          console.log('getValueFromEvent called with:', e);
                          if (Array.isArray(e)) {
                            return e;
                          }
                          return e && e.fileList;
                        }}
                      >
                        <AntUpload
                          listType="picture-card"
                          maxCount={1}
                          beforeUpload={(file) => {
                            console.log('beforeUpload called with file:', file);
                            // Validate file size (2MB)
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                              message.error('Ảnh phải nhỏ hơn 2MB!');
                              return false;
                            }
                            // Validate file type
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                              message.error('Chỉ chấp nhận file ảnh!');
                              return false;
                            }
                            return false; // Prevent auto upload
                          }}
                          accept="image/*"
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                            showDownloadIcon: false,
                          }}
                          onChange={(info) => {
                            console.log('=== UPLOAD ONCHANGE ===');
                            console.log('Upload onChange info:', info);
                            console.log('File list:', info.fileList);
                            console.log('File list length:', info.fileList.length);

                            if (info.fileList.length > 0) {
                              const file = info.fileList[0];
                              console.log('First file:', file);
                              console.log('File keys:', Object.keys(file));
                              console.log('originFileObj:', file.originFileObj);
                              console.log('file property:', file.file);
                              console.log('status:', file.status);
                              console.log('response:', file.response);
                            }
                            console.log('=== END UPLOAD ONCHANGE ===');
                          }}
                          onPreview={(file) => {
                            // Preview ảnh
                            const src = file.url || file.preview;
                            if (src) {
                              const imgWindow = window.open(src);
                              imgWindow?.document.write(`<img src="${src}" style="width: 100%; height: auto;" />`);
                            }
                          }}
                        >
                          <div className="flex flex-col items-center justify-center p-2">
                            <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                            <div className="text-sm text-gray-600">Chọn ảnh</div>
                          </div>
                        </AntUpload>
                      </Form.Item>
                      <p className="text-xs text-gray-500">
                        Chấp nhận: JPG, PNG, GIF (tối đa 2MB)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="name"
                      label="Tên người dùng"
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên người dùng!' },
                        { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' }
                      ]}
                    >
                      <Input placeholder="Nhập tên người dùng" />
                    </Form.Item>

                    <Form.Item
                      name="full_name"
                      label="Họ và tên đầy đủ"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên đầy đủ" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Địa chỉ Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input
                        placeholder="Nhập địa chỉ email"
                        disabled={user?.provider === 'google'}
                        suffix={
                          user?.provider === 'google' ? (
                            <span className="text-xs text-gray-500">Quản lý bởi Google</span>
                          ) : null
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone_number"
                      label="Số điện thoại"
                      rules={[
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' }
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                      name="date_of_birth"
                      label="Ngày sinh"
                    >
                      <DatePicker
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                        className="w-full"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label="Giới tính"
                    >
                      <Select placeholder="Chọn giới tính">
                        <Select.Option value="male">Nam</Select.Option>
                        <Select.Option value="female">Nữ</Select.Option>
                        <Select.Option value="other">Khác</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                  >
                    <Input.TextArea
                      placeholder="Nhập địa chỉ"
                      rows={3}
                    />
                  </Form.Item>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={updateProfileMutation.isPending}
                      className="bg-amber-800 hover:bg-amber-900 border-amber-800 hover:border-amber-900"
                    >
                      {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Tên người dùng
                        </h3>
                        <p className="mt-1">{user?.name || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Họ và tên đầy đủ
                        </h3>
                        <p className="mt-1">{user?.full_name || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Địa chỉ Email
                        </h3>
                        <p className="mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Số điện thoại
                        </h3>
                        <p className="mt-1">{user?.phone_number || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Ngày sinh
                        </h3>
                        <p className="mt-1">
                          {user?.date_of_birth
                            ? dayjs(user.date_of_birth).format('DD/MM/YYYY')
                            : 'Chưa cập nhật'
                          }
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-500">
                          Giới tính
                        </h3>
                        <p className="mt-1">
                          {user?.gender === 'male' ? 'Nam' :
                           user?.gender === 'female' ? 'Nữ' :
                           user?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                    {user?.address && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-stone-500">
                          Địa chỉ
                        </h3>
                        <p className="mt-1">{user.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Management */}
          <AddressManagement />

          {/* Password section */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Mật khẩu</h2>
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="text-amber-800 hover:text-amber-900 text-sm font-medium"
              >
                Đổi mật khẩu
              </button>
            </div>
            <div className="p-6">
              <p className="text-stone-600">
                Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và thay đổi định kỳ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
