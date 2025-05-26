/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { getChangedValues } from "@/utils/client/compareHelpers";
import { handleFormErrors } from "@/utils/client/formHelpers";
import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CongTyForm from "./CongTyForm";
import { useTranslations } from "next-intl";
import "./index.scss";
import dayjs from "dayjs";

// Sample data interface for Company
interface CongTyItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  establishDate: string | null;
}

// Format date function
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("DD/MM/YYYY");
};

const DanhMucCongTyManagementPage = () => {
  const t = useTranslations("DanhMucCongTy");

  // Sample data - defined before state declarations
  const sampleData: CongTyItem[] = [
    {
      id: "1",
      code: "CT001",
      name: "Công ty TNHH ABC",
      description: "Công ty phát triển phần mềm",
      establishDate: "2020-01-15T08:00:00.000Z",
    },
    {
      id: "2",
      code: "CT002",
      name: "Công ty Cổ phần XYZ",
      description: "Công ty thương mại điện tử",
      establishDate: "2018-06-22T08:00:00.000Z",
    },
    {
      id: "3",
      code: "CT003",
      name: "Tập đoàn DEF",
      description: "Tập đoàn công nghệ",
      establishDate: "2015-12-10T08:00:00.000Z",
    },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucCongTy, setEditingDanhMucCongTy] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<CongTyItem[]>(sampleData);
  const [totalItems, setTotalItems] = useState<number>(sampleData.length);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

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
              item.name.toLowerCase().includes(searchTerm) ||
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
      }, 300); // Reduced delay for better UX
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, []); // Reload data when page or size changes

  const handleBeforeExport = async (): Promise<CongTyItem[]> => {
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
        title: t("maCongTy"),
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: t("tenCongTy"),
        dataIndex: "name",
        key: "name",
        width: 250,
      },
      {
        title: t("moTa"),
        dataIndex: "description",
        key: "description",
        width: 300,
      },
      {
        title: t("ngayThanhLap"),
        dataIndex: "establishDate",
        key: "establishDate",
        width: 150,
        render: (establishDate: string) => formatDate(establishDate),
      },
    ],
    [t]
  );

  const showModal = async (
    congTy: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form before opening the modal
    form.resetFields();

    // Set editing congTy state
    setEditingDanhMucCongTy(congTy);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (congTy && action === "update") {
      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...congTy,
          establishDate: congTy.establishDate
            ? dayjs(congTy.establishDate)
            : null,
        });
      }, 100);
    } else {
      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          ...congTy,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingDanhMucCongTy) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();

        // Format date to ISO string for storage
        if (values.establishDate) {
          values.establishDate = values.establishDate.toISOString();
        }

        const changedValues = getChangedValues(values, editingDanhMucCongTy);

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
            item.id === editingDanhMucCongTy.id ? { ...item, ...values } : item
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
      // Handle add new congTy
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();

        // Format date to ISO string for storage
        if (values.establishDate) {
          values.establishDate = values.establishDate.toISOString();
        }

        // Simulate API create
        setTimeout(() => {
          // Create a new item with a unique ID
          const newItem: CongTyItem = {
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
          tableId="admin_danh_muc_cong_ty_v1"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <CongTyForm
        form={form}
        editingData={editingDanhMucCongTy}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
      />
    </>
  );
};

export default DanhMucCongTyManagementPage;
