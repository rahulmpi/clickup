import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const GoogleSignIn = () => {
  const responseGoogle = async (response: any) => {
    const { credential } = response;

    try {
      const result = await fetch("http://localhost:3001/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: credential,
        }),
      });

      if (!result.ok) {
        toast("Login failed");
      }

      const data = await result.json();
      const { token } = data;
      console.log("Login successful, JWT:", token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <GoogleLogin onSuccess={responseGoogle} />
    </div>
  );
};

export default GoogleSignIn;
