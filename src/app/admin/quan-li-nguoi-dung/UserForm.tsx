/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import { RoleAdmin } from "@/model/enum";
import SelectServices from "@/services/select/select.service";
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
  Spin,
  Upload,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../../components/styles/styles.module.scss";

const { Option } = Select;

interface UserFormProps {
  form: FormInstance;
  editingUser: any | null;
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  editLoading: boolean;
  fileList: UploadFile[];
  brands: { label: string; value: string }[];
  positions: { label: string; value: string }[];
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
  brands,
  positions,
  handleUploadChange,
}) => {
  const [managers, setManagers] = useState<{ label: string; value: string }[]>(
    []
  );
  const [filteredPositions, setFilteredPositions] =
    useState<{ label: string; value: string }[]>(positions);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  // Get form values for dependent fields
  const branchCode = Form.useWatch("branchCode", form);
  const roleCode = Form.useWatch("roleCode", form);

  // Effect for loading managers when branch and role are selected
  useEffect(() => {
    if (isModalVisible && branchCode && roleCode) {
      loadManagers(branchCode, roleCode);
    } else {
      setManagers([]);
    }
  }, [branchCode, roleCode, isModalVisible]);

  // Effect for loading positions when role changes
  useEffect(() => {
    if (isModalVisible && roleCode) {
      loadPositionsByRole(roleCode);
    } else {
      setFilteredPositions(positions);
    }
  }, [roleCode, isModalVisible, positions]);

  // Function to fetch managers based on branch and role
  const loadManagers = async (branch: string, role: string) => {
    setLoadingManagers(true);
    try {
      const managersData = await SelectServices.getSelectManagers(branch, role);
      if (managersData) {
        setManagers(managersData);
      } else {
        setManagers([]);
        toast.error("Không thể tải danh sách người quản lý");
      }
    } catch (error) {
      console.error("Error loading managers:", error);
      toast.error("Lỗi khi tải danh sách người quản lý");
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  };

  // Function to fetch positions based on role
  const loadPositionsByRole = async (role: string) => {
    setLoadingPositions(true);
    try {
      const positionsData = await SelectServices.getSelectPositionByRole(role);
      if (positionsData) {
        setFilteredPositions(positionsData);
      } else {
        // Fall back to all positions if the filtered API fails
        setFilteredPositions(positions);
        toast.error("Không thể tải danh sách chức vụ theo quyền");
      }
    } catch (error) {
      console.error("Error loading positions by role:", error);
      setFilteredPositions(positions);
    } finally {
      setLoadingPositions(false);
    }
  };

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
      initialValues={{ bod: dayjs().startOf("day") }}
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
            name="bod"
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

      <Row>
        <Col span={24}>
          <Form.Item
            name="address"
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
            name="branchCode"
            label="Chi nhánh"
            rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
          >
            <Select
              placeholder="Chọn chi nhánh"
              size="large"
              options={brands}
              onChange={() => {
                // Clear dependent fields when branch changes
                form.setFieldsValue({ managedBy: undefined });
              }}
            />
          </Form.Item>
        </Col>
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
      </Row>

      {/* Then select manager and position which depend on the above */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="managedBy"
            label="Quản lý bởi"
            tooltip={
              !branchCode || !roleCode
                ? "Vui lòng chọn Chi nhánh và Quyền trước"
                : ""
            }
          >
            <Select
              placeholder={
                !branchCode || !roleCode
                  ? "Chọn Chi nhánh và Quyền trước"
                  : loadingManagers
                  ? "Đang tải..."
                  : "Chọn người quản lý"
              }
              size="large"
              allowClear
              disabled={!branchCode || !roleCode || loadingManagers}
              options={managers}
              notFoundContent={loadingManagers ? <Spin size="small" /> : null}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="positionCode"
            label="Chức vụ"
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
            tooltip={!roleCode ? "Vui lòng chọn Quyền trước" : ""}
          >
            <Select
              placeholder={
                !roleCode
                  ? "Chọn Quyền trước"
                  : loadingPositions
                  ? "Đang tải..."
                  : "Chọn chức vụ"
              }
              size="large"
              options={filteredPositions}
              disabled={!roleCode || loadingPositions}
              dropdownStyle={{ borderRadius: "10px" }}
              notFoundContent={loadingPositions ? <Spin size="small" /> : null}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
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
          <Form.Item
            name="faceImg"
            label="Hình ảnh khuôn mặt"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
              className={styles.faceImageUpload}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default UserForm;
