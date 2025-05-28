/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import Cselect from "@/components/Cselect";
import { UserInfor } from "@/dtos/auth/auth.dto";
import { UserRequestUpdateUsser } from "@/dtos/auth/auth.request.dto";
import { UserResponseGetItem } from "@/dtos/auth/auth.response.dto";
import { RoleAdmin } from "@/model/enum";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";
import AuthServices from "@/services/auth/api.service";
import SelectServices from "@/services/select/select.service";
import { getChangedValues } from "@/utils/client/compareHelpers";
import { handleFormErrors } from "@/utils/client/formHelpers";
import { CalendarOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Space, Switch, Tag } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../../components/styles/styles.module.scss";
import UserForm from "./UserForm";

interface FormValues {
  role?: string;
  positionCode?: string;
  branchCode?: string;
  isActive: boolean;
}

const QuanLiNhanVienPage = () => {
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [formFilter] = Form.useForm<FormValues>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tableData, setTableData] = useState<UserResponseGetItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Watch for role changes in the form
  const selectedRole = Form.useWatch("role", formFilter);

  // Load positions when role changes
  useEffect(() => {
    if (selectedRole) {
      loadPositionsByRole(selectedRole);
    }
  }, [selectedRole]);

  const fetchFiter = async () => {
    try {
      const brand = await SelectServices.getSelectBrand();
      if (brand) {
        setBrands(brand);
      } else {
        toast.error("Tải dữ liệu chi nhánh thất bại!");
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  // New function to load positions by role
  const loadPositionsByRole = async (roleCode: string) => {
    try {
      const positionsData = await SelectServices.getSelectPositionByRole(
        roleCode
      );
      if (positionsData) {
        setPositions(positionsData);
      } else {
        setPositions([]);
        toast.error("Tải dữ liệu chức vụ thất bại!");
      }
    } catch (error) {
      console.error("Error loading positions by role:", error);
      setPositions([]);
      toast.error("Lỗi khi tải danh sách chức vụ");
    }
  };

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string,
    value: FormValues = { isActive: true }
  ) => {
    setLoading(true);
    try {
      const searchOwnweFilter: any = [
        { key: "limit", type: "=", value: limit },
        { key: "offset", type: "=", value: (page - 1) * limit },
      ];

      const result: any = await QlNguoiDungServices.getUser(searchOwnweFilter, {
        ...(quickkSearch ? { quickSearch: quickSearch } : {}),
        ...(value.role ? { role: value.role } : {}),
        ...(value.positionCode ? { positionCode: value.positionCode } : {}),
        ...(value.branchCode ? { branchCode: value.branchCode } : {}),
        ...(typeof value.isActive === "boolean"
          ? { isActive: value.isActive }
          : {}),
      });

      if (result.data) {
        setTableData(result.data);
        setTotalItems(result.count || 0);
      } else {
        toast.error(result.message || "Tải dữ liệu thất bại!");
      }
      if (result && result.data) {
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiter();
    getData(currentPage, pageSize, quickSearch);
  }, []); // Reload data when page or size changes

  const handleBeforeExport = async (): Promise<UserInfor[]> => {
    setLoading(true);
    try {
      const searchOwnweFilterExport: any = [
        {
          key: "limit",
          type: "=",
          value: process.env.NEXT_PUBLIC_LIMIT_QUERY_EXPORT,
        },
        { key: "offset", type: "=", value: 0 },
      ];
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");
      const resultExport: any = await QlNguoiDungServices.getUser(
        searchOwnweFilterExport,
        {
          ...(quickSearch ? { quickSearch: quickSearch } : {}),
          ...(formFilter.getFieldValue("role")
            ? { role: formFilter.getFieldValue("role") }
            : {}),
          ...(formFilter.getFieldValue("positionCode")
            ? { positionCode: formFilter.getFieldValue("positionCode") }
            : {}),
          ...(formFilter.getFieldValue("branchCode")
            ? { branchCode: formFilter.getFieldValue("branchCode") }
            : {}),
          ...(typeof formFilter.getFieldValue("isActive") === "boolean"
            ? { isActive: formFilter.getFieldValue("isActive") }
            : {}),
        }
      );

      if (resultExport.data) {
        return resultExport.data;
      } else {
        toast.error("Không thể tải dữ liệu để xuất Excel!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Lỗi khi tải dữ liệu để xuất Excel!");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const columns = useMemo(
    () => [
      {
        title: "Họ và tên",
        dataIndex: "lastName",
        key: "lastName",
        width: 150,
        render: (text: string, record: any) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{`${record.firstName} ${text}`}</span>
          </div>
        ),
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "userName",
        key: "userName",
        width: 120,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 150,
      },
      {
        title: "Chi nhánh",
        dataIndex: "branchCode",
        key: "branchCode",
        width: 150,
        render: (branchCode: string) => {
          const branch = brands.find((item) => item.value === branchCode);
          return <span>{branch ? branch.label : branchCode}</span>;
        },
      },
      {
        title: "Chức vụ",
        dataIndex: "positionCode",
        key: "positionCode",
        width: 180,
        render: (positionCode: string) => {
          const position = positions.find(
            (item) => item.value === positionCode
          );
          return <span>{position ? position.label : positionCode}</span>;
        },
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
        width: 150,
        render: (role: string) => {
          const style = getRoleBadgeStyle(role);

          return (
            <Tag
              style={{
                ...style,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {role === RoleAdmin.ADMIN
                ? "Admin"
                : role === RoleAdmin.HR
                ? "HR"
                : role === RoleAdmin.MANAGER
                ? "Manager"
                : "Staff"}
            </Tag>
          );
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        width: 120,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 200,
      },
      {
        title: "Ngày sinh",
        dataIndex: "bod",
        key: "bod",
        render: (text: string) => {
          return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
        },
      },
      {
        title: "Hợp đồng",
        dataIndex: "contact",
        key: "contact",
        width: 150,
      },

      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive: boolean) => {
          return (
            <Tag
              color={isActive ? "success" : "error"}
              style={{
                borderRadius: "20px",
                padding: "4px 12px",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {isActive ? "Hoạt động" : "Tạm khóa"}
            </Tag>
          );
        },
      },
    ],
    [brands, positions]
  );

  const showModal = async (
    user: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form and file list before opening the modal
    form.resetFields();
    setFileList([]);

    // Set editing user state
    setEditingUser(user);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (user && action === "update") {
      // Load positions for the selected role before setting form values
      if (user.roleCode) {
        await loadPositionsByRole(user.roleCode);
      }

      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...user,
          // Convert date string to dayjs object for DatePicker
          bod: user.bod ? dayjs(user.bod) : null,
        });
      }, 100);
    } else {
      // For add action - set default values
      const defaultRole = "R1"; // Default to Staff

      // Load positions for the default role
      await loadPositionsByRole(defaultRole);

      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          roleCode: defaultRole,
          isActive: true,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingUser) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        values.faceImg = fileList[0]?.url || null; // Handle file upload
        if (values.bod) {
          values.bod = new Date(values.bod).toISOString();
        }
        const changedValues = getChangedValues(values, editingUser);

        // Check if there are any changes
        if (Object.keys(changedValues).length === 0) {
          toast.info("Không có thông tin nào được thay đổi!");
          setEditLoading(false);
          setIsModalVisible(false); // Close the modal even if no changes
          return;
        }

        const result: any = await QlNguoiDungServices.updateUser(
          editingUser.id,
          changedValues
        );
        if (result) {
          toast.success("Cập nhật thành công!");
          getData(currentPage, pageSize, quickSearch); // Refresh data after updating
          setIsModalVisible(false); // Close the modal upon success
        } else {
          toast.error(result.message || "Cập nhật thất bại!");
        }
      } catch (error: any) {
        handleFormErrors<UserRequestUpdateUsser>(form, error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        }
      } finally {
        setEditLoading(false);
      }
    } else {
      // Handle add new user
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        console.log("Form values:", values);
        if (values.bod) {
          values.bod = new Date(values.bod).toISOString();
        }

        const result: any = await AuthServices.register(values);
        if (result) {
          toast.success("Thêm mới thành công!");
          getData(currentPage, pageSize, quickSearch); // Refresh data after adding
          setIsModalVisible(false);
          form.resetFields();
        } else {
          toast.error(result.message || "Thêm mới thất bại!");
        }
      } catch (error: any) {
        console.log("Form validation error:", error);

        // Use improved error handling function and check if it handled any specific errors
        handleFormErrors<UserRequestUpdateUsser>(form, error);

        if (error.response && error.response.data) {
          console.log("API error:", error.response.data);

          handleFormErrors<UserRequestUpdateUsser>(form, error.response.data);
        }
      } finally {
        setEditLoading(false);
      }
    }
  };

  const handleDelete = async (record: any) => {
    try {
      await QlNguoiDungServices.deleteUser(record.id);
      toast.success("Xóa thành công!");
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Get role badge style
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

  // Define action column for our table using the new ActionButton component
  const actionColumn = useMemo(
    () => ({
      render: (record: any) => (
        <ActionButton
          record={record}
          onUpdate={() => showModal(record, "update")}
          onDelete={() => handleDelete(record)}
          tooltips={{
            view: "Xem thông tin chi tiết",
            update: "Chỉnh sửa thông tin người dùng",
            delete: "Xóa người dùng",
          }}
        />
      ),
    }),
    []
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    getData(page, size, quickSearch, formFilter.getFieldsValue());
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values: FormValues) => {
    getData(currentPage, pageSize, quickSearch, values);
  };
  const resetFilters = () => {
    form.resetFields();
  };
  return (
    <>
      {" "}
      {/* Filter Section with collapsible UI */}
      <Form form={formFilter} onFinish={onFinish} className="from-quey">
        <FilterSection onReset={resetFilters}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="role">
                <Cselect
                  allowClear
                  showSearch
                  label="Quyền"
                  options={[
                    { value: RoleAdmin.HR, label: "HR" },
                    { value: RoleAdmin.STAFF, label: "Staff" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="positionCode">
                <Cselect
                  label="Chức vụ"
                  allowClear
                  showSearch
                  options={positions}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="branchCode">
                <Cselect
                  label="Chi nhánh"
                  allowClear
                  showSearch
                  options={brands}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item
                name="isActive"
                valuePropName="checked"
                label="Trạng thái"
                initialValue={true}
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Tạm khóa"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" className={styles.actionButtonsRow}>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          </Row>
        </FilterSection>
      </Form>
      <div>
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
              onChange={(e) => {
                setQuickSearch(e.target.value);
                getData(currentPage, pageSize, e.target.value);
              }}
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
              onAdd={() => showModal(null, "add")}
              tooltips={{
                add: "Thêm người dùng mới",
              }}
            />
          </div>
        </div>

        <Ctable
          loading={loading}
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          usePagination
          totalItems={totalItems}
          onPageChange={handlePageChange}
          enableDrag={true}
          pageSize={10}
          rowHeight={15}
          showActions
          actionColumn={actionColumn}
          stickyHeader
          tableId="admin_quan_li_nguoi_dung"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <UserForm
        form={form}
        editingUser={editingUser}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
        fileList={fileList}
        brands={brands}
        positions={positions}
        handleUploadChange={handleUploadChange}
      />
    </>
  );
};

export default QuanLiNhanVienPage;
