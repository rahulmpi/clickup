import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MinimalLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-y-auto bg-[#fafbfc]">
      <Header/>
      <Outlet />
      </div>
    </>
  );
};

export default MinimalLayout;
