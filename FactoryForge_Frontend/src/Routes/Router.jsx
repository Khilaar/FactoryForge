import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";

import LoginPage from "./Authentication/LoginPage.jsx";
import ProductInventory from "./ProtectedPages/ProductInventory.jsx";
import RegisterPage from "./Authentication/RegisterPage.jsx";
import ValidationPage from "./Authentication/Validation.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Dashboard from "./ProtectedPages/Dashboard.jsx";
import Inventory from "./ProtectedPages/Inventory.jsx";
import Clients from "./ProtectedPages/Clients.jsx";
import ProfilePage from "./ProtectedPages/ProfilePage.jsx";
import RawMaterialInventory from "./ProtectedPages/RawMaterialInventory.jsx";
import Orders from "./ProtectedPages/Orders.jsx";
import OrdersHistory from "./ProtectedPages/OrdersHistory.jsx";
import Suppliers from "./ProtectedPages/Suppliers.jsx";
import Analytics from "./ProtectedPages/Analytics.jsx";
import Settings from "./ProtectedPages/Settings.jsx";
import ProductDetail from "./ProtectedPages/ProductDetail.jsx";

const RouterComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register">
          <Route index element={<RegisterPage />} />
          <Route path="validation" element={<ValidationPage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/productinventory" element={<ProductInventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/history" element={<OrdersHistory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/productdetail/:id" element={<ProductDetail />} />
          <Route
            path="/rawmaterialinventory"
            element={<RawMaterialInventory />}
          />
          <Route path="/clients" element={<Clients />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterComponent;
