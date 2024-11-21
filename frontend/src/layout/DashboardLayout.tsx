import { Navigate, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? JSON.parse(token) : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
