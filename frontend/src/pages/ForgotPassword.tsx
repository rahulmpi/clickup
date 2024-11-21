import { Button, Form, Input, Spin } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  const onSubmit = async (values: any) => {
    try {
      const response: any = await forgotPassword(values);
      if (response?.error) {
        return toast.error(
          response?.error?.data?.error || "Something went wrong"
        );
      }
      toast.success("Link sent successfully on email");
      form.resetFields();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="grow form-box flex flex-col justify-center">
      <div className="flex justify-center p-3">
        {!isSuccess ? (
          <div className="bg-[#fff] w-full max-w-[480px] shadow-xl md:px-12 md:py-8 px-6 py-4 rounded-2xl text-[14px]">
            <h1 className="text-center md:text-[32px] text-[24px] font-bold mb-4">
              Forgot your password?
            </h1>
            <Form layout="vertical" form={form} onFinish={onSubmit}>
              <Form.Item
                label="Email"
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
              <Form.Item className="mt-8">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="shadow-xl text-sm font-semibold w-full py-6"
                >
                  {isLoading ? (
                    <Spin className="*:!text-[#fff]" />
                  ) : (
                    "Send me the link"
                  )}
                </Button>
              </Form.Item>
            </Form>
            <div className="text-center">
              <Link to="/login" className="text-sm text-[#5f55ee]">
                or sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#fff] text-center w-full max-w-[480px] shadow-xl md:px-12 md:py-8 px-6 py-4 rounded-2xl text-[14px]">
            <h1 className="md:text-[32px] text-[24px] font-bold mb-4">
              Recovery link sent!
            </h1>
            <img
              src="/images/email-sent.png"
              alt="Email Sent Icon"
              className="w-[120px] mx-auto my-5"
            />
            <h3 className="md:text-[24px] text-[18px]">
              Now, check your email.
            </h3>
            <div className="mt-3">
              <Link to="/login" className="text-sm text-[#5f55ee]">
                or sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
