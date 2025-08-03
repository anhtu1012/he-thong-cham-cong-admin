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
  const [ageInfo, setAgeInfo] = useState<string>("");

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

  // Calculate age info when editing existing user
  useEffect(() => {
    if (editingUser && editingUser.dob) {
      const birthDate = dayjs(editingUser.dob);
      const age = dayjs().diff(birthDate, "year");

      if (age >= 16 && age <= 70) {
        setAgeInfo(`✓ Tuổi: ${age} (Hợp lệ)`);
      } else if (age < 16) {
        setAgeInfo(`✗ Tuổi: ${age} (Quá trẻ - Tối thiểu 16 tuổi)`);
      } else {
        setAgeInfo(`✗ Tuổi: ${age} (Quá già - Tối đa 70 tuổi)`);
      }
    } else {
      // Clear age info khi không có editingUser hoặc không có dob
      setAgeInfo("");
    }
  }, [editingUser]);

  // Clear age info when modal opens/closes
  useEffect(() => {
    if (isModalVisible && !editingUser) {
      // Khi mở modal tạo mới, clear age info
      setAgeInfo("");
    } else if (!isModalVisible) {
      // Khi đóng modal, clear age info
      setAgeInfo("");
    }
  }, [isModalVisible, editingUser]);

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
      initialValues={{
        isActive: true,
        // Không set ngày sinh và role mặc định - để user tự chọn
      }}
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
            extra={
              ageInfo && (
                <span
                  style={{
                    color: ageInfo.startsWith("✓") ? "#52c41a" : "#f5222d",
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                >
                  {ageInfo}
                </span>
              )
            }
            rules={[
              { required: true, message: "Vui lòng chọn ngày sinh!" },
              {
                validator: (_, value) => {
                  if (!value) {
                    setAgeInfo("");
                    return Promise.resolve();
                  }

                  const today = dayjs();
                  const birthDate = dayjs(value);
                  const age = today.diff(birthDate, "year");

                  // Cập nhật thông tin tuổi
                  if (age >= 0) {
                    setAgeInfo(`✓ Tuổi: ${age} (Hợp lệ)`);
                  }

                  // Kiểm tra ngày sinh không được trong tương lai
                  if (birthDate.isAfter(today)) {
                    setAgeInfo("✗ Ngày sinh không thể trong tương lai!");
                    return Promise.reject(
                      new Error("Ngày sinh không thể trong tương lai!")
                    );
                  }

                  // Kiểm tra tuổi từ 16-70
                  if (age < 16) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá trẻ - Tối thiểu 16 tuổi)`);
                    return Promise.reject(
                      new Error("Tuổi phải từ 16 trở lên!")
                    );
                  }

                  if (age > 70) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá già - Tối đa 70 tuổi)`);
                    return Promise.reject(new Error("Tuổi không được quá 70!"));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              size="large"
              className={styles.customDatePicker}
              suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
              disabledDate={(current) => {
                // Chỉ không cho chọn ngày tương lai
                const today = dayjs().endOf("day");
                return current && current > today;
              }}
              defaultPickerValue={dayjs().subtract(25, "year")} // Mặc định mở ở 25 tuổi
              showToday={false}
              allowClear
              onChange={(date) => {
                // Hàm validate age helper
                const validateAndSetAge = (dateValue: any) => {
                  if (!dateValue) {
                    setAgeInfo("");
                    return;
                  }

                  const age = dayjs().diff(dayjs(dateValue), "year");
                  const today = dayjs();
                  const birthDate = dayjs(dateValue);

                  console.log("Validating date:", dateValue, "Age:", age); // Debug

                  if (birthDate.isAfter(today)) {
                    setAgeInfo("✗ Ngày sinh không thể trong tương lai!");
                  } else if (age < 16) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá trẻ - Tối thiểu 16 tuổi)`);
                  } else if (age > 70) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá già - Tối đa 70 tuổi)`);
                  } else {
                    setAgeInfo(`✓ Tuổi: ${age} (Hợp lệ)`);
                  }
                };

                validateAndSetAge(date);
              }}
              onBlur={() => {
                // Validate lại khi user blur khỏi input (sau khi gõ trực tiếp)
                const currentValue = form.getFieldValue("dob");
                if (currentValue) {
                  const age = dayjs().diff(dayjs(currentValue), "year");
                  const today = dayjs();
                  const birthDate = dayjs(currentValue);

                  if (birthDate.isAfter(today)) {
                    setAgeInfo("✗ Ngày sinh không thể trong tương lai!");
                  } else if (age < 16) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá trẻ - Tối thiểu 16 tuổi)`);
                  } else if (age > 70) {
                    setAgeInfo(`✗ Tuổi: ${age} (Quá già - Tối đa 70 tuổi)`);
                  } else {
                    setAgeInfo(`✓ Tuổi: ${age} (Hợp lệ)`);
                  }
                }
              }}
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
              allowClear
              onChange={() => {
                // Clear dependent fields when role changes
                form.setFieldsValue({
                  managedBy: undefined,
                  positionCode: undefined,
                });
              }}
              options={[
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
