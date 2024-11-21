import { Button } from "antd";
import { useLogoutUserMutation } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

const Dashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      googleLogout()
      if(response?.error){
        return toast.error('Failed to logged out');
       }
      toast.success('Logged out successfully!')
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };
  return (
    <>
      <h1>Dashboard</h1>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Dashboard;
