import { useRoutes } from "react-router-dom";
import LayoutClient from "./layouts/LayoutClient";
import LayoutAdmin from "./layouts/LayoutAdmin";
import HomePage from "./pages/clients/Home";

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
          path: "product/:id",
          element: <div>Product detail</div>,
        },
        {
          path: "contact",
          element: <div>Product detail</div>,
        },
        {
          path: "cart",
          element: <div>Product detail</div>,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          path: "product",
          element: <div>Product</div>,
        },
        {
          path: "product/:id",
          element: <div>Product detail</div>,
        },
        {
          path: "brand",
          element: <div>Brand</div>,
        },
      ],
    },
  ]);

  return element;
}

export default App;
