/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { RoleAdmin } from "@/model/enum";
import { FileTextOutlined, FileOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import React from "react";
import { useTranslations } from "next-intl";
import "./index.scss";

interface DonFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
}

const DonForm: React.FC<DonFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
}) => {
  const t = useTranslations("DanhMucDon");

  return (
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FileOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
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
            name="title"
            label={t("tieuDe")}
            rules={[{ required: true, message: t("vuilongNhapTieuDe") }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder={t("nhapTieuDe")}
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
        <Col span={24}>
          <Form.Item
            name="rolePermission"
            label={t("nguoiDuyet")}
            rules={[{ required: true, message: t("vuilongChonNguoiDuyet") }]}
          >
            <Select
              placeholder={t("chonNguoiDuyet")}
              size="large"
              dropdownStyle={{ borderRadius: "10px" }}
              onChange={() => {
                // Clear dependent fields when role changes
                form.setFieldsValue({
                  managedBy: undefined,
                  positionCode: undefined,
                });
              }}
              options={[
                { value: RoleAdmin.ADMIN, label: "Admin" },
                { value: RoleAdmin.HR, label: "HR" },
                { value: RoleAdmin.MANAGER, label: "Manager" },
                { value: RoleAdmin.STAFF, label: "Staff" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default DonForm;
