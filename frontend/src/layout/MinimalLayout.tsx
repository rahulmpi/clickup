import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";

const MinimalLayout = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? JSON.parse(token) : null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <div className="h-screen flex flex-col overflow-y-auto bg-[#fafbfc] minimal">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

export default MinimalLayout;
