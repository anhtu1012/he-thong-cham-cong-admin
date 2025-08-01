/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { RoleAdmin } from "@/models/enum";
import {
  CalendarOutlined,
  HomeOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import { useEffect, useState } from "react";
import styles from "../../../components/styles/styles.module.scss";
import "./index.scss";

const { Option } = Select;

interface UserFormProps {
  form: FormInstance;
  editingUser: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
  fileList: UploadFile[];
  handleUploadChange: (info: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  form,
  editingUser,
  isModalVisible,
  handleCancel,
  handleSubmit,
  editLoading,
  fileList,
  handleUploadChange,
}) => {
  const [displayFileList, setDisplayFileList] = useState<UploadFile[]>([]);

  // Convert faceImg URL to fileList format when editingUser changes
  useEffect(() => {
    if (
      editingUser &&
      editingUser.faceImg &&
      typeof editingUser.faceImg === "string"
    ) {
      // If faceImg is a URL, convert it to fileList format
      const imageFile: UploadFile = {
        uid: "-1",
        name: "face-image.jpg",
        status: "done",
        url: editingUser.faceImg,
      };
      setDisplayFileList([imageFile]);
    } else if (fileList && fileList.length > 0) {
      // Use provided fileList if available
      setDisplayFileList(fileList);
    } else {
      // Clear fileList if no image
      setDisplayFileList([]);
    }
  }, [editingUser, fileList]);

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
            {editingUser
              ? "Chỉnh sửa thông tin người dùng"
              : "Thêm người dùng mới"}
          </span>
        </div>
      }
      initialValues={{ dob: dayjs().startOf("day") }}
      form={form}
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={editingUser ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={900}
      loading={editLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      {editingUser && (
        <div style={{ textAlign: "center", margin: "10px 0 24px" }}>
          <Avatar
            size={80}
            style={{
              backgroundColor: "#3b82f6",
              fontSize: "32px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            {editingUser.firstName.charAt(0)}
          </Avatar>
          <div style={{ marginTop: "12px", fontWeight: 600, fontSize: "16px" }}>
            {`${editingUser.firstName} ${editingUser.lastName}`}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            {editingUser.email}
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
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
          >
            <Select
              placeholder="Chọn giới tính"
              prefix={<UserOutlined />}
              options={[
                {
                  label: "Nam",
                  value: "M",
                },
                {
                  label: "Nữ",
                  value: "F",
                },
                {
                  label: "Khác",
                  value: "O",
                },
              ]}
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
            name="phone"
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
              className={styles.customDatePicker}
              suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
            />
          </Form.Item>
        </Col>
      </Row>

      {!editingUser && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="userName"
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
          <Col span={12}>
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

      <Row>
        <Col span={24}>
          <Form.Item
            name="addressCode"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Nhập địa chỉ"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* First, select branch and role */}
      <Row gutter={16}>
        <Col span={12}>
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
        <Col span={12}>
          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              size="large"
              dropdownStyle={{ borderRadius: "10px" }}
            >
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Tạm khóa</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="faceImg" label="Hình ảnh khuôn mặt">
            <Upload
              listType="picture-card"
              fileList={displayFileList}
              onChange={(info) => {
                setDisplayFileList(info.fileList);
                handleUploadChange(info);
              }}
              disabled
              beforeUpload={() => false}
              maxCount={1}
              className={styles.faceImageUpload}
            >
              {displayFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default UserForm;
