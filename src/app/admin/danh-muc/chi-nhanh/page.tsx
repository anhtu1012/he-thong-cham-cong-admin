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
import { Branch } from "@/dtos/danhMuc/chi-nhanh/chinhanh.dto";
import { DanhMucChiNhanhService } from "@/services/admin/danh-muc/chi-nhanh/chi-nhanh.service";
import { DanhMucBranchResponseGetItem } from "@/dtos/danhMuc/chi-nhanh/chinhanh.response.dto";
import { CreateBranchRequest } from "@/dtos/danhMuc/chi-nhanh/chinhanh.request.dto";

const DanhMucChiNhanhManagementPage = () => {
  const t = useTranslations("DanhMucChiNhanh");

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucChiNhanh, setEditingDanhMucChiNhanh] =
    useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<Branch[]>([]);
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

      const result: any = await DanhMucChiNhanhService.getBranchs(
        searchOwnweFilter,
        {
          quickSearch: quickkSearch,
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
    DanhMucBranchResponseGetItem[]
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
      const resultExport: any = await DanhMucChiNhanhService.getBranchs(
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
    chiNhanh: Branch | null = null,
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
    setEditingDanhMucChiNhanh(null);
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

        const result: any = await DanhMucChiNhanhService.updateBranch(
          editingDanhMucChiNhanh.id,
          values
        );
        if (result) {
          toast.success("Cập nhật thành công!");
          getData(currentPage, pageSize, quickSearch); // Refresh data after updating
          setIsModalVisible(false); // Close the modal upon success
        } else {
          toast.error(result.message || "Cập nhật thất bại!");
        }
      } catch (error: any) {
        handleFormErrors<CreateBranchRequest>(form, error);
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
      try {
        const values = await form.validateFields();
        console.log({ values });
        const result = await DanhMucChiNhanhService.createBranch(values);
        console.log({ result });
        if (result) {
          toast.success("Thêm mới thành công!");
          getData(currentPage, pageSize, quickSearch); // Refresh data after adding
          setIsModalVisible(false);
          form.resetFields();
        } else {
          toast.error(result.message || "Thêm mới thất bại!");
        }
      } catch (error: any) {
        toast.error("Form validation error:", error);
      }
    }
  };

  const handleDelete = async (record: any) => {
    try {
      await DanhMucChiNhanhService.deleteBranch(record.id);
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
          pageSize={pageSize}
          rowHeight={15}
          showActions
          actionColumn={actionColumn}
          onBeforeExport={handleBeforeExport}
          stickyHeader
          tableId="admin_danh_muc_chi_nhanh_v2"
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
