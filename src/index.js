import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./components/page/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/page/home/Home";
import Product from "./components/page/product/Product";
import Cart from "./components/page/cart/Cart";
import Login from "./components/page/login/LoginPage";
import Register from "./components/page/login/RegisterPage";
import Blog from "./components/page/blog/blog";
import SizeName from "./components/page/blog/sidebar/sizeNam";
import SizeNu from "./components/page/blog/sidebar/sizeNu";
import Profile from "./components/page/profile/ProfilePage";
import User from "./components/page/profile/InfoUser";
import UserBill from "./components/page/profile/ModalDetailBillCustomer";
import ProductDetail from "./components/page/product/productDetail/ProductDetail";
import Contact from "./components/page/contact/contact";
import About from "./components/page/about/about";
import Page403 from "./components/page/page403/Page403";
import Policy from "./components/page/policy/Policy";
import Admin from "./components/admin/Admin";
import ManageBill from "./components/admin/Content/bill/ManageBill";
import ModalDetailBill from "./components/admin/Content/bill/ModalDetailBill";
import ManageBillByEmployee from "./components/admin/Content/billByEmployee/ManageBillByEmployee";
import ManagePromotion from "./components/admin/Content/discount/sale/ManagePromotion";
import ModelCreatePromotion from "./components/admin/Content/discount/sale/ModelCreatePromotion";
import ModelPromotionDetail from "./components/admin/Content/discount/sale/ModelPromotionDetail";
import ModelUpdatePromotion from "./components/admin/Content/discount/sale/ModelUpdatePromotion";
import ManageVoucher from "./components/admin/Content/discount/voucher/ManageVoucher";
import ModelCreateVoucher from "./components/admin/Content/discount/voucher/ModelCreateVoucher";
import ModelUpdateVoucher from "./components/admin/Content/discount/voucher/ModelUpdateVoucher";
import ModelDetailVoucher from "./components/admin/Content/discount/voucher/ModelDetailVoucher";
import ManageCategory from "./components/admin/Content/product/category/ManageCategory";

import ManageProduct from "./components/admin/Content/product/products/ManageProduct";
import ModelCreateProduct from "./components/admin/Content/product/products/createProduct/ModelCreateProduct";
import ModelDetailProduct from "./components/admin/Content/product/products/detailProduct/ModelDetailProduct";
import ModelUpdateProduct from "./components/admin/Content/product/products/updateProduct/ModelUpdateProduct";
import ManageStatistical from "./components/admin/Content/statistical/ManageStatistical";
import ManageAccountCustomer from "./components/admin/Content/account/customer/ManageAccountCustomer";
import ManageAccountEmployee from "./components/admin/Content/account/employee/ManageAccountEmployee";
import Logout from "./components/page/logout/Logout";
import Payment from './components/page/payment/Payment';
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import Auth from "./components/auth/Auth";
import store from "./redux/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/allProducts" element={<Product />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<User />} />
            <Route path="/profile/bill-detail/:codeBill" element={<UserBill />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/About" element={<About />} />
            <Route path="/blog/SizeNam" element={<SizeName />} />
            <Route path="/blog/SizeNu" element={<SizeNu />} />
            <Route path="/Page403" element={<Page403 />} />
            <Route path="/Policy" element={<Policy />} />

          </Route>
          <Route path="/admins" element={<Admin />}>
            <Route path="manage-bill" element={<ManageBill />} />
            <Route
              path="/admins/manage-bill-detail/:codeBill"
              element={<ModalDetailBill />}
            />
            <Route
              path="manage-billByEmployee"
              element={<ManageBillByEmployee />}
            />
            <Route path="manage-promotion" element={<ManagePromotion />} />
            <Route
              path="manage-promotion-create"
              element={<ModelCreatePromotion />}
            />
            <Route
              path="manage-promotion-detail"
              element={<ModelPromotionDetail />}
            />
            <Route
              path="manage-promotion-update"
              element={<ModelUpdatePromotion />}
            />

            <Route path="manage-voucher" element={<ManageVoucher />} />
            <Route
              path="manage-voucher-create"
              element={<ModelCreateVoucher />}
            />
            <Route
              path="manage-voucher-update/:voucherId"
              element={<ModelUpdateVoucher />}
            />
            <Route
              path="manage-voucher-detail/:voucherId"
              element={<ModelDetailVoucher />}
            />
            <Route path="manage-category" element={<ManageCategory />} />

            <Route path="manage-product" element={<ManageProduct />} />
            <Route
              path="manage-create-product"
              element={<ModelCreateProduct />}
            />
            <Route
              path="manage-detail-product"
              element={<ModelDetailProduct />}
            />
            <Route
              path="manage-update-product"
              element={<ModelUpdateProduct />}
            />


            <Route
              path="manage-statistical"
              element={<ManageStatistical />}
            />

            <Route
              path="manage-account-customer"
              element={<ManageAccountCustomer />}
            />

            <Route
              path="manage-account-employee"
              element={<ManageAccountEmployee />}
            />
          </Route>
        </Routes>
      </Auth>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  </Provider>
);
