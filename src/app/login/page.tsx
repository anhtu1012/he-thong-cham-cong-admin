/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setAuthData } from "@/lib/store/slices/loginSlice";
import AuthServices from "@/services/auth/api.service";
import { getCookie } from "@/utils/client/getCookie";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./login.scss";
import backgroundImage from "../../../public/assets/image/BackgroundFaceAI.png";

interface LoginForm {
  username: string;
  password: string;
}
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [signInForm] = useForm<LoginForm>();
  const [isNavigating, setIsNavigating] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    try {
      const token: any = getCookie("token");
      // If no token, don't try to redirect or parse
      if (!token) return;

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);

      if (!payload.exp || payload.exp < currentTime) {
        console.log("Token expired. Redirecting to login.");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("Middleware Token Error:" + error);
    }
  }, [router]);

  const onFinish = async (values: any) => {
    if (isLogin || isNavigating) return;
    setIsLogin(true);
    try {
      const res = await AuthServices.login(values);
      document.cookie = "token=; Max-Age=0; path=/;";
      document.cookie = "refreshToken=; Max-Age=0; path=/;";
      AuthServices.setToken(res.accessToken);
      AuthServices.setRefreshToken(res.refreshToken);
      dispatch(setAuthData(res));
      toast.success("Đăng nhập thành công"); //t("success")
      setIsNavigating(true);
      if (res.userProfile.role === "R1") {
        router.push("/admin");
      } else if (res.userProfile.role === "R2") {
        router.push("/hr");
      } else if (res.userProfile.role === "R3") {
        router.push("/manager");
      } else {
        router.push("/");
      }
      setTimeout(() => {
        setIsLogin(false);
        setIsNavigating(false);
      }, 500);
    } catch (error: any) {
      console.log(error);
      toast.error("Đăng nhập thất bại");
      setIsLogin(false);
      setIsNavigating(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <Title level={1} className="login-title">
            Get Started Now
          </Title>
          <Text className="login-subtitle">
            Enter your credentials to access your account
          </Text>

          <Form
            name="login"
            form={signInForm}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            style={{ width: "100%" }}
            className="login-form-container"
          >
            <Form.Item
              label="Name"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Enter your username"
                disabled={isLogin || isNavigating}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Enter your password"
                disabled={isLogin || isNavigating}
              />
            </Form.Item>

            <div className="login-links">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="login-checkbox">
                  I agree to the Terms & Privacy
                </Checkbox>
              </Form.Item>
              <Link href="/forgot-password" className="login-forgot">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLogin || isNavigating}
                block
              >
                {isLogin
                  ? "Đang đăng nhập..."
                  : isNavigating
                  ? "Đang chuyển trang..."
                  : "Đăng Nhập"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="login-right">
        <div className="image-container">
          <Image
            src={backgroundImage}
            alt="Facial Recognition"
            className="background-image"
            width={1000}
            height={1000}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
