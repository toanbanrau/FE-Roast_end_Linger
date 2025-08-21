import { useRoutes } from "react-router-dom";
import LayoutClient from "./layouts/LayoutClient";
import LayoutAdmin from "./layouts/LayoutAdmin";
import { useTokenCheck } from "./hooks/useTokenCheck";
import { useCartSync } from "./hooks/useCartSync";
import HomePage from "./pages/clients/home/HomePage";
import ListBrand from "./pages/admins/brand/ListBrand";
import AddBrand from "./pages/admins/brand/AddBrand";
import EditBrand from "./pages/admins/brand/EditBrand";
import ListCategory from "./pages/admins/category/ListCategory";
import ListProduct from "./pages/admins/product/ListProduct";
import AddProduct from "./pages/admins/product/AddProduct";
import AccountPage from "./pages/clients/account/AccountPage";
import ListPromotion from "./pages/admins/promotion/ListPromotion";
import AddPromotion from "./pages/admins/promotion/AddPromotion";
import EditPromotion from "./pages/admins/promotion/EditPromotion";
import ProductPage from "./pages/clients/product/ProductPage";
import RegisterPage from "./pages/clients/auth/RegisterPage";
import LoginPage from "./pages/clients/auth/LoginPage";
import ForgotPasswordPage from "./pages/clients/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/clients/auth/ResetPasswordPage";
import GoogleCallbackPage from "./pages/clients/auth/GoogleCallbackPage";
import CartPage from "./pages/clients/cart/CartPage";
import ProductDetailPage from "./pages/clients/productdetail/ProductDetail";
import OrdersPage from "./pages/clients/account/order/OderPage";
import MyReviews from "./pages/clients/account/MyReviews";
import BlogPage from "./pages/clients/blog/BlogPage";
import BlogDetail from "./pages/clients/blog/blogdetail/BlogDetail";
import BlogCategoryPage from "./pages/clients/blog/category/BlogCategoryPage";
import BlogTagPage from "./pages/clients/blog/tag/BlogTagPage";
import ContactPage from "./pages/clients/contact/ContactPage";
import AboutPage from "./pages/clients/about/AboutPage";
import ListBlogCategory from "./pages/admins/blog-category/ListBlogCategory";
import AddBlogCategory from "./pages/admins/blog-category/AddBlogCategory";
import EditBlogCategory from "./pages/admins/blog-category/EditBlogCategory";
import ListBlogPost from "./pages/admins/blog-post/ListBlogPost";
import AddBlogPost from "./pages/admins/blog-post/AddBlogPost";
import EditBlogPost from "./pages/admins/blog-post/EditBlogPost";
import ViewBlogPost from "./pages/admins/blog-post/ViewBlogPost";
import ListContact from "./pages/admins/contact/ListContact";
import AddContact from "./pages/admins/contact/AddContact";
import ViewContact from "./pages/admins/contact/ViewContact";
import Dashboard from "./pages/admins/dashboard/Dashboard";
import CheckoutPage from "./pages/clients/checkout/CheckoutPage";
import PaymentSuccess from "./pages/clients/checkout/PaymentSuccess";
import PaymentPage from "./pages/clients/payment/PaymentPage";
import WishlistPage from "./pages/clients/account/wishlist/WishlistPage";
import AddressPage from "./pages/clients/account/address/AddressPage";
import EditProduct from "./pages/admins/product/EditProduct";
import ListOrigin from "./pages/admins/origin/ListOrigin";
import AddOrigin from "./pages/admins/origin/AddOrigin";
import EditOrigin from "./pages/admins/origin/EditOrigin";
import ProductDetailAdmin from "./pages/admins/product/ProductDetail";
import OrderDetailPage from "./pages/clients/account/order/OrderDetailPage";
import ListOrder from "./pages/admins/order/ListOrder";
import OrderDetail from "./pages/admins/order/OrderDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListShippingMethod from "./pages/admins/shiping-method/ListShippingMethod";
import ListAttribute from "./pages/admins/attribute/ListAttribute";
import AddAttribute from "./pages/admins/attribute/AddAttribute";
import EditAttribute from "./pages/admins/attribute/EditAttribute";
import AttributeDetail from "./pages/admins/attribute/AttributeDetail";
import AttributeValues from "./pages/admins/attribute/AttributeValues";
// Inventory
import ListInventory from "./pages/admins/inventory/ListInventory";
import ImportInventory from "./pages/admins/inventory/ImportInventory";
import ExportInventory from "./pages/admins/inventory/ExportInventory";
import ReturnInventory from "./pages/admins/inventory/ReturnInventory";
import ExpiryManagement from "./pages/admins/inventory/ExpiryManagement";
import AddCategory from "./pages/admins/category/AddCategory";
import EditCategory from "./pages/admins/category/EditCategory";
import ListUser from "./pages/admins/user/ListUser";
import UserForm from "./pages/admins/user/UserForm";
import UserDetail from "./pages/admins/user/UserDetail";
import ListReview from "./pages/admins/reviews/ListReview";
import ReviewDetail from "./pages/admins/reviews/ReviewDetail";

