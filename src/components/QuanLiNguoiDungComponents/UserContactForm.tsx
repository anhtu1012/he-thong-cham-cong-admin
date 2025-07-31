/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "@/components/basicUI/FormModal";
import {
  FileOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Button, Modal, Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ContractFormView from "./ContractFormView";
import ContractHistoryModal from "./ContractHistoryModal";
import ContractViewMode from "./ContractViewMode";
import { ContractModalView, UserContactFormProps } from "./types";
import { UserContractItem } from "@/dtos/quan-li-nguoi-dung/contracts/contract.dto";

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
  handleUploadChange = () => {},
  isViewMode = false,
  contactData,
  ueserDetails,
  onSwitchToEditMode,
  selectedContactHistory = [],
}) => {
  console.log('UserContactForm props:', { fileList, contactData, editingContract });
  // Chuẩn hóa props để xử lý các tên khác nhau
  const modalVisible =
    isModalVisible !== undefined ? isModalVisible : isVisible ?? false;
  const cancelHandler = handleCancel || onCancel || (() => {});
  const isLoading = editLoading !== undefined ? editLoading : loading ?? false;

  // State quản lý chế độ xem
  const [currentViewMode, setCurrentViewMode] = useState<boolean>(isViewMode);
  // Thêm state để quản lý quá trình đồng bộ
  const [syncing, setSyncing] = useState<boolean>(true);

  // State quản lý modal lịch sử hợp đồng
  const [contractModalVisible, setContractModalVisible] =
    useState<boolean>(false);
  const [contractModalView, setContractModalView] =
    useState<ContractModalView>("history");
  const [selectedContract, setSelectedContract] =
    useState<UserContractItem | null>(null);

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

  // Functions for contract modal
  const handleShowContractHistory = () => {
    setContractModalView("history");
    setContractModalVisible(true);
  };

  const handleContractModalCancel = () => {
    setContractModalVisible(false);
    setContractModalView("history");
    setSelectedContract(null);
  };

  const handleViewContractDetail = (contract: UserContractItem) => {
    setSelectedContract(contract);
    setContractModalView("detail");
  };

  const handleBackToHistory = () => {
    setContractModalView("history");
    setSelectedContract(null);
  };

  /**
   * Xử lý chuyển đổi từ chế độ xem sang chế độ chỉnh sửa
   */
  const handleSwitchToEditMode = () => {
    if (!form || !contactData) return;

    // Điền trực tiếp dữ liệu vào form
    form.setFieldsValue({
      id: contactData.id || "", // Thêm id field quan trọng cho update
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
      contractPdf: contactData.contractPdf || undefined, // Add contractPdf field
    });

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

  const modalContent = currentViewMode ? (
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
      footer={[
        <Button
          key="history"
          type="default"
          icon={<HistoryOutlined />}
          onClick={handleShowContractHistory}
          style={{
            marginRight: "auto",
            borderColor: "#1890ff",
            color: "#1890ff",
          }}
        >
          Xem lịch sử hợp đồng
        </Button>,
        <Button key="cancel" onClick={cancelHandler ?? (() => {})}>
          Đóng
        </Button>,
      ]}
      centered
    >
      {isLoading ? (
        <div style={{ padding: "20px 0" }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : contactData ? (
        <ContractViewMode
          contactData={contactData}
          positions={positions}
          onSwitchToEditMode={handleSwitchToEditMode}
          onShowHistory={handleShowContractHistory}
        />
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
            {contactData?.id
              ? "Chỉnh sửa hợp đồng lao động"
              : "Thêm hợp đồng lao động mới"}
          </span>
        </div>
      }
      form={form!}
      open={modalVisible}
      onCancel={cancelHandler}
      onOk={
        handleSubmit
          ? () => handleSubmit(contactData?.id || undefined)
          : () => {}
      }
      okText={contactData?.id ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={900}
      loading={isLoading}
      centered
      maskClosable={false}
      destroyOnClose
      initialValues={{
        startTime: dayjs().startOf("day"),
        endTime: dayjs().add(1, "month").startOf("day"),
        duration: "1 tháng",
        userCode: ueserDetails?.code || "",
        status: "ACTIVE",
      }}
    >
      <ContractFormView
        form={form!}
        editingContract={contactData || editingContract}
        fileList={Array.isArray(fileList) ? fileList : []}
        positions={positions}
        branches={branches}
        handleUploadChange={handleUploadChange}
        ueserDetails={ueserDetails}
      />
    </FormModal>
  );

  // Render the main modal content with additional modals
  return (
    <>
      {modalContent}

      {/* Single Contract History Modal with multiple views */}
      <ContractHistoryModal
        visible={contractModalVisible}
        onCancel={handleContractModalCancel}
        contractHistory={selectedContactHistory}
        onViewDetail={handleViewContractDetail}
        view={contractModalView}
        selectedContract={selectedContract}
        onBackToHistory={handleBackToHistory}
      />
    </>
  );
};

export default UserContactForm;
