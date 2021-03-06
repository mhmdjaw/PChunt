import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ProvideFacets } from "../../../context";
import LoadingPage from "../../common/LoadingPage";
// import {
//   Home,
//   NavBar,
//   Account,
//   Product,
//   Footer,
//   CategoryForm,
// } from "../../core";
import {
  // Login,
  // Signup,
  AuthRoute,
  AuthSuccess,
} from "../../user";
import history from "./history";
import ScrollToTop from "./ScrollToTop";
const NavBar = lazy(() => import("../NavBar"));
const Home = lazy(() => import("../Home"));
const Account = lazy(() => import("../Account"));
const Product = lazy(() => import("../Product"));
const Footer = lazy(() => import("../Footer"));
const CategoryForm = lazy(() => import("../CategoryForm"));
const Login = lazy(() => import("../../user/Login"));
const Signup = lazy(() => import("../../user/Signup"));

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Router history={history}>
        <ScrollToTop />
        <Switch>
          <AuthRoute path="/login" authType="guest">
            <Login />
          </AuthRoute>
          <AuthRoute path="/signup" authType="guest">
            <Signup />
          </AuthRoute>
          <Route exact path="/auth/success">
            <AuthSuccess />
          </Route>

          <AuthRoute path="/" authType="unprotected">
            <ProvideFacets>
              <NavBar />
              <AuthRoute exact path="/" authType="unprotected">
                <Home />
              </AuthRoute>
              <AuthRoute exact path="/account" authType="protected">
                <Account />
              </AuthRoute>
              <AuthRoute
                path="/account/update"
                authType="protected"
              ></AuthRoute>
              <AuthRoute path="/category" authType="admin">
                <CategoryForm />
              </AuthRoute>
              <AuthRoute path="/product" authType="admin">
                <Product />
              </AuthRoute>
              <Footer />
            </ProvideFacets>
          </AuthRoute>
        </Switch>
      </Router>
    </Suspense>
  );
};

export default Routes;
