/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserInfor } from "@/dtos/auth/auth.dto";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const { TextArea } = Input;

interface UserContactFormProps {
  isViewMode: boolean;
  isVisible: boolean;
  onCancel: () => void;
  loading: boolean;
  contactData: any;
  positions: any[];
  branches: any[];
  form: any;
  ueserDetails?: UserInfor;
  onSwitchToEditMode: () => void;
  handleSubmit: () => void;
}

const UserContactForm = ({
  isViewMode,
  isVisible,
  onCancel,
  loading,
  contactData,
  positions,
  branches,
  form,
  ueserDetails,
  onSwitchToEditMode,
  handleSubmit,
}: UserContactFormProps) => {
  useEffect(() => {
    if (isVisible && contactData) {
      form.setFieldsValue({
        ...contactData,
        startTime: contactData.startTime ? dayjs(contactData.startTime) : null,
        endTime: contactData.endTime ? dayjs(contactData.endTime) : null,
      });
    } else if (isVisible && ueserDetails) {
      form.setFieldsValue({
        userCode: ueserDetails.code,
        userName: `${ueserDetails.firstName} ${ueserDetails.lastName}`,
      });
    }
  }, [isVisible, contactData, ueserDetails, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = () => {
    if (isViewMode) {
      onSwitchToEditMode();
    } else {
      handleSubmit();
    }
  };

  return (
    <Modal
      title={
        isViewMode
          ? "Xem thông tin hợp đồng"
          : contactData?.id
          ? "Chỉnh sửa hợp đồng"
          : "Thêm mới hợp đồng"
      }
      open={isVisible}
      onCancel={handleCancel}
      width={800}
      footer={
        isViewMode
          ? [
              <Button key="edit" type="primary" onClick={onSwitchToEditMode}>
                Chỉnh sửa
              </Button>,
              <Button key="cancel" onClick={handleCancel}>
                Đóng
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={handleCancel}>
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                {contactData?.id ? "Cập nhật" : "Thêm mới"}
              </Button>,
            ]
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
        initialValues={{
          userCode: ueserDetails?.code,
          userName: ueserDetails
            ? `${ueserDetails.firstName} ${ueserDetails.lastName}`
            : "",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="userCode"
              label="Mã nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userName"
              label="Tên nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contractType"
              label="Loại hợp đồng"
              rules={[{ required: true, message: "Vui lòng chọn loại hợp đồng!" }]}
            >
              <Select
                placeholder="Chọn loại hợp đồng"
                options={[
                  { value: "FULL_TIME", label: "Toàn thời gian" },
                  { value: "PART_TIME", label: "Bán thời gian" },
                  { value: "INTERNSHIP", label: "Thực tập" },
                  { value: "CONTRACT", label: "Hợp đồng" },
                ]}
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
                options={positions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Ngày kết thúc"
              rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="salary"
              label="Lương cơ bản"
              rules={[{ required: true, message: "Vui lòng nhập lương cơ bản!" }]}
            >
              <Input
                type="number"
                placeholder="Nhập lương cơ bản"
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="branchCode"
              label="Chi nhánh"
              rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
            >
              <Select
                placeholder="Chọn chi nhánh"
                options={branches}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả hợp đồng"
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "INACTIVE", label: "Không hoạt động" },
                  { value: "EXPIRED", label: "Hết hạn" },
                  { value: "TERMINATED", label: "Chấm dứt" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserContactForm; 