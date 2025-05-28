/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { IdcardOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  DatePicker,
  TimePicker,
} from "antd";
import React from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import "./index.scss";

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

  // Helper function to convert ISO string to dayjs object for DatePicker
  const convertToDateTime = (timeString: string | undefined) => {
    if (!timeString) return undefined;
    return dayjs(timeString);
  };

  // Helper function to convert string time (HH:mm) to dayjs object for TimePicker
  const convertToTime = (timeString: string | undefined) => {
    if (!timeString) return undefined;

    // Xử lý trường hợp chuỗi là "HH:mm"
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      return dayjs().hour(parseInt(hours)).minute(parseInt(minutes)).second(0);
    }

    return undefined;
  };

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
        <Col span={12}>
          <Form.Item
            name="code"
            label={t("maCaLam")}
            rules={[{ required: true, message: t("vuilongNhapMaCaLam") }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder={t("nhapMaCaLam")}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
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
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startTime"
            label={t("gioBatDau")}
            rules={[{ required: true, message: t("vuilongChonGioBatDau") }]}
            getValueProps={(value) => ({ value: convertToDateTime(value) })}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="HH:mm DD/MM/YYYY"
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
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="HH:mm DD/MM/YYYY"
              placeholder={t("chonGioKetThuc")}
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="workingHours"
            label={t("soGioLam")}
            rules={[{ required: true, message: t("vuilongNhapSoGioLam") }]}
          >
            <InputNumber
              prefix={<ClockCircleOutlined />}
              placeholder={t("nhapSoGioLam")}
              size="large"
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="delayTime"
            label={t("thoiGianTre")}
            rules={[{ required: true, message: t("vuilongChonThoiGianTre") }]}
            getValueFromEvent={(timeValue) => {
              if (timeValue && timeValue.$d) {
                const time = dayjs(timeValue.$d);
                return `${time.format("HH:mm")}`;
              }
              return "";
            }}
            getValueProps={(value) => ({ value: convertToTime(value) })}
          >
            <TimePicker
              format="HH:mm"
              placeholder={t("chonThoiGianTre")}
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
