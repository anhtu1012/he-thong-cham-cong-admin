/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { UpdatePositionRequest } from "@/dtos/danhMuc/chucVu/chucVu.request.dto";
import { DanhMucChucVuResponseGetItem } from "@/dtos/danhMuc/chucVu/chucVu.response.dto";
import DanhMucChucVuServices from "@/services/admin/danh-muc/chuc-vu/chuc-vu.service";
import { getChangedValues } from "@/utils/client/compareHelpers";
import { handleFormErrors } from "@/utils/client/formHelpers";
import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ChucVuForm from "./ChucVuForm";
import { useTranslations } from "next-intl";

const DanhMucChucVuManagementPage = () => {
  const t = useTranslations("DanhMucChucVu");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucChucVu, setEditingDanhMucChucVu] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tableData, setTableData] = useState<DanhMucChucVuResponseGetItem[]>(
    []
  );
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
      const searchOwnweFilter: any = [
        { key: "limit", type: "=", value: limit },
        { key: "offset", type: "=", value: (page - 1) * limit },
      ];

      const result: any = await DanhMucChucVuServices.getDanhMucChucVu(
        searchOwnweFilter,
        {
          ...(quickkSearch ? { quickSearch: quickSearch } : {}),
        }
      );

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
    getData(currentPage, pageSize, quickSearch);
  }, []); // Reload data when page or size changes

  const handleBeforeExport = async (): Promise<
    DanhMucChucVuResponseGetItem[]
  > => {
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
      const resultExport: any = await DanhMucChucVuServices.getDanhMucChucVu(
        searchOwnweFilterExport,
        {
          ...(quickSearch ? { quickSearch: quickSearch } : {}),
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
        title: t("maChucVu"),
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: t("tenChucVu"),
        dataIndex: "positionName",
        key: "positionName",
        width: 120,
      },
      {
        title: t("luongCoBan"),
        dataIndex: "basicSalary",
        key: "basicSalary",
        width: 150,
      },
      {
        title: t("phuCap"),
        dataIndex: "allowance",
        key: "allowance",
        width: 150,
      },
      {
        title: t("luongTangCa"),
        dataIndex: "overtimeSalary",
        key: "overtimeSalary",
        width: 180,
      },
      {
        title: t("phiDiMuon"),
        dataIndex: "lateFee",
        key: "lateFee",
        width: 120,
      },
    ],
    [t]
  );

  const showModal = async (
    chucVu: any = null,
    action: "add" | "update" = "update"
  ) => {
    // First, reset the form and file list before opening the modal
    form.resetFields();
    setFileList([]);

    // Set editing chucVu state
    setEditingDanhMucChucVu(chucVu);

    // Open the modal first so the transition appears smoother
    setIsModalVisible(true);

    if (chucVu && action === "update") {
      // Use setTimeout to ensure the modal is rendered before populating data
      setTimeout(() => {
        form.setFieldsValue({
          ...chucVu,
        });
      }, 100);
    } else {
      // Set default values after a small delay to ensure modal is ready
      setTimeout(() => {
        form.setFieldsValue({
          ...chucVu,
        });
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (editingDanhMucChucVu) {
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        values.faceImg = fileList[0]?.url || null; // Handle file upload
        if (values.bod) {
          values.bod = new Date(values.bod).toISOString();
        }
        const changedValues = getChangedValues(values, editingDanhMucChucVu);

        // Check if there are any changes
        if (Object.keys(changedValues).length === 0) {
          toast.info("Không có thông tin nào được thay đổi!");
          setEditLoading(false);
          setIsModalVisible(false); // Close the modal even if no changes
          return;
        }

        const result: any = await DanhMucChucVuServices.updateDanhMucChucVu(
          editingDanhMucChucVu.id,
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
        handleFormErrors<UpdatePositionRequest>(form, error);
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
      // Handle add new chucVu
      setEditLoading(true);
      try {
        // Validate form fields
        const values = await form.validateFields();
        values.basicSalary = parseFloat(values.basicSalary);
        const result: any = await DanhMucChucVuServices.createDanhMucChucVu(
          values
        );
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
        handleFormErrors<UpdatePositionRequest>(form, error);

        if (error.response && error.response.data) {
          console.log("API error:", error.response.data);

          handleFormErrors<UpdatePositionRequest>(form, error.response.data);
        }
      } finally {
        setEditLoading(false);
      }
    }
  };

  const handleDelete = async (record: any) => {
    try {
      await DanhMucChucVuServices.deleteDanhMucChucVu(record.id);
      toast.success("Xóa thành công!");
      getData(currentPage, pageSize, quickSearch);
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
          tableId="admin_danh_muc_chuc_vu"
          onBeforeExport={handleBeforeExport}
        />
      </div>
      <ChucVuForm
        form={form}
        editingData={editingDanhMucChucVu}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        editLoading={editLoading}
      />
    </>
  );
};

export default DanhMucChucVuManagementPage;
