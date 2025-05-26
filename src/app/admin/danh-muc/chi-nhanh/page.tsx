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
import ChiNhanhForm from "./ChiNhanhForm";
import { useTranslations } from "next-intl";

// Sample data interface for Branch
interface ChiNhanhItem {
  id: string;
  code: string;
  branchName: string;
  addressLine: string;
  placeId: string;
  city: string;
  district: string;
  lat: number;
  long: number;
  companyCode: string;
}

const DanhMucChiNhanhManagementPage = () => {
  const t = useTranslations("DanhMucChiNhanh");

  // Sample data - moved up before state declarations
  const sampleData: ChiNhanhItem[] = [
    {
      id: "1",
      code: "CN001",
      branchName: "Chi nhánh Hà Nội",
      addressLine: "123 Đường Láng",
      placeId: "PL123456",
      city: "Hà Nội",
      district: "Đống Đa",
      lat: 21.0285,
      long: 105.8542,
      companyCode: "COMP001",
    },
    {
      id: "2",
      code: "CN002",
      branchName: "Chi nhánh TP.HCM",
      addressLine: "456 Nguyễn Huệ",
      placeId: "PL789456",
      city: "TP.Hồ Chí Minh",
      district: "Quận 1",
      lat: 10.7769,
      long: 106.7009,
      companyCode: "COMP001",
    },
    {
      id: "3",
      code: "CN003",
      branchName: "Chi nhánh Đà Nẵng",
      addressLine: "789 Hàn Thuyên",
      placeId: "PL321654",
      city: "Đà Nẵng",
      district: "Hải Châu",
      lat: 16.0471,
      long: 108.2068,
      companyCode: "COMP001",
    },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucChiNhanh, setEditingDanhMucChiNhanh] =
    useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<ChiNhanhItem[]>(sampleData);
  const [totalItems, setTotalItems] = useState<number>(0);
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
              item.branchName.toLowerCase().includes(searchTerm) ||
              item.addressLine.toLowerCase().includes(searchTerm) ||
              item.city.toLowerCase().includes(searchTerm) ||
              item.district.toLowerCase().includes(searchTerm)
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

  const handleBeforeExport = async (): Promise<ChiNhanhItem[]> => {
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
        title: t("maChiNhanh"),
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: t("tenChiNhanh"),
        dataIndex: "branchName",
        key: "branchName",
        width: 200,
      },
      {
        title: t("diaChi"),
        dataIndex: "addressLine",
        key: "addressLine",
        width: 250,
      },
      {
        title: t("maViTri"),
        dataIndex: "placeId",
        key: "placeId",
        width: 150,
      },
      {
        title: t("thanhPho"),
        dataIndex: "city",
        key: "city",
        width: 120,
      },
      {
        title: t("quan"),
        dataIndex: "district",
        key: "district",
        width: 120,
      },
      {
        title: t("viDo"),
        dataIndex: "lat",
        key: "lat",
        width: 100,
        render: (lat: number) => lat?.toFixed(4) || "",
      },
      {
        title: t("kinhDo"),
        dataIndex: "long",
        key: "long",
        width: 100,
        render: (long: number) => long?.toFixed(4) || "",
      },
      {
        title: t("maDoanhNghiep"),
        dataIndex: "companyCode",
        key: "companyCode",
        width: 150,
      },
    ],
    [t]
  );

  const showModal = async (
    chiNhanh: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form before opening the modal
    form.resetFields();

    // Set editing chi nhanh state
    setEditingDanhMucChiNhanh(chiNhanh);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (chiNhanh && action === "update") {
      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...chiNhanh,
        });
      }, 100);
    } else {
      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          ...chiNhanh,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingDanhMucChiNhanh) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        const changedValues = getChangedValues(values, editingDanhMucChiNhanh);

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
            item.id === editingDanhMucChiNhanh.id
              ? { ...item, ...values }
              : item
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
      // Handle add new chi nhanh
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();

        // Simulate API create
        setTimeout(() => {
          // Create a new item with a unique ID
          const newItem: ChiNhanhItem = {
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

  console.log("tableData:", tableData);
  console.log("columns length:", columns.length);
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
          tableId="admin_danh_muc_chi_nhanh_v2"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <ChiNhanhForm
        form={form}
        editingData={editingDanhMucChiNhanh}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
      />
    </>
  );
};

export default DanhMucChiNhanhManagementPage;
