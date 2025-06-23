import { useRoutes } from "react-router-dom";
import LayoutClient from "./layouts/LayoutClient";
import LayoutAdmin from "./layouts/LayoutAdmin";
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
import CartPage from "./pages/clients/cart/CartPage";
import ProductDetailPage from "./pages/clients/productdetail/ProductDetail";
import OrdersPage from "./pages/clients/account/order/OderPage";
import BlogPage from "./pages/clients/blog/BlogPage";
import ContactPage from "./pages/clients/contact/ContactPage";
import AboutPage from "./pages/clients/about/AboutPage";
import ListBlogCategory from "./pages/admins/blog-category/ListBlogCategory";
import AddBlogCategory from "./pages/admins/blog-category/AddBlogCategory";
import EditBlogCategory from "./pages/admins/blog-category/EditBlogCategory";
import Dashboard from "./pages/admins/dashboard/Dashboard";
import CheckoutPage from "./pages/clients/checkout/CheckoutPage";
import WishlistPage from "./pages/clients/account/wishlist/WishlistPage";

function App() {
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
          path: "product/:id",
          element: <ProductDetailPage />,
        },
        {
          path:'about',
          element:<AboutPage/>
        },
        {
          path:'blog',
          element:<BlogPage/>
        },
        {
          path: "contact",
          element: <ContactPage/>,
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
          path:'account/orders',
          element:<OrdersPage/>
        },
        {
          path:'account/orders/',
          element:<OrdersPage/>
        },
        {
          path:'account/wishlist',
          element:<WishlistPage/>
        },
        {
          path: "checkout",
          element: <CheckoutPage/>,
        },
        {
          path: "auth/login",
          element: <LoginPage />,
        },
        {
          path: "auth/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          path:'',
          element:<Dashboard/>
        },
        {
          path: "product",
          element: <ListProduct />,
        },
        {
          path: "product/:id",
          element: <div>Product detail</div>,
        },
        {
          path: "product/add",
          element: <AddProduct />,
        },
        {
          path: "product/edit/:id",
          element: <div>Product detail</div>,
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
          element: <div>Brand</div>,
        },
        {
          path: "order/:id",
          element: <div>Brand</div>,
        },
        //Route Category
        {
          path: "category",
          element: <ListCategory />,
        },
        {
          path: "category/add",
          element: <div>Brand</div>,
        },
        {
          path: "category/edit/:id",
          element: <div>Brand</div>,
        },
        //Route User
        {
          path: "user",
          element: <div>Brand</div>,
        },
        //Route Comment
        {
          path: "comment",
          element: <div>Brand</div>,
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
          element: <EditPromotion/>,
        },
        //Route blog-category
        {
          path:"blog-category",
          element:<ListBlogCategory/>
        },
        {
          path:"blog-category/add",
          element:<AddBlogCategory/>
        },
        {
          path:"blog-category/edit/:id",
          element:<EditBlogCategory/>
        }
      ],
    },
  ]);

  return element;
}

export default App;
