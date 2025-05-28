/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import {
  IdcardOutlined,
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  AimOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row, InputNumber } from "antd";
import React from "react";
import { useTranslations } from "next-intl";
import "./index.scss";

interface ChiNhanhFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
}

const ChiNhanhForm: React.FC<ChiNhanhFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
}) => {
  const t = useTranslations("DanhMucChiNhanh");

  return (
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BankOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
          <span>{editingData ? t("chinhSua") : t("themMoi")}</span>
        </div>
      }
      form={form}
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={editingData ? t("capNhat") : t("themMoi")}
      cancelText={t("huy")}
      width={800}
      loading={editLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            label={t("maChiNhanh")}
            rules={[{ required: true, message: t("vuilongNhapMaChiNhanh") }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder={t("nhapMaChiNhanh")}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="branchName"
            label={t("tenChiNhanh")}
            rules={[{ required: true, message: t("vuilongNhapTenChiNhanh") }]}
          >
            <Input
              prefix={<BankOutlined />}
              placeholder={t("nhapTenChiNhanh")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="addressLine"
            label={t("diaChi")}
            rules={[{ required: true, message: t("vuilongNhapDiaChi") }]}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder={t("nhapDiaChi")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="city"
            label={t("thanhPho")}
            rules={[{ required: true, message: t("vuilongNhapThanhPho") }]}
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder={t("nhapThanhPho")}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="district"
            label={t("quan")}
            rules={[{ required: true, message: t("vuilongNhapQuan") }]}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder={t("nhapQuan")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="placeId"
            label={t("maViTri")}
            rules={[{ required: true, message: t("vuilongNhapMaViTri") }]}
          >
            <Input
              prefix={<AimOutlined />}
              placeholder={t("nhapMaViTri")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="lat"
            label={t("viDo")}
            rules={[{ required: true, message: t("vuilongNhapViDo") }]}
          >
            <InputNumber
              prefix={<NumberOutlined />}
              placeholder={t("nhapViDo")}
              size="large"
              style={{ width: "100%" }}
              step={0.000001}
              precision={6}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="long"
            label={t("kinhDo")}
            rules={[{ required: true, message: t("vuilongNhapKinhDo") }]}
          >
            <InputNumber
              prefix={<NumberOutlined />}
              placeholder={t("nhapKinhDo")}
              size="large"
              style={{ width: "100%" }}
              step={0.000001}
              precision={6}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="companyCode"
            label={t("maDoanhNghiep")}
            rules={[{ required: true, message: t("vuilongNhapMaDoanhNghiep") }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder={t("nhapMaDoanhNghiep")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default ChiNhanhForm;
