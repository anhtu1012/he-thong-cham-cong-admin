import FormModal from "@/components/basicUI/FormModal";
import { RoleAdmin } from "@/model/enum";
import {
  Avatar,
  Col,
  DatePicker,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Upload,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  CalendarOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export interface Employee {
  code: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dob: string;
  avatar?: string;
  gender: string;
  typeOfWork?: string;
  isActive: boolean;
  addressCode: string;
  positionCode: string;
  managedBy?: string;
  roleCode: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QuanLiNhanVienFormProps {
  form: FormInstance<Employee>;
  editingData: Employee | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
  fileList?: UploadFile[];
  positions?: { label: string; value: string }[];
  managers?: { label: string; value: string }[];
  handleUploadChange?: (info: { fileList: UploadFile[] }) => void;
}

const QuanLiNhanVienForm: React.FC<QuanLiNhanVienFormProps> = ({
  form,
  editingData,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
  fileList = [],
  positions = [],
  managers = [],
  handleUploadChange = () => {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShowPassword(!editingData);
  }, [editingData]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IdcardOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
          <span>
            {editingData ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </span>
        </div>
      }
      initialValues={{ dob: dayjs().startOf("day") }}
      form={form}
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={editingData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={900}
      loading={editLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      {editingData && (
        <div style={{ textAlign: "center", margin: "10px 0 24px" }}>
          <Avatar
            size={80}
            style={{
              backgroundColor: "#3b82f6",
              fontSize: "32px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
            src={editingData.avatar}
          >
            {editingData.firstName.charAt(0)}
          </Avatar>
          <div style={{ marginTop: "12px", fontWeight: 600, fontSize: "16px" }}>
            {`${editingData.firstName} ${editingData.lastName}`}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            {editingData.email}
          </div>
          <Divider />
        </div>
      )}

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="firstName"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập họ"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="lastName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên đăng nhập"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập địa chỉ email"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Nhập số điện thoại"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              size="large"
              suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
            />
          </Form.Item>
        </Col>
      </Row>

      {showPassword && (
        <Row>
          <Col span={24}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="addressCode"
            label="Mã địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập mã địa chỉ!" }]}
          >
            <Input placeholder="Nhập mã địa chỉ" size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="positionCode"
            label="Mã chức vụ"
            rules={[{ required: true, message: "Vui lòng nhập mã chức vụ!" }]}
          >
            <Select
              placeholder="Chọn chức vụ"
              size="large"
              options={positions}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="managedBy" label="Người quản lý">
            <Select
              placeholder="Chọn người quản lý"
              size="large"
              allowClear
              options={managers}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="roleCode"
            label="Quyền"
            rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
          >
            <Select
              placeholder="Chọn quyền"
              size="large"
              options={[
                { value: RoleAdmin.ADMIN, label: "Admin" },
                { value: RoleAdmin.HR, label: "HR" },
                { value: RoleAdmin.MANAGER, label: "Quản lý" },
                { value: RoleAdmin.STAFF, label: "Nhân viên" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính" size="large">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="typeOfWork" label="Loại công việc">
            <Select placeholder="Chọn loại công việc" size="large">
              <Option value="fulltime">Toàn thời gian</Option>
              <Option value="parttime">Bán thời gian</Option>
              <Option value="contract">Hợp đồng</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="avatar" label="Ảnh đại diện">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Tạm khóa</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default QuanLiNhanVienForm;
