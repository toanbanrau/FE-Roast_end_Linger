# 🔐 API Google Login - Hướng dẫn sử dụng

> **Tài liệu API đăng nhập bằng Google OAuth 2.0**  
> **Version:** 1.0  
> **Last Updated:** 2024-01-20  
> **Base URL:** `http://localhost/api/auth`  
> **Authentication:** Not required (public endpoints)

## 🎯 Tổng quan

API Google Login cho phép người dùng đăng nhập/đăng ký bằng tài khoản Google thông qua OAuth 2.0. API tự động xử lý 3 scenarios: user mới, user cũ có email, và user đã link Google.

### 🚀 Tính năng chính
- 🔐 **OAuth 2.0 Standard** - Tuân thủ chuẩn bảo mật Google
- 🤖 **Auto User Management** - Tự động tạo/link/update user
- 🔄 **Smart Account Linking** - Link tài khoản existing với Google
- ✅ **Auto Email Verification** - Tự động verify email từ Google
- 🎨 **Avatar Integration** - Tự động lấy avatar từ Google
- 🔑 **Token Management** - Tạo JWT token với expiration

### 📊 Authentication Flow
```
1. Frontend → GET /api/auth/google → Lấy Google Auth URL
2. User → Click URL → Redirect to Google Login
3. User → Login Google → Google redirect về callback
4. Backend → GET /api/auth/google/callback → Xử lý authorization code
5. Backend → Fetch user info từ Google → Tạo/update user → Return token
6. Frontend → Lưu token → Authenticated!
```

## 📚 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **GET** | `/api/auth/google` | Lấy Google OAuth URL | ❌ No |
| **GET** | `/api/auth/google/callback` | Xử lý Google callback | ❌ No |

---

## 1. 🌐 Lấy Google OAuth URL
**GET** `/api/auth/google`

> **🎯 Mục đích:** Tạo URL để redirect user đến Google OAuth  
> **📱 Use case:** Button "Đăng nhập bằng Google" trên frontend

### Request
```http
GET /api/auth/google HTTP/1.1
Host: localhost
Accept: application/json
```

### Response Success (200)
```json
{
  "success": true,
  "data": {
    "auth_url": "https://accounts.google.com/oauth/authorize?client_id=123456789.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fgoogle%2Fcallback&scope=openid+profile+email&response_type=code&state=randomstate123"
  }
}
```

### Response Error (500)
```json
{
  "success": false,
  "message": "Không thể tạo URL đăng nhập Google",
  "error": "Google OAuth configuration missing"
}
```

---

## 2. 🔄 Xử lý Google Callback
**GET** `/api/auth/google/callback`

> **🎯 Mục đích:** Nhận authorization code từ Google và xử lý đăng nhập  
> **⚠️ Lưu ý:** Endpoint này được Google tự động gọi, không phải frontend

### Request (từ Google)
```http
GET /api/auth/google/callback?code=4/0AX4XfWh...&scope=email+profile+openid&authuser=0&prompt=consent HTTP/1.1
Host: localhost
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | ✅ Yes | Authorization code từ Google |
| `scope` | string | ❌ No | Scopes được granted |
| `state` | string | ❌ No | State parameter (security) |

### Response Success (200) - User mới
```json
{
  "success": true,
  "message": "Đăng nhập Google thành công",
  "data": {
    "user": {
      "id": 15,
      "name": "johndoe123",
      "full_name": "John Doe",
      "email": "john.doe@gmail.com",
      "avatar": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "google_id": "108234567890123456789",
      "provider": "google",
      "role": "user",
      "status": "active",
      "email_verified_at": "2024-01-20T10:30:00.000000Z",
      "provider_verified_at": "2024-01-20T10:30:00.000000Z",
      "created_at": "2024-01-20T10:30:00.000000Z"
    },
    "token": "15|abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    "token_type": "Bearer",
    "expires_at": "2024-01-21T10:30:00.000000Z",
    "expires_in_minutes": 1440
  }
}
```

### Response Success (200) - User existing được link
```json
{
  "success": true,
  "message": "Đăng nhập Google thành công",
  "data": {
    "user": {
      "id": 5,
      "name": "existing_user",
      "full_name": "John Doe",
      "email": "john.doe@gmail.com",
      "avatar": "https://lh3.googleusercontent.com/a/ACg8ocK...",
      "google_id": "108234567890123456789",
      "provider": "google",
      "role": "user",
      "status": "active",
      "email_verified_at": "2024-01-15T08:00:00.000000Z",
      "provider_verified_at": "2024-01-20T10:30:00.000000Z",
      "created_at": "2024-01-15T08:00:00.000000Z"
    },
    "token": "5|xyz789abc123def456ghi789jkl012mno345pqr678",
    "token_type": "Bearer",
    "expires_at": "2024-01-21T10:30:00.000000Z",
    "expires_in_minutes": 1440
  }
}
```

### Response Error (500)
```json
{
  "success": false,
  "message": "Đăng nhập Google thất bại",
  "error": "Invalid authorization code"
}
```

---

## 🔧 Smart User Management

### 📊 3 Scenarios xử lý tự động:

#### ✅ **Scenario 1: User đã đăng nhập Google trước đó**
- **Tìm theo:** `google_id`
- **Hành động:** Update avatar và thông tin mới từ Google
- **Kết quả:** Login thành công với user existing

#### ✅ **Scenario 2: User có email trong hệ thống nhưng chưa link Google**
- **Tìm theo:** `email`
- **Hành động:** 
  - Link tài khoản với Google (`google_id`, `provider`)
  - Update avatar từ Google
  - Auto-verify email (vì Google đã verify)
- **Kết quả:** Account linking + login thành công

#### ✅ **Scenario 3: User hoàn toàn mới**
- **Hành động:**
  - Tạo user mới với thông tin từ Google
  - Auto-generate unique username
  - Set `email_verified_at` (Google pre-verified)
  - Random password (không cần vì login bằng Google)
  - Set role = 'user', status = 'active'
- **Kết quả:** Registration + login thành công

### 🗄️ Database Fields được tạo/cập nhật:
```sql
-- Fields cho Google OAuth
google_id VARCHAR(255) UNIQUE    -- Google user ID
provider VARCHAR(255)            -- 'google'
avatar VARCHAR(255)              -- Google profile picture URL
provider_verified_at TIMESTAMP   -- Thời gian verify bằng Google

