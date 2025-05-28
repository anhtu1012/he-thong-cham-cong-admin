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
import CaLamForm from "./CaLamForm";
import { useTranslations } from "next-intl";

// Sample data interface for CaLam
interface CaLamItem {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  workingHours: number;
  delayTime: string; // Format "HH:mm"
}

// Format date for display
const formatDateTime = (timeString: string): string => {
  const date = new Date(timeString);
  return `${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} ${date.toLocaleDateString()}`;
};

const DanhMucCaLamManagementPage = () => {
  const t = useTranslations("DanhMucCaLam");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucCaLam, setEditingDanhMucCaLam] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<CaLamItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [allData, setAllData] = useState<CaLamItem[]>([]);

  // Sample data with proper date format
  const initialData: CaLamItem[] = [
    {
      id: "1",
      code: "CA001",
      name: "Ca sáng",
      startTime: "2025-06-01T08:00:00.000Z",
      endTime: "2025-06-01T15:00:00.000Z",
      workingHours: 7,
      delayTime: "00:15",
    },
    {
      id: "2",
      code: "CA002",
      name: "Ca chiều",
      startTime: "2025-06-01T14:00:00.000Z",
      endTime: "2025-06-01T21:00:00.000Z",
      workingHours: 7,
      delayTime: "00:15",
    },
    {
      id: "3",
      code: "CA003",
      name: "Ca tối",
      startTime: "2025-06-01T22:00:00.000Z",
      endTime: "2025-06-02T05:00:00.000Z",
      workingHours: 7,
      delayTime: "00:15",
    },
  ];

  // Initialize allData with initialData on component mount
  useEffect(() => {
    setAllData([...initialData]);
  }, []);

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string
  ) => {
    setLoading(true);
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        let filteredData = [...allData];

        // Apply quick search filter if provided
        if (quickkSearch && quickkSearch.trim() !== "") {
          const searchTerm = quickkSearch.toLowerCase();
          filteredData = filteredData.filter(
            (item) =>
              item.code.toLowerCase().includes(searchTerm) ||
              item.name.toLowerCase().includes(searchTerm)
          );
        }

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setTableData(paginatedData);
        setTotalItems(filteredData.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, [allData, currentPage, pageSize, quickSearch, getData]);

  const handleBeforeExport = async (): Promise<CaLamItem[]> => {
    setLoading(true);
    try {
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");

      // Simulate API call for export
      return new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          resolve(allData);
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
        title: t("maCaLam"),
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: t("tenCaLam"),
        dataIndex: "name",
        key: "name",
        width: 200,
      },
      {
        title: t("gioBatDau"),
        dataIndex: "startTime",
        key: "startTime",
        width: 200,
        render: (time: string) => formatDateTime(time),
      },
      {
        title: t("gioKetThuc"),
        dataIndex: "endTime",
        key: "endTime",
        width: 200,
        render: (time: string) => formatDateTime(time),
      },
      {
        title: t("soGioLam"),
        dataIndex: "workingHours",
        key: "workingHours",
        width: 120,
      },
      {
        title: t("thoiGianTre"),
        dataIndex: "delayTime",
        key: "delayTime",
        width: 150,
      },
    ],
    [t]
  );

  const showModal = async (
    caLam: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form before opening the modal
    form.resetFields();

    // Set editing caLam state
    setEditingDanhMucCaLam(caLam);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (caLam && action === "update") {
      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...caLam,
        });
      }, 100);
    } else {
      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          ...caLam,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingDanhMucCaLam) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        const changedValues = getChangedValues(values, editingDanhMucCaLam);

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
          const updatedData = allData.map((item) =>
            item.id === editingDanhMucCaLam.id ? { ...item, ...values } : item
          );

          setAllData(updatedData);
          toast.success("Cập nhật thành công!");
          setIsModalVisible(false);
          setEditLoading(false);
        }, 500);
      } catch (error: any) {
        handleFormErrors(form, error);
        setEditLoading(false);
      }
    } else {
      // Handle add new caLam
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();

        // Simulate API create
        setTimeout(() => {
          // Create a new item with a unique ID
          const newItem: CaLamItem = {
            id: `${Date.now()}`, // Generate a unique ID
            ...values,
          };

          // Add to the sample data
          const updatedData = [...allData, newItem];
          setAllData(updatedData);
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
        // Remove the item from allData
        const updatedData = allData.filter((item) => item.id !== record.id);
        setAllData(updatedData);
        toast.success("Xóa thành công!");
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi xóa");
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
          tableId="admin_danh_muc_ca_lam"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <CaLamForm
        form={form}
        editingData={editingDanhMucCaLam}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
      />
    </>
  );
};

export default DanhMucCaLamManagementPage;
