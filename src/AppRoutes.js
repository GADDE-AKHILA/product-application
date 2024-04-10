import React from "react";
import { Route, Routes } from "react-router";
import CreateProductModal from "./components/CreateProductModal";
import Dashboard from "./components/Dashboard";
import GlobalErrorPage from "./components/GlobalErrorPage";
import HourglassSpin from "./components/HourglassSpin";
import ListComponent from "./components/ListComponent";
import { LoginComponent } from "./components/LoginComponent";
import SecuredRoute from "./components/SecuredRoute";
import Wrapper from "./components/Wrapper";

const AppRoutes = () => {
  return (
    <Routes fallbackElement={< HourglassSpin/>} exceptionElement={<GlobalErrorPage />} >
      
      <Route path="/products" element={<SecuredRoute><ListComponent /> </SecuredRoute>} errorElement={<GlobalErrorPage />} />
     {/*  <Route path="/products" element={<ListComponent />} errorElement={<GlobalErrorPage />} >
        <Route path=":product_id" element={<Dashboard />} />
        <Route path="delete/:product_id" element={<Dashboard />} />
      </Route> */}
      <Route path="/products/create" element={<SecuredRoute> <CreateProductModal show={true} mode = {'CREATE'} title={'Create New Product'}/> </SecuredRoute>} />
      <Route path="/products/update" element={<SecuredRoute><CreateProductModal show={true} mode={'EDIT'} title={'Update Product'} /> </SecuredRoute>} />
      <Route path="/login" element={<Wrapper><LoginComponent /></Wrapper>} />
    </Routes>
  );
};

export default AppRoutes;
