/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { RoleAdmin } from "@/model/enum";
import { getChangedValues } from "@/utils/client/compareHelpers";
import { handleFormErrors } from "@/utils/client/formHelpers";
import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DonForm from "./DonForm";
import { useTranslations } from "next-intl";

// Sample data interface for Don
interface DonItem {
  id: string;
  code: string;
  title: string;
  description: string | null;
  rolePermission: string;
}

// Map rolePermission values to display labels
const getRolePermissionLabel = (roleCode: string): string => {
  switch (roleCode) {
    case RoleAdmin.ADMIN:
      return "Admin";
    case RoleAdmin.HR:
      return "HR";
    case RoleAdmin.MANAGER:
      return "Manager";
    case RoleAdmin.STAFF:
      return "Staff";
    default:
      return roleCode;
  }
};

const DanhMucDonManagementPage = () => {
  const t = useTranslations("DanhMucDon");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucDon, setEditingDanhMucDon] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<DonItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Sample data
  const sampleData: DonItem[] = [
    {
      id: "1",
      code: "DON001",
      title: "Đơn xin nghỉ phép",
      description: "Đơn xin nghỉ phép có lương",
      rolePermission: RoleAdmin.MANAGER,
    },
    {
      id: "2",
      code: "DON002",
      title: "Đơn xin tăng ca",
      description: "Đơn xin làm thêm giờ",
      rolePermission: RoleAdmin.HR,
    },
    {
      id: "3",
      code: "DON003",
      title: "Đơn xin nghỉ không lương",
      description: "Đơn xin nghỉ không lương",
      rolePermission: RoleAdmin.ADMIN,
    },
  ];

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string
  ) => {
    setLoading(true);
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        let filteredData = [...sampleData];

        // Apply quick search filter if provided
        if (quickkSearch && quickkSearch.trim() !== "") {
          const searchTerm = quickkSearch.toLowerCase();
          filteredData = filteredData.filter(
            (item) =>
              item.code.toLowerCase().includes(searchTerm) ||
              item.title.toLowerCase().includes(searchTerm) ||
              (item.description &&
                item.description.toLowerCase().includes(searchTerm))
          );
        }

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setTableData(paginatedData);
        setTotalItems(filteredData.length);
        setLoading(false);
      }, 500); // Simulate network delay
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, []); // Reload data when page or size changes

  const handleBeforeExport = async (): Promise<DonItem[]> => {
    setLoading(true);
    try {
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");

      // Simulate API call for export
      return new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          resolve(sampleData);
        }, 500);
      });
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Lỗi khi tải dữ liệu để xuất Excel!");
      setLoading(false);
      return [];
    }
  };

  const columns = useMemo(
    () => [
      {
        title: t("maDon"),
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: t("tieuDe"),
        dataIndex: "title",
        key: "title",
        width: 200,
      },
      {
        title: t("moTa"),
        dataIndex: "description",
        key: "description",
        width: 250,
      },
      {
        title: t("nguoiDuyet"),
        dataIndex: "rolePermission",
        key: "rolePermission",
        width: 150,
        render: (rolePermission: string) =>
          getRolePermissionLabel(rolePermission),
      },
    ],
    [t]
  );

  const showModal = async (
    don: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form before opening the modal
    form.resetFields();

    // Set editing don state
    setEditingDanhMucDon(don);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (don && action === "update") {
      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...don,
        });
      }, 100);
    } else {
      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          ...don,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingDanhMucDon) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        const changedValues = getChangedValues(values, editingDanhMucDon);

        // Check if there are any changes
        if (Object.keys(changedValues).length === 0) {
          toast.info("Không có thông tin nào được thay đổi!");
          setEditLoading(false);
          setIsModalVisible(false); // Close the modal even if no changes
          return;
        }

        // Simulate API update
        setTimeout(() => {
          // Update the item in the sample data
          const updatedData = tableData.map((item) =>
            item.id === editingDanhMucDon.id ? { ...item, ...values } : item
          );

          setTableData(updatedData);
          toast.success("Cập nhật thành công!");
          setIsModalVisible(false);
          setEditLoading(false);
        }, 500);
      } catch (error: any) {
        handleFormErrors(form, error);
        setEditLoading(false);
      }
    } else {
      // Handle add new don
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();

        // Simulate API create
        setTimeout(() => {
          // Create a new item with a unique ID
          const newItem: DonItem = {
            id: `${Date.now()}`, // Generate a unique ID
            ...values,
          };

          // Add to the sample data
          const updatedData = [...tableData, newItem];
          setTableData(updatedData);
          setTotalItems((prev) => prev + 1);

          toast.success("Thêm mới thành công!");
          setIsModalVisible(false);
          form.resetFields();
          setEditLoading(false);
        }, 500);
      } catch (error: any) {
        console.log("Form validation error:", error);
        handleFormErrors(form, error);
        setEditLoading(false);
      }
    }
  };

  const handleDelete = async (record: any) => {
    try {
      // Simulate API delete
      setTimeout(() => {
        const updatedData = tableData.filter((item) => item.id !== record.id);
        setTableData(updatedData);
        setTotalItems((prev) => prev - 1);
        toast.success("Xóa thành công!");
      }, 500);
    } catch (error: any) {
      toast.error(error.message);
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
            view: t("xemChiTiet"),
            update: t("chinhSua"),
            delete: t("xoa"),
          }}
        />
      ),
    }),
    [t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    getData(page, size, quickSearch);
  };

  return (
    <>
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
              label={t("timKiem")}
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
                add: t("themMoi"),
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
          tableId="admin_danh_muc_don"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <DonForm
        form={form}
        editingData={editingDanhMucDon}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
      />
    </>
  );
};

export default DanhMucDonManagementPage;
