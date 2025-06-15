/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import "./index.scss";

interface CaLamFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  onFinish: (values: any) => void;
  editLoading: boolean;
}

const CaLamForm: React.FC<CaLamFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  onFinish,
  editLoading,
}) => {
  const t = useTranslations("DanhMucCaLam");

  // Helper function to convert ISO string to dayjs object for DatePicker
  const convertToDateTime = (timeString: string | undefined) => {
    if (!timeString) return undefined;
    return dayjs(timeString);
  };

  // Khi edit, chuyển đổi dữ liệu từ API sang giá trị phù hợp cho form
  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        ...editingData,
        startTime: editingData.startTime
          ? dayjs(editingData.startTime)
          : undefined,
        endTime: editingData.endTime ? dayjs(editingData.endTime) : undefined,
        delayTime: editingData.delayTime
          ? dayjs(editingData.delayTime, "HH:mm")
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  // Khi submit, chuyển đổi dữ liệu form về đúng định dạng API
  const handleFormFinish = (values: any) => {
    const toISOStringSafe = (val: any) => {
      if (!val) return undefined;
      if (typeof val === "object" && typeof val.toISOString === "function") {
        return val.toISOString();
      }
      return val;
    };
    const submitData = {
      name: values.name,
      startTime: toISOStringSafe(values.startTime),
      endTime: toISOStringSafe(values.endTime),
    };
    console.log("Form submit (add/edit):", submitData);
    onFinish(submitData);
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
      onOk={() => form.submit()}
      okText={editingData ? t("capNhat") : t("themMoi")}
      cancelText={t("huy")}
      width={700}
      loading={editLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFormFinish}>
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
      </Form>
    </FormModal>
  );
};

export default CaLamForm;
