/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, Space, Tooltip, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export interface ActionButtonProps {
  record?: any;
  onAdd?: () => void;
  onView?: (record: any) => void;
  onUpdate?: (record: any) => void;
  onDelete?: (record: any) => void;
  tooltips?: {
    add?: string;
    view?: string;
    update?: string;
    delete?: string;
  };
  size?: "small" | "middle" | "large";
  className?: string;
  vertical?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  record,
  onAdd,
  onView,
  onUpdate,
  onDelete,
  tooltips = {
    add: "Thêm mới",
    view: "Xem chi tiết",
    update: "Chỉnh sửa",
    delete: "Xóa",
  },
  size = "small",
  className = "",
  vertical = false,
}) => {
  return (
    <Space
      size="small"
      direction={vertical ? "vertical" : "horizontal"}
      className={className}
    >
      {onAdd && (
        <Tooltip title={tooltips.add}>
          <Button
            type="primary"
            style={{ height: "30px" }}
            icon={<PlusOutlined />}
            size={size}
            onClick={() => onAdd()}
          >
            Thêm mới
          </Button>
        </Tooltip>
      )}

      {onView && record && (
        <Tooltip title={tooltips.view}>
          <Button
            type="default"
            icon={<EyeOutlined />}
            size={size}
            onClick={() => onView(record)}
          />
        </Tooltip>
      )}

      {onUpdate && record && (
        <Tooltip title={tooltips.update}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size={size}
            onClick={() => onUpdate(record)}
          />
        </Tooltip>
      )}

      {onDelete && record && (
        <Popconfirm
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa mục này không?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => onDelete(record)}
        >
          <Button danger icon={<DeleteOutlined />} size={size} />
        </Popconfirm>
      )}
    </Space>
  );
};

export default ActionButton;
