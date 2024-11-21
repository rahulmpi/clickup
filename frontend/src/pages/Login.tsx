import { Button, Form, Input, Divider, Spin } from "antd";
import { LockOutlined,  MailOutlined } from "@ant-design/icons";
import GoogleSignIn from "../components/GoogleLogin";
import { useLoginUserMutation } from "../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [loginUser, {isLoading}] = useLoginUserMutation()

  const onSubmit = async (values: any) => {
    try {
     const response:any = await loginUser(values)
     if(response?.error){
      return toast.error(response?.error?.data?.error || 'Failed to login');
     }
     toast.success('User login successfully!')
     form.resetFields()
     navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  return (
    <div className="grow form-box flex flex-col justify-center">
      <div className="flex justify-center p-3">
        <div className="bg-[#fff] w-full max-w-[480px] shadow-xl md:px-12 md:py-8 px-6 py-4 rounded-2xl text-[14px]">
          <h1 className="text-center md:text-[32px] text-[24px] font-bold mb-4">
          Welcome back!
          </h1>
          <GoogleSignIn />
          <Divider plain style={{ borderColor: "#d6d9de", fontSize: "14px" }}>
            OR
          </Divider>
          <Form layout="vertical" form={form} onFinish={onSubmit}>
            <Form.Item
              label="Work Email"
              name="email"
              required={false}
              className="mb-5"
              rules={[
                { required: true, message: "Email required!" },
                { type: "email", message: "Email is invalid" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@site.com"
                className="py-2 text-sm"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              required={false}
              className="mb-5"
              rules={[
                { required: true, message: "password required!" },
                { min: 8, message: "Password must be 8 characters or longer!" },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                  message: "Password must contain both letters and numbers!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Minimum 8 characters"
                className="py-2 text-sm"
              />
            </Form.Item>
            <div className="text-right -mt-3">
              <Link to="/forgot-password" className="text-sm text-[#5f55ee]">Forgot Password?</Link>
            </div>
            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="shadow-xl text-sm font-semibold w-full py-6"
              >
                {isLoading ? <Spin className="*:!text-[#fff]"/> : 'Log In'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
