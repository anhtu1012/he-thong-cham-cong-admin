/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { RoleAdmin } from "@/models/enum";
import { getChangedValues } from "@/utils/client/compareHelpers";
import { handleFormErrors } from "@/utils/client/formHelpers";
import { Form, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DonForm from "./DonForm";
import { useTranslations } from "next-intl";
import DanhMucDonServices from "@/services/admin/danh-muc/don/don.service";
import { FormItem } from "@/dtos/danhMuc/don/don.dto";

const DanhMucDonManagementPage = () => {
  const t = useTranslations("DanhMucDon");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDanhMucDon, setEditingDanhMucDon] = useState<any>(null);
  const [form] = Form.useForm<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<FormItem[]>([]);
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
      const searchFilter: any = [
        { key: "limit", type: "=", value: limit },
        { key: "offset", type: "=", value: (page - 1) * limit },
      ];

      const params: any = {
        ...(quickkSearch ? { quickSearch: quickkSearch } : {}),
      };

      const response = await DanhMucDonServices.getDanhMucDon(
        searchFilter,
        params
      );
      setTableData(response.data || []);
      setTotalItems(response.count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      toast.error("Lỗi khi tải dữ liệu!");
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, [currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBeforeExport = async (): Promise<FormItem[]> => {
    setLoading(true);
    try {
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");
      const searchFilterExport: any = [
        {
          key: "limit",
          type: "=",
          value: process.env.NEXT_PUBLIC_LIMIT_QUERY_EXPORT,
        },
        { key: "offset", type: "=", value: 0 },
      ];
      const params: any = {
        ...(quickSearch ? { quickSearch: quickSearch } : {}),
      };
      const response = await DanhMucDonServices.getDanhMucDon(
        searchFilterExport,
        params
      );
      setLoading(false);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Lỗi khi tải dữ liệu để xuất Excel!");
      setLoading(false);
      return [];
    }
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

  const columns = useMemo(
    () => [
      {
        title: t("tieuDe"),
        dataIndex: "title",
        key: "title",
        width: 150,
      },
      {
        title: t("moTa"),
        dataIndex: "description",
        key: "description",
        width: 250,
      },
      {
        title: t("nguoiDuyet"),
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
          rolePermission: don.roleCode, // Map API roleCode to form field rolePermission
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

        // Map form values to API request format
        const formData = {
          title: values.title,
          description: values.description,
          roleCode: values.rolePermission,
        };

        await DanhMucDonServices.updateDanhMucDon(
          editingDanhMucDon.id,
          formData
        );
        toast.success("Cập nhật thành công!");
        getData(currentPage, pageSize, quickSearch);
        setIsModalVisible(false);
        setEditLoading(false);
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

        // Map form values to API request format
        const formData = {
          title: values.title,
          description: values.description,
          roleCode: values.rolePermission,
        };

        await DanhMucDonServices.createDanhMucDon(formData);
        toast.success("Thêm mới thành công!");
        getData(currentPage, pageSize, quickSearch);
        setIsModalVisible(false);
        form.resetFields();
        setEditLoading(false);
      } catch (error: any) {
        console.log("Form validation error:", error);
        handleFormErrors(form, error);
        setEditLoading(false);
      }
    }
  };

  const handleDelete = async (record: any) => {
    try {
      await DanhMucDonServices.deleteDanhMucDon(record.id);
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