-- Auto-generated cho user mới
name VARCHAR(255)                -- Unique username
full_name VARCHAR(255)           -- Tên đầy đủ từ Google
email VARCHAR(255)               -- Email từ Google
password VARCHAR(255)            -- Random hash (không dùng)
role ENUM('admin', 'user')       -- Default 'user'
status ENUM('active', 'inactive', 'banned') -- Default 'active'
email_verified_at TIMESTAMP      -- Auto-set vì Google verified
```

---

## 🚀 Frontend Integration

### React Example
```javascript
import { useState } from 'react';

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // 1. Lấy Google Auth URL
      const response = await fetch('/api/auth/google', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 2. Redirect user to Google
        window.location.href = data.data.auth_url;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Không thể đăng nhập bằng Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
      className="google-login-btn"
    >
      {loading ? 'Đang xử lý...' : '🔐 Đăng nhập bằng Google'}
    </button>
  );
};

// Xử lý callback (trong component khác hoặc route handler)
const GoogleCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Google OAuth error:', error);
      // Redirect to login page with error
      window.location.href = '/login?error=google_auth_failed';
      return;
    }
    
    if (code) {
      // Code sẽ được backend tự động xử lý
      // Nếu thành công, backend sẽ redirect hoặc trả về token
      console.log('Google authorization code received:', code);
    }
  }, []);

  return <div>Đang xử lý đăng nhập Google...</div>;
};
```

### Vanilla JavaScript Example
```javascript
// Google Login Button Handler
document.getElementById('google-login-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/auth/google');
    const data = await response.json();
    
    if (data.success) {
      // Redirect to Google OAuth
      window.location.href = data.data.auth_url;
    } else {
      alert('Lỗi: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Không thể kết nối đến server');
  }
});

// Handle callback response (if using AJAX instead of redirect)
const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/google/callback?code=${code}`);
    const data = await response.json();
    
    if (data.success) {
      // Lưu token
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert('Đăng nhập thất bại: ' + data.message);
    }
  } catch (error) {
    console.error('Callback error:', error);
    alert('Lỗi xử lý đăng nhập');
  }
};
```

### Vue.js Example
```javascript
// Composition API
import { ref } from 'vue';

export default {
  setup() {
    const loading = ref(false);
    
    const loginWithGoogle = async () => {
      loading.value = true;
      
      try {
        const response = await fetch('/api/auth/google');
        const data = await response.json();
        
        if (data.success) {
          window.location.href = data.data.auth_url;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Google login error:', error);
        // Handle error (show toast, etc.)
      } finally {
        loading.value = false;
      }
    };
    
    return {
      loading,
      loginWithGoogle
    };
  }
};
```

---

## ⚙️ Configuration Setup

### 1. Environment Variables (.env)
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# App Configuration
APP_URL=http://localhost:8000

# Sanctum Token Configuration
SANCTUM_EXPIRATION=1440  # 24 hours in minutes
```

### 2. Google Cloud Console Setup
1. **Tạo Project** tại [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**: Google+ API, Google OAuth2 API
3. **Tạo OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
4. **Copy Client ID và Client Secret** vào .env

---

## 🔒 Security & Error Handling

### 🛡️ Built-in Security
- **CSRF Protection**: Sử dụng `stateless()` cho API
- **State Parameter**: Google tự động thêm state cho security
- **Token Expiration**: JWT tokens có thời hạn (default 24h)
- **Unique Constraints**: `google_id` và `email` unique trong DB

### 🚨 Common Errors & Solutions

#### 1. "redirect_uri_mismatch"
**Solution:** Check `GOOGLE_REDIRECT_URI` trong .env và Google Cloud Console

#### 2. "invalid_client"
**Solution:** Verify `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`

#### 3. "access_denied"
**Solution:** User đã cancel login - handle gracefully trong frontend

---

## 📊 Testing

### Manual Testing
1. **GET** `/api/auth/google` → Copy auth_url
2. **Paste URL** trong browser → Login Google
3. **Check callback** → Verify token response

### Postman Collection
```json
{
  "name": "Google OAuth Test",
  "requests": [
    {
      "name": "Get Google Auth URL",
      "method": "GET",
      "url": "{{base_url}}/auth/google"
    }
  ]
}
```

---

## 📞 Support & Resources

### 📚 Documentation Links
- **Google OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **Laravel Socialite**: https://laravel.com/docs/socialite

### 🆘 Support
- **API Documentation**: `/docs/auth-api`
- **Support Email**: auth-api@roastandlinger.com

---

**🎉 Happy Coding with Google OAuth!** 🚀
