"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { RoleAdmin } from "@/model/enum";
import { Form, Tag, Avatar } from "antd";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import QuanLiNhanVienForm from "./quan-li-nhan-vien";

interface Employee {
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

// Mock data
const mockEmployees: Employee[] = [
  {
    code: "EMP001",
    username: "mile",
    email: "mile@gmail.com",
    phoneNumber: "0987654321",
    firstName: "Le",
    lastName: "Minh",
    dob: "1990-01-01",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    gender: "male",
    typeOfWork: "fulltime",
    isActive: true,
    addressCode: "HN001",
    positionCode: "CEO",
    managedBy: "mile",
    roleCode: RoleAdmin.ADMIN,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    code: "EMP002",
    username: "jane",
    email: "jane@gmail.com",
    phoneNumber: "0987654322",
    firstName: "Jane",
    lastName: "Smith",
    dob: "1992-05-15",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    gender: "female",
    typeOfWork: "parttime",
    isActive: false,
    addressCode: "SG001",
    positionCode: "DEV",
    managedBy: "mile",
    roleCode: RoleAdmin.STAFF,
    createdAt: "2023-02-01",
    updatedAt: "2023-07-01",
  },
];

const mockPositions = [
  { label: "CEO", value: "CEO" },
  { label: "DEV", value: "DEV" },
  { label: "HR", value: "HR" },
];
const mockManagers = [
  { label: "mile", value: "mile" },
  { label: "jane", value: "jane" },
];

const EmployeeManagementPage = () => {
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm<Employee>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<Employee[]>(mockEmployees);
  const [totalItems, setTotalItems] = useState<number>(mockEmployees.length);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
        width: 60,
        align: "center" as const,
        render: (_: unknown, __: Employee, index: number) => index + 1,
      },
      {
        title: "Mã nhân viên",
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: "Họ và tên",
        key: "fullName",
        width: 160,
        render: (_: unknown, record: Employee) =>
          `${record.firstName} ${record.lastName}`,
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
        width: 120,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 180,
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: 120,
      },
      {
        title: "Ngày sinh",
        dataIndex: "dob",
        key: "dob",
        width: 120,
      },
      {
        title: "Ảnh đại diện",
        dataIndex: "avatar",
        key: "avatar",
        width: 100,
        render: (avatar: string) => <Avatar src={avatar} />,
      },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        width: 100,
        render: (gender: string) => (gender === "male" ? "Nam" : "Nữ"),
      },
      {
        title: "Loại công việc",
        dataIndex: "typeOfWork",
        key: "typeOfWork",
        width: 120,
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        width: 120,
        render: (isActive: boolean) => (
          <Tag
            color={isActive ? "success" : "error"}
            style={{
              borderRadius: 20,
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {isActive ? "Hoạt động" : "Tạm khóa"}
          </Tag>
        ),
      },
      {
        title: "Địa chỉ",
        dataIndex: "addressCode",
        key: "addressCode",
        width: 120,
      },
      {
        title: "Chức vụ",
        dataIndex: "positionCode",
        key: "positionCode",
        width: 120,
      },
      {
        title: "Người quản lý",
        dataIndex: "managedBy",
        key: "managedBy",
        width: 120,
      },
      {
        title: "Quyền",
        dataIndex: "roleCode",
        key: "roleCode",
        width: 120,
        render: (role: string) => {
          const style = getRoleBadgeStyle(role);
          return (
            <Tag
              style={{
                ...style,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {getRoleLabel(role)}
            </Tag>
          );
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 120,
      },
      {
        title: "Công cụ",
        key: "action",
        width: 120,
        render: (_: unknown, record: Employee) => (
          <ActionButton
            record={record}
            onUpdate={() => showModal(record)}
            onDelete={() => handleDelete(record)}
            tooltips={{
              update: "Chỉnh sửa thông tin nhân viên",
              delete: "Xóa nhân viên",
            }}
          />
        ),
      },
    ],
    []
  );

  const showModal = (employee: Employee | null = null) => {
    setEditingEmployee(employee);
    if (employee) {
      form.setFieldsValue(employee);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      setEditLoading(true);
      const values = await form.validateFields();

      if (!editingEmployee) {
        // Tạo mới: thêm vào tableData
        const newEmployee = {
          ...values,
          code: `EMP${tableData.length + 1}`.padStart(6, "0"), // sinh mã code ảo
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        setTableData([newEmployee, ...tableData]);
        setTotalItems(totalItems + 1);
        toast.success("Thêm nhân viên mới thành công!");
      } else {
        // Sửa: cập nhật lại tableData
        const updated = tableData.map((item) =>
          item.code === editingEmployee.code ? { ...item, ...values } : item
        );
        setTableData(updated);
        toast.success("Cập nhật nhân viên thành công!");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch {
      // do nothing
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (record: Employee) => {
    try {
      console.log("Deleting employee:", record);
      // Xóa nhân viên khỏi danh sách hiển thị
      setTableData(tableData.filter((item) => item.code !== record.code));
      setTotalItems(totalItems - 1);
      toast.success("Xóa nhân viên thành công!");
    } catch {
      toast.error("Xóa nhân viên thất bại!");
    }
  };

  const handleSearch = (value: string) => {
    setQuickSearch(value);
    setLoading(true);
    setCurrentPage(1);
    const filteredData = mockEmployees.filter(
      (employee) =>
        employee.username.toLowerCase().includes(value.toLowerCase()) ||
        employee.email.toLowerCase().includes(value.toLowerCase()) ||
        employee.firstName.toLowerCase().includes(value.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(value.toLowerCase()) ||
        employee.phoneNumber.includes(value)
    );
    setTableData(filteredData);
    setTotalItems(filteredData.length);
    setLoading(false);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case RoleAdmin.ADMIN:
        return {
          color: "#991b1b",
          background: "#fee2e2",
          borderColor: "#fecaca",
        };
      case RoleAdmin.HR:
        return {
          color: "#5b21b6",
          background: "#ede9fe",
          borderColor: "#ddd6fe",
        };
      case RoleAdmin.MANAGER:
        return {
          color: "#0369a1",
          background: "#e0f2fe",
          borderColor: "#bae6fd",
        };
      default:
        return {
          color: "#065f46",
          background: "#d1fae5",
          borderColor: "#a7f3d0",
        };
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case RoleAdmin.ADMIN:
        return "Admin";
      case RoleAdmin.HR:
        return "HR";
      case RoleAdmin.MANAGER:
        return "Quản lý";
      default:
        return "Nhân viên";
    }
  };

  return (
    <div className="p-6">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ width: "20%" }}>
          <CInputLabel
            label="Tìm kiếm..."
            value={quickSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <ActionButton
            onAdd={() => showModal(null)}
            tooltips={{
              add: "Thêm nhân viên mới",
            }}
          />
        </div>
      </div>
      <Ctable
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handlePageChange,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} nhân viên`,
        }}
      />
      <QuanLiNhanVienForm
        form={form}
        editingData={editingEmployee}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
        positions={mockPositions}
        managers={mockManagers}
      />
    </div>
  );
};

export default EmployeeManagementPage;
