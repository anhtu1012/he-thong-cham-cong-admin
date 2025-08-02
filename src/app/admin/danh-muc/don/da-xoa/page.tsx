/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { Button, Space, Tooltip, Popconfirm } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import DanhMucDonServices from "@/services/admin/danh-muc/don/don.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { FormItem } from "@/dtos/danhMuc/don/don.dto";
dayjs.extend(utc);

function DonDaXoa() {
  const t = useTranslations("DanhMucDon");
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<FormItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
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
      searchFilter.push({
        key: "status",
        type: FilterOperationType.Eq,
        value: "INACTIVE",
      });

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
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, [currentPage, pageSize, quickSearch]);

  const handleBeforeExport = async (): Promise<FormItem[]> => {
    setLoading(true);
    try {
      const searchFilter: any = [
        {
          key: "limit",
          type: "=",
          value: process.env.NEXT_PUBLIC_LIMIT_QUERY_EXPORT || 1000,
        },
        { key: "offset", type: "=", value: 0 },
      ];
      searchFilter.push({
        key: "status",
        type: FilterOperationType.Eq,
        value: "INACTIVE",
      });

      const params: any = {
        ...(quickSearch ? { quickSearch: quickSearch } : {}),
      };

      const response = await DanhMucDonServices.getDanhMucDon(
        searchFilter,
        params
      );
      setLoading(false);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching export data:", error);
      setLoading(false);
      return [];
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
          return role === "R1"
            ? "Admin"
            : role === "R2"
            ? "HR"
            : role === "R3"
            ? "Manager"
            : "Staff";
        },
      },
    ],
    [t]
  );

  const handleRevert = async (record: any) => {
    try {
      await DanhMucDonServices.revertDeletedDanhMucDon(record.id);
      toast.success("Khôi phục thành công!");
      getData();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi khôi phục");
    }
  };

  // Define action column for our table using custom buttons
  const actionColumn = useMemo(
    () => ({
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Khôi phục">
            <Popconfirm
              title="Xác nhận khôi phục"
              description="Bạn có chắc chắn muốn khôi phục đơn này không?"
              okText="Khôi phục"
              cancelText="Hủy"
              onConfirm={() => handleRevert(record)}
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                size="small"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }),
    [handleRevert, t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    getData(page, size, quickSearch);
  };

  const handleGoBack = () => {
    router.push("/admin/danh-muc/don");
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
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
            >
              Quay lại danh sách đơn
            </Button>
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
          tableId="admin_danh_muc_don_da_xoa"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
}

export default DonDaXoa