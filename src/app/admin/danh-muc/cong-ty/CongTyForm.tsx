/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { IdcardOutlined, BankOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, FormInstance, Input, Row } from "antd";
import React from "react";
import { useTranslations } from "next-intl";

interface CongTyFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
}

const CongTyForm: React.FC<CongTyFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
}) => {
  const t = useTranslations("DanhMucCongTy");

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
      width={700}
      loading={editLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            label={t("maCongTy")}
            rules={[{ required: true, message: t("vuilongNhapMaCongTy") }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder={t("nhapMaCongTy")}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label={t("tenCongTy")}
            rules={[{ required: true, message: t("vuilongNhapTenCongTy") }]}
          >
            <Input
              prefix={<BankOutlined />}
              placeholder={t("nhapTenCongTy")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label={t("moTa")}>
            <Input.TextArea placeholder={t("nhapMoTa")} size="large" rows={4} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="establishDate"
            label={t("ngayThanhLap")}
            rules={[{ required: true, message: t("vuilongChonNgayThanhLap") }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder={t("chonNgayThanhLap")}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default CongTyForm;
