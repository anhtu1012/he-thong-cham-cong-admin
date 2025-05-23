/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setAuthData } from "@/lib/store/slices/loginSlice";
import AuthServices from "@/services/auth/api.service";
import { getCookie } from "@/utils/client/getCookie";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./login.scss";

interface LoginForm {
  username: string;
  password: string;
}
const { Title } = Typography;

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
      <Card className="login-card">
        <Title level={2} className="login-title">
          Login
        </Title>
        <Form
          name="login"
          form={signInForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              disabled={isLogin || isNavigating}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              disabled={isLogin || isNavigating}
            />
          </Form.Item>

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
                : "Đăng nhập"}
            </Button>
          </Form.Item>

          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Link href="/register">Don't have an account? Register now</Link>
            <Link href="/forgot-password">Forgot password?</Link>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
