/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row, TimePicker } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import React from "react";
import "./index.scss";

// Utility function to convert string time to dayjs object
const convertToDateTime = (value: string | null | undefined) => {
  if (!value) return null;

  // If value is already a dayjs object, return it
  if (dayjs.isDayjs(value)) return value;

  // Handle ISO string format (e.g., "1970-01-01T01:30:00.000Z")
  if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
    const dayjsObj = dayjs.utc(value);
    return dayjs().hour(dayjsObj.hour()).minute(dayjsObj.minute()).second(0);
  }

  // Handle string format "HH:mm"
  if (typeof value === "string" && value.includes(":")) {
    const [hours, minutes] = value.split(":");
    return dayjs()
      .hour(parseInt(hours, 10))
      .minute(parseInt(minutes, 10))
      .second(0);
  }

  return dayjs(value);
};

interface CaLamFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
}

const CaLamForm: React.FC<CaLamFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
}) => {
  const t = useTranslations("DanhMucCaLam");

  return (
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ClockCircleOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
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
        <Col span={24}>
          <Form.Item
            name="name"
            label={t("tenCaLam")}
            rules={[{ required: true, message: t("vuilongNhapTenCaLam") }]}
          >
            <Input
              prefix={<ClockCircleOutlined />}
              placeholder={t("nhapTenCaLam")}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="lunchBreak"
            label={t("lunchBreak")}
            rules={[
              { required: true, message: t("vuilongNhapThoiGianNghiTrua") },
            ]}
            getValueProps={(value) => ({
              value: value ? convertToDateTime(value) : null,
            })}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: "100%" }}
              prefix={<ClockCircleOutlined />}
              placeholder={t("nhapThoiGianNghiTrua")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startTime"
            label={t("gioBatDau")}
            rules={[{ required: true, message: t("vuilongChonGioBatDau") }]}
            getValueProps={(value) => ({
              value: convertToDateTime(value),
            })}
          >
            <TimePicker
              format="HH:mm"
              placeholder={t("chonGioBatDau")}
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="endTime"
            label={t("gioKetThuc")}
            rules={[{ required: true, message: t("vuilongChonGioKetThuc") }]}
            getValueProps={(value) => ({ value: convertToDateTime(value) })}
          >
            <TimePicker
              format="HH:mm"
              placeholder={t("chonGioKetThuc")}
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default CaLamForm;
