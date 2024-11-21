import { Link, useLocation } from "react-router-dom";
import { Button, Flex } from "antd";

const Header = () => {
  const location = useLocation();

  return (
    <nav className="flex justify-between p-5 items-center md:fixed relative w-full">
      <Link to="/login">
        <img src="/images/logo.svg" className="w-[124px]" />
        <p>
          <small>The everything app for work.</small>
        </p>
      </Link>
      {location.pathname === "/signup" ? (
        <Flex gap="large" wrap align="center">
          <p className="hidden md:block">Already playing with ClickUp?</p>
          <Link to="/login">
            <Button
              size="large"
              type="primary"
              className="shadow-xl text-sm font-medium"
            >
              Login
            </Button>
          </Link>
        </Flex>
      ) : (
        <Flex gap="large" wrap align="center">
          <p className="hidden md:block">Don't have an account?</p>
          <Link to="/signup">
            <Button
              size="large"
              type="primary"
              className="shadow-xl text-sm font-medium"
            >
              Sign up
            </Button>
          </Link>
        </Flex>
      )}
    </nav>
  );
};

export default Header;
