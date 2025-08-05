// Test file để kiểm tra API blog
// Chạy: node src/test-blog-api.js

const testBlogAPI = async () => {
  const baseURL = 'http://127.0.0.1:8000/api';
  
  try {
    console.log('🧪 Testing Blog API...\n');
    
    // Test 1: Get blog post by slug
    console.log('1. Testing GET /blog/{slug}');
    const response = await fetch(`${baseURL}/blog/dslaklsad`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.status && data.data) {
      console.log('✅ API structure matches our interface');
      console.log('- Has user field:', !!data.data.user);
      console.log('- Has category field:', !!data.data.category);
      console.log('- User name:', data.data.user?.name);
      console.log('- Category name:', data.data.category?.category_name);
    } else {
      console.log('❌ API structure does not match');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

// Uncomment to run test
// testBlogAPI();

console.log('Test file created. Uncomment the last line to run the test.');
