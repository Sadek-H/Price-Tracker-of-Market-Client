import React from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Allusers from "../Pages/Dashboard/Admin/Allusers";
import BecomeVendor from "../Pages/Dashboard/User/BecomeVendor";
import VendorRequest from "../Pages/Dashboard/Admin/Vendor-request";
import AddProduct from "../Pages/Dashboard/vendor/AddProduct";
import MyProduct from "../Pages/Dashboard/vendor/Myproduct";
import EditmyProducts from "../Pages/Dashboard/vendor/EditmyProducts";
import AddAds from "../Pages/Dashboard/vendor/AddAds";
import MyAds from "../Pages/Dashboard/vendor/MyAds";
import AllProducts from "../Pages/Dashboard/Admin/AllProducts";
import Allads from "../Pages/Dashboard/Admin/Allads";
import AllOrder from "../Pages/Dashboard/Admin/AllOrder";
import ProductInfo from "../Pages/ProductDetails/ProductInfo";
import Payment from "../Pages/ProductDetails/Payment";
import CheckoutForm from "../Pages/ProductDetails/CheckoutForm";
import ViewPriceTrends from "../Pages/Dashboard/User/ViewPriceTrends";
import WatchList from "../Pages/Dashboard/User/WatchList";
import Orderlist from "../Pages/Dashboard/User/Orderlist";
import Allproduct from "../Pages/Allproduct";
import Privateroutes from "./Privateroutes";
import Notfound from "../Pages/Notfound";
import { AdminRoute } from "./ProtectedRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Notfound />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: SignUp,
      },
      {
        path: "details/:id",
        element: (
          <Privateroutes>
            <ProductInfo />
          </Privateroutes>
        ),
        loader: () => fetch("https://price-tracker-of-market-server.onrender.com/products"),
      },
      {
        path: "payment/:id",
        Component: Payment,
        loader: () => fetch("https://price-tracker-of-market-server.onrender.com/products"),
      },
      {
        path: "checkOut",
        Component: CheckoutForm,
      },
      {
        path: "products",
        Component: Allproduct,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <Privateroutes>
        <DashboardLayout />
      </Privateroutes>
    ),
    errorElement: <Notfound />,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "/dashboard/users",
        element: (
          <AdminRoute>
            <Allusers />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/become-vendor",
        Component: BecomeVendor,
      },
      {
        path: "/dashboard/all-vendors",
        element: (
          <AdminRoute>
            <VendorRequest />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/add-product",
        Component: AddProduct,
      },
      {
        path: "/dashboard/my-products",
        Component: MyProduct,
      },
      {
        path: "/dashboard/pricetrends",
        Component: ViewPriceTrends,
      },
      {
        path: "/dashboard/Watchlist",
        Component: WatchList,
      },
      {
        path: "/dashboard/update-product/:id",
        Component: EditmyProducts,
        loader: () => fetch("https://price-tracker-of-market-server.onrender.com/dashboard/my-products"),
      },
      {
        path: "/dashboard/add-advertisement",
        Component: AddAds,
      },
      {
        path: "/dashboard/my-ads",
        Component: MyAds,
      },
      {
        path: "/dashboard/all-products",
        element: (
          <AdminRoute>
            <AllProducts />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-ads",
        element: (
          <AdminRoute>
            <Allads />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-orders",
        element: (
          <AdminRoute>
            <AllOrder />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/my-orders",
        Component: Orderlist,
      },
    ],
  },
]);
