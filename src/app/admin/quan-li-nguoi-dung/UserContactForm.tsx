/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import {
  BankOutlined,
  CalendarOutlined,
  FileOutlined,
  FileTextOutlined,
  PlusOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styles from "../../../components/styles/styles.module.scss";
import { UserContractItem } from "@/dtos/quan-li-nguoi-dung/contracts/contract.dto";

const { Option } = Select;
const { TextArea } = Input;

interface UserContactFormProps {
  form?: FormInstance;
  editingContract?: any | null;
  isModalVisible?: boolean;
  isVisible?: boolean; // Thêm để hỗ trợ cách gọi trong page.tsx
  handleCancel?: () => void;
  onCancel?: () => void; // Thêm để hỗ trợ cách gọi trong page.tsx
  handleSubmit?: () => void;
  editLoading?: boolean;
  loading?: boolean; // Thêm để hỗ trợ cách gọi trong page.tsx
  fileList?: UploadFile[];
  positions?: { label: string; value: string }[];
  branches?: { label: string; value: string }[];
  managers?: { label: string; value: string }[];
  handleUploadChange?: (info: any) => void;
  isViewMode?: boolean;
  contactData?: UserContractItem;
  onSwitchToEditMode?: () => void; // Prop để thông báo cho component cha
}

const UserContactForm: React.FC<UserContactFormProps> = ({
  form,
  editingContract,
  isModalVisible,
  isVisible,
  handleCancel,
  onCancel,
  handleSubmit,
  editLoading,
  loading,
  fileList = [],
  positions = [],
  branches = [],
  managers = [],
  handleUploadChange = () => {},
  isViewMode = false,
  contactData,
  onSwitchToEditMode,
}) => {
  // Chuẩn hóa props để xử lý các tên khác nhau
  const modalVisible =
    isModalVisible !== undefined ? isModalVisible : isVisible ?? false;
  const cancelHandler = handleCancel || onCancel || (() => {});
  const isLoading = editLoading !== undefined ? editLoading : loading ?? false;

  // State cho các chi nhánh được chọn
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    editingContract?.branchCodes || []
  );

  // State quản lý chế độ xem
  const [currentViewMode, setCurrentViewMode] = useState<boolean>(isViewMode);
  // Thêm state để quản lý quá trình đồng bộ
  const [syncing, setSyncing] = useState<boolean>(true);

  // Đồng bộ hóa state khi props thay đổi
  useEffect(() => {
    setSyncing(true);

    // Sử dụng setTimeout để đảm bảo đồng bộ xong mới cập nhật giao diện
    const timer = setTimeout(() => {
      setCurrentViewMode(isViewMode);

      // Reset form khi chế độ hoặc trạng thái hiển thị thay đổi
      if (form && (isViewMode || !modalVisible)) {
        form.resetFields();
      }

      setSyncing(false);
    }, 100); // Thêm độ trễ nhỏ để đảm bảo đồng bộ

    return () => clearTimeout(timer);
  }, [isViewMode, modalVisible, form]);

  /**
   * Tính toán thời hạn hợp đồng khi ngày bắt đầu hoặc kết thúc thay đổi
   */
  const calculateDuration = () => {
    const startTime = form?.getFieldValue("startTime");
    const endTime = form?.getFieldValue("endTime");

    if (startTime && endTime) {
      const start = dayjs(startTime);
      const end = dayjs(endTime);
      const years = end.diff(start, "year");
      const months = end.diff(start, "month") % 12;

      let duration = "";
      if (years > 0) {
        duration += `${years} năm `;
      }
      if (months > 0) {
        duration += `${months} tháng`;
      }

      form?.setFieldsValue({ duration: duration.trim() });
    }
  };

  /**
   * Lấy tên chức vụ từ mã chức vụ
   */
  const getPositionName = (positionCode: string) => {
    const position = positions.find((p) => p.value === positionCode);
    return position ? position.label : positionCode;
  };

  /**
   * Nút tải lên cho chức năng upload
   */
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  /**
   * Xử lý chuyển đổi từ chế độ xem sang chế độ chỉnh sửa
   * Đã được tối ưu để loại bỏ xử lý thừa
   */
  const handleSwitchToEditMode = () => {
    if (!form || !contactData) return;

    // Điền trực tiếp dữ liệu vào form
    form.setFieldsValue({
      title: contactData.title || "",
      code: contactData.code || "",
      status: contactData.status || "ACTIVE",
      description: contactData.description || "",
      startTime: contactData.startTime,
      endTime: contactData.endTime,
      duration: contactData.duration || "",
      userCode: contactData.userCode || "",
      positionCode: contactData.positionCode || "",
      managedBy: contactData.managedBy || "",
      branchCodes: contactData.branchCodes || [],
    });

    // Cập nhật chi nhánh đã chọn nếu có
    if (contactData.branchCodes?.length > 0) {
      setSelectedBranches(contactData.branchCodes);
    }

    // Cập nhật chế độ xem
    setCurrentViewMode(false);

    // Thông báo cho component cha
    if (onSwitchToEditMode) {
      onSwitchToEditMode();
    }
  };

  // Hiển thị modal dựa trên chế độ xem và trạng thái đồng bộ
  if (syncing) {
    return null; // Không hiển thị gì khi đang đồng bộ
  }

  return currentViewMode ? (
    // Chế độ xem thông tin hợp đồng
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: 600,
            color: "#1890ff",
          }}
        >
          <FileOutlined style={{ marginRight: 8 }} />
          Thông tin hợp đồng
        </div>
      }
      open={modalVisible}
      onCancel={cancelHandler ?? (() => {})}
      width={700}
      footer={null}
      centered
    >
      {isLoading ? (
        <div style={{ padding: "20px 0" }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : contactData ? (
        <div className="contract-details" style={{ padding: "10px 0" }}>
          <div
            className="contract-header"
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ margin: 0, color: "#1890ff" }}>
              {contactData.title.toUpperCase() || "Thông tin hợp đồng"}
            </h2>
            <p style={{ margin: "5px 0 0" }}>Mã hợp đồng: {contactData.code}</p>
          </div>

          <Row gutter={[24, 16]} style={{ marginBottom: "16px" }}>
            <Col span={24}>
              <div
                className="section-title"
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                Thông tin nhân viên
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Nhân viên:
                </div>
                <div className="value" style={{ fontWeight: 600 }}>
                  {contactData.fullName}
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Chức vụ:
                </div>
                <div className="value">
                  {getPositionName(contactData.positionCode)}
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Ngày bắt đầu:
                </div>
                <div className="value">
                  {dayjs(contactData.startTime).format("DD/MM/YY HH:mm:ss")}
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Ngày kết thúc:
                </div>
                <div className="value">
                  {" "}
                  {dayjs(contactData.endTime).format("DD/MM/YY HH:mm:ss")}
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Thời hạn:
                </div>
                <div className="value">
                  {contactData.duration || "Không xác định"}
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Quản lý bởi:
                </div>
                <div className="value">
                  {contactData.managedBy || "Chưa có quản lý"}
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={24}>
              <div
                className="section-title"
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                Chi tiết hợp đồng
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Lương cơ bản:
                </div>
                <div
                  className="value"
                  style={{ fontWeight: 600, color: "#d4380d" }}
                >
                  5.000.000 VNĐ
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Trạng thái:
                </div>
                <div className="value">
                  <Tag
                    color="green"
                    style={{
                      borderRadius: "12px",
                      padding: "0 8px",
                    }}
                  >
                    {contactData.status}
                  </Tag>
                </div>
              </div>
            </Col>

            <Col span={24}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Chi nhánh làm việc:
                </div>
                <div className="value">
                  <Tag
                    key={contactData.userCode}
                    color="blue"
                    style={{
                      borderRadius: "12px",
                      padding: "0 8px",
                      margin: "2px",
                    }}
                  >
                    <BankOutlined style={{ marginRight: 5 }} />
                    {contactData.branchNames || "Chưa xác định"}
                  </Tag>
                </div>
              </div>
            </Col>

            <Col span={24}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Mô tả:
                </div>
                <div
                  className="value"
                  style={{
                    color: "#666",
                    padding: "8px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                  }}
                >
                  {contactData.description || "Không có mô tả"}
                </div>
              </div>
            </Col>

            {contactData.contractPdf && (
              <Col span={24}>
                <div className="info-item">
                  <div
                    className="label"
                    style={{ color: "#888", fontSize: "13px" }}
                  >
                    Tệp hợp đồng:
                  </div>
                  <div className="value">
                    <Button
                      type="link"
                      icon={<FileOutlined />}
                      onClick={() =>
                        window.open(contactData.contractPdf, "_blank")
                      }
                    >
                      Xem hợp đồng
                    </Button>
                  </div>
                </div>
              </Col>
            )}

            <Col span={24}>
              <div className="info-item">
                <div
                  className="label"
                  style={{ color: "#888", fontSize: "13px" }}
                >
                  Ghi chú:
                </div>
                <div
                  className="value"
                  style={{ fontStyle: "italic", color: "#666" }}
                >
                  Hợp đồng lao động được lập thành 02 bản, người lao động giữ 01
                  bản, đơn vị sử dụng lao động giữ 01 bản.
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleSwitchToEditMode}
                >
                  Cập nhật
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}
    </Modal>
  ) : (
    // Chế độ chỉnh sửa/thêm mới hợp đồng
    <FormModal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FileTextOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
          <span>
            {editingContract || contactData
              ? "Chỉnh sửa hợp đồng lao động"
              : "Thêm hợp đồng lao động mới"}
          </span>
        </div>
      }
      form={form!}
      open={modalVisible}
      onCancel={cancelHandler}
      onOk={handleSubmit || (() => {})}
      okText={editingContract || contactData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={900}
      loading={isLoading}
      centered
      maskClosable={false}
      destroyOnClose
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Tiêu đề hợp đồng"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="Nhập tiêu đề hợp đồng"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              size="large"
              dropdownStyle={{ borderRadius: "10px" }}
            >
              <Option value="ACTIVE">Đang hiệu lực</Option>
              <Option value="EXPIRED">Hết hạn</Option>
              <Option value="TERMINATED">Đã chấm dứt</Option>
              <Option value="PENDING">Chờ xác nhận</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="Mô tả">
            <TextArea
              placeholder="Nhập mô tả về hợp đồng"
              rows={4}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="startTime"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
              size="large"
              className={styles.customDatePicker}
              suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
              onChange={calculateDuration}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endTime"
            label="Ngày kết thúc"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày kết thúc"
              size="large"
              className={styles.customDatePicker}
              suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
              onChange={calculateDuration}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="duration" label="Thời hạn">
            <Input disabled size="large" placeholder="Thời hạn hợp đồng" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="userCode"
            label="Mã nhân viên"
            rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập mã nhân viên"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="positionCode"
            label="Chức vụ"
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          >
            <Select
              placeholder="Chọn chức vụ"
              size="large"
              options={positions}
              dropdownStyle={{ borderRadius: "10px" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="userBranchCode"
            label="Chi nhánh chính"
            rules={[
              { required: true, message: "Vui lòng chọn chi nhánh chính!" },
            ]}
          >
            <Select
              placeholder="Chọn chi nhánh chính"
              size="large"
              options={branches}
              dropdownStyle={{ borderRadius: "10px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="managedBy"
            label="Quản lý bởi"
            rules={[
              { required: true, message: "Vui lòng chọn người quản lý!" },
            ]}
          >
            <Select
              placeholder="Chọn người quản lý"
              size="large"
              allowClear
              options={managers}
              dropdownStyle={{ borderRadius: "10px" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="branchCodes"
            label="Chi nhánh làm việc"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một chi nhánh!",
              },
            ]}
          >
            <Select
              placeholder="Chọn các chi nhánh làm việc"
              size="large"
              mode="multiple"
              options={branches}
              dropdownStyle={{ borderRadius: "10px" }}
              value={selectedBranches}
              onChange={(values) => setSelectedBranches(values)}
              tagRender={(props) => {
                const { label, closable, onClose } = props;
                return (
                  <Tag
                    color="blue"
                    closable={closable}
                    onClose={onClose}
                    style={{ marginRight: 3 }}
                  >
                    <BankOutlined style={{ marginRight: 5 }} />
                    {label}
                  </Tag>
                );
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="contractPdf"
            label="Tệp hợp đồng"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
              className={styles.contractUpload}
              accept=".pdf"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          {editingContract?.contractPdf && (
            <Button
              type="link"
              icon={<FileOutlined />}
              onClick={() => window.open(editingContract.contractPdf, "_blank")}
            >
              Xem hợp đồng
            </Button>
          )}
        </Col>
      </Row>
    </FormModal>
  );
};

export default UserContactForm;
