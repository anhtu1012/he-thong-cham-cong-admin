/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import { Button, Space, Tooltip, Popconfirm } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import DanhMucCaLamServices from "@/services/admin/danh-muc/ca-lam/ca-lam.service";
import { formatDateTime } from "@/utils/dateTime";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
dayjs.extend(utc);

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

function CaLamDaXoa() {
  const t = useTranslations("DanhMucCaLam");
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<CaLamItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string
  ) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        status: "NOTACTIVE", // Only get deleted/inactive shifts
      };
      if (quickkSearch && quickkSearch.trim() !== "") {
        params.quickSearch = quickkSearch;
      }
      const response = await DanhMucCaLamServices.getDanhMucCaLam([], params);
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

  const handleBeforeExport = async (): Promise<CaLamItem[]> => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 1000,
        status: "NOTACTIVE",
      };
      const response = await DanhMucCaLamServices.getDanhMucCaLam([], params);
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
        title: t("maCaLam"),
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: t("tenCaLam"),
        dataIndex: "name",
        key: "name",
        width: 160,
      },
      {
        title: t("gioBatDau"),
        dataIndex: "startTime",
        key: "startTime",
        width: 160,
        render: (time: string) => formatDateTime(time),
      },
      {
        title: t("gioKetThuc"),
        dataIndex: "endTime",
        key: "endTime",
        width: 160,
        render: (time: string) => formatDateTime(time),
      },
      {
        title: t("soGioLam"),
        dataIndex: "workingHours",
        key: "workingHours",
        width: 100,
      },
      {
        title: t("gioNghiTrua"),
        dataIndex: "lunchBreak",
        key: "lunchBreak",
        width: 120,
      },
      {
        title: t("ngayTao"),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (time: string) => {
          if (!time) return "-";
          return dayjs(time).format("DD/MM/YYYY HH:mm");
        },
      },
      {
        title: t("ngayCapNhat"),
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 160,
        render: (time: string) => {
          if (!time) return "-";
          return dayjs(time).format("DD/MM/YYYY HH:mm");
        },
      },
    ],
    [t]
  );

  const handleRevert = async (record: any) => {
    try {
      await DanhMucCaLamServices.deleteDanhMucCaLam(record.id, {
        status: "ACTIVE",
      });
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
              description="Bạn có chắc chắn muốn khôi phục ca làm này không?"
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
    router.push("/admin/danh-muc/ca-lam");
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
              Quay lại danh sách ca làm
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
          tableId="admin_danh_muc_ca_lam_da_xoa"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
}

export default CaLamDaXoa