/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { RoleAdmin } from "@/model/enum";
import {
  IdcardOutlined,
  DollarOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Col, Form, FormInstance, Input, InputNumber, Row, Select } from "antd";
import React from "react";

interface ChucVuFormProps {
  form: FormInstance;
  editingData: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
}

const ChucVuForm: React.FC<ChucVuFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
}) => {
  return (
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ApartmentOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
          <span>
            {editingData ? "Chỉnh sửa thông tin chức vụ" : "Thêm chức vụ mới"}
          </span>
        </div>
      }
      form={form}
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={editingData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
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
            label="Mã chức vụ"
            rules={[{ required: true, message: "Vui lòng nhập mã chức vụ!" }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="Nhập mã chức vụ (VD: CEO)"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="positionName"
            label="Tên chức vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên chức vụ!" }]}
          >
            <Input
              prefix={<ApartmentOutlined />}
              placeholder="Nhập tên chức vụ"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="basicSalary"
            label="Lương cơ bản"
            rules={[{ required: true, message: "Vui lòng nhập lương cơ bản!" }]}
          >
            <InputNumber
              prefix={<DollarOutlined />}
              placeholder="Nhập lương cơ bản"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="allowance" label="Phụ cấp">
            <InputNumber
              prefix={<DollarOutlined />}
              placeholder="Nhập phụ cấp"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="overtimeSalary" label="Lương làm thêm giờ">
            {/* input decimal format 12.222*/}
            <InputNumber
              prefix={<DollarOutlined />}
              placeholder="Nhập lương làm thêm giờ"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lateFee" label="Phí đi muộn">
            <InputNumber
              prefix={<DollarOutlined />}
              placeholder="Nhập phí đi muộn"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="roleCode"
            label="Quyền"
            rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
          >
            <Select
              placeholder="Chọn quyền"
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

export default ChucVuForm;
