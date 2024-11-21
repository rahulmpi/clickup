import { Button, Form, Input, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();
  const { token } = useParams();

  const onSubmit = async (values: any) => {
    const payload = { token, newPassword: values.newPassword };
    try {
      const response: any = await resetPassword(payload);
      if (response?.error) {
        return toast.error(
          response?.error?.data?.error || "Something went wrong"
        );
      }
      toast.success("Password has been reset");
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
              Create a new password!
            </h1>
            <Form layout="vertical" form={form} onFinish={onSubmit}>
              <Form.Item
                label="Choose new password"
                name="newPassword"
                required={false}
                className="mb-5"
                rules={[
                  { required: true, message: "password required!" },
                  {
                    min: 8,
                    message: "Password must be 8 characters or longer!",
                  },
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
              <Form.Item
                label="Confirm"
                name="confirmPassword"
                dependencies={["newPassword"]}
                required={false}
                className="mb-5"
                rules={[
                  { required: true, message: "password required!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords don't match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Minimum 8 characters"
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
                    "Create password"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className="bg-[#fff] text-center w-full max-w-[480px] shadow-xl md:px-12 md:py-8 px-6 py-4 rounded-2xl text-[14px]">
            <img
              src="/images/password-reset.png"
              alt="Email Sent Icon"
              className="mx-auto mb-5"
            />
            <h3 className="md:text-[24px] text-[18px]">
            Woohoo! Password Changed
            </h3>
            <div className="mt-5">
              <Link to="/login" className="text-sm text-[#5f55ee]">
                go to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
