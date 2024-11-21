import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useGoogleLoginMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const [googleLogin] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const responseGoogle = async (response: any) => {
    const { credential } = response;
    try {
      const response = await googleLogin({ idToken: credential });
      if(response?.error){
        return toast.error('Failed to login');
       }
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div>
      <GoogleLogin onSuccess={responseGoogle} />
    </div>
  );
};

export default GoogleSignIn;
