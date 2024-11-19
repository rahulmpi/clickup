import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MinimalLayout from "./layout/MinimalLayout";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <MinimalLayout />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/login",
    element: <MinimalLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