function App() {
  // Kiểm tra token khi ứng dụng khởi động
  useTokenCheck();

  // Đồng bộ giỏ hàng khi app khởi động và các sự kiện khác
  useCartSync();

  const element = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "products",
          element: <ProductPage />,
        },
        {
          path: "products/:slug",
          element: <ProductDetailPage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "blog",
          element: <BlogPage />,
        },
        {
          path: "blog/category/:categoryId",
          element: <BlogCategoryPage />,
        },
        {
          path: "blog/tag/:tagSlug",
          element: <BlogTagPage />,
        },
        {
          path: "blog/:slug",
          element: <BlogDetail />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "account",
          element: <AccountPage />,
        },
        {
          path: "account/orders",
          element: <OrdersPage />,
        },
        {
          path: "account/orders/:id",
          element: <OrderDetailPage />,
        },
        {
          path: "account/reviews",
          element: <MyReviews />,
        },
        {
          path: "account/wishlist",
          element: <WishlistPage />,
        },
        {
          path: "account/addresses",
          element: <AddressPage />,
        },
        {
          path: "checkout",
          element: <CheckoutPage />,
        },
        {
          path: "payment-success/:orderNumber",
          element: <PaymentSuccess />,
        },
        {
          path: "payment/:orderNumber",
          element: <PaymentPage />,
        },
        {
          path: "auth/login",
          element: <LoginPage />,
        },
        {
          path: "auth/register",
          element: <RegisterPage />,
        },
        {
          path: "auth/forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "auth/reset-password",
          element: <ResetPasswordPage />,
        },
        {
          path: "auth/google/callback",
          element: <GoogleCallbackPage />,
        },
        {
          path: "auth/callback",
          element: <GoogleCallbackPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "product",
          element: <ListProduct />,
        },
        {
          path: "product/:id",
          element: <ProductDetailAdmin />,
        },
        {
          path: "product/add",
          element: <AddProduct />,
        },
        {
          path: "product/edit/:id",
          element: <EditProduct />,
        },
        //Route Brand
        {
          path: "brand",
          element: <ListBrand />,
        },
        {
          path: "brand/add",
          element: <AddBrand />,
        },
        {
          path: "brand/edit/:id",
          element: <EditBrand />,
        },
        //Route Order
        {
          path: "order",
          element: <ListOrder />,
        },
        {
          path: "order/:id",
          element: <OrderDetail />,
        },
        //Route Category
        {
          path: "category",
          element: <ListCategory />,
        },
        {
          path: "category/add",
          element: <AddCategory />,
        },
        {
          path: "category/edit/:id",
          element: <EditCategory />,
        },
        //Route User
        {
          path: "user",
          element: <ListUser />,
        },
        {
          path: "user/add",
          element: <UserForm mode="add" />,
        },
        {
          path: "user/edit/:id",
          element: <UserForm mode="edit" />,
        },
        {
          path: "user/:id",
          element: <UserDetail />,
        },
        //Route Reviews
        {
          path: "reviews",
          element: <ListReview/>,
        },
        {
          path: "reviews/:id",
          element: <ReviewDetail/>,
        },
        //Route Promotion
        {
          path: "promotion",
          element: <ListPromotion />,
        },
        {
          path: "promotion/add",
          element: <AddPromotion />,
        },
        {
          path: "promotion/edit/:id",
          element: <EditPromotion />,
        },
        //Route blog-category
        {
          path: "blog-category",
          element: <ListBlogCategory />,
        },
        {
          path: "blog-category/add",
          element: <AddBlogCategory />,
        },
        {
          path: "blog-category/edit/:id",
          element: <EditBlogCategory />,
        },
        {
          path: "origin",
          element: <ListOrigin />,
        },
        {
          path: "origin/add",
          element: <AddOrigin />,
        },
        {
          path: "origin/edit/:id",
          element: <EditOrigin />,
        },
        {
          path: "shipping-method",
          element: <ListShippingMethod />,
        },
        // Route Attribute
        {
          path: "attribute",
          element: <ListAttribute />,
        },
        {
          path: "attribute/add",
          element: <AddAttribute />,
        },
        {
          path: "attribute/edit/:id",
          element: <EditAttribute />,
        },
        {
          path: "attribute/:id",
          element: <AttributeDetail />,
        },
        {
          path: "attribute/:id/values",
          element: <AttributeValues />,
        },
        // {
        //   path: "shipping-method/add",
        //   element: <AddShippingMethod />,
        // },
        // {
        //   path: "shipping-method/edit/:id",
        //   element: <EditShippingMethod />,
        // },
        {
          path: "blog-post",
          element: <ListBlogPost />,
        },
        {
          path: "blog-post/add",
          element: <AddBlogPost />,
        },
        {
          path: "blog-post/:id",
          element: <ViewBlogPost />,
        },
        {
          path: "blog-post/edit/:id",
          element: <EditBlogPost />,
        },
        //Route Contact
        {
          path: "contact",
          element: <ListContact />,
        },
        {
          path: "contact/add",
          element: <AddContact />,
        },
        {
          path: "contact/:id",
          element: <ViewContact />,
        },
        // Route Inventory
        {
          path: "inventory",
          element: <ListInventory />,
        },
        {
          path: "inventory/import",
          element: <ImportInventory />,
        },
        {
          path: "inventory/export",
          element: <ExportInventory />,
        },
        {
          path: "inventory/return",
          element: <ReturnInventory />,
        },
        {
          path: "inventory/expiry",
          element: <ExpiryManagement />,
        },
      ],
    },
  ]);

  return (
    <>
      {element}
      <ToastContainer />
    </>
  );
}

export default App;
