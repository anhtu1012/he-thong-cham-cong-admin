/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionButton from "@/components/basicUI/ActionButton";
import Ctable from "@/components/basicUI/Ctable";
import {
  BellOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: "Thông báo nghỉ lễ 30/4 - 1/5",
    content:
      "Công ty sẽ nghỉ lễ vào các ngày 30/4 và 1/5 theo quy định của nhà nước.",
    createdAt: "2024-04-25T08:00:00",
    author: "Admin",
    target: "All",
    status: "Active",
    read: 42,
    unread: 0,
  },
  {
    id: 2,
    title: "Họp giao ban phòng IT",
    content:
      "Yêu cầu tất cả nhân viên phòng IT tham gia họp giao ban vào 9h sáng thứ 2 ngày 13/5/2024.",
    createdAt: "2024-05-10T14:30:00",
    author: "Manager IT",
    target: "IT",
    status: "Active",
    read: 8,
    unread: 4,
  },
  {
    id: 3,
    title: "Thông báo nâng cấp hệ thống",
    content:
      "Hệ thống sẽ được nâng cấp vào ngày 15/5/2024 từ 22:00 đến 24:00. Trong thời gian này hệ thống sẽ không thể truy cập.",
    createdAt: "2024-05-12T09:15:00",
    author: "Admin",
    target: "All",
    status: "Active",
    read: 30,
    unread: 12,
  },
  {
    id: 4,
    title: "Cập nhật quy định chấm công",
    content:
      "Từ ngày 01/06/2024, quy định chấm công sẽ được cập nhật. Vui lòng xem chi tiết trong tệp đính kèm.",
    createdAt: "2024-05-20T10:45:00",
    author: "HR",
    target: "All",
    status: "Scheduled",
    read: 0,
    unread: 42,
  },
  {
    id: 5,
    title: "Thông báo thưởng tháng 4",
    content:
      "Danh sách nhân viên được thưởng tháng 4 đã được công bố. Vui lòng kiểm tra email để biết thêm chi tiết.",
    createdAt: "2024-05-05T15:20:00",
    author: "HR",
    target: "All",
    status: "Inactive",
    read: 38,
    unread: 4,
  },
];

// Mock personal notifications for the current user
const personalNotifications = [
  {
    id: 1,
    title: "Thông báo nghỉ lễ 30/4 - 1/5",
    content:
      "Công ty sẽ nghỉ lễ vào các ngày 30/4 và 1/5 theo quy định của nhà nước.",
    createdAt: "2024-04-25T08:00:00",
    author: "Admin",
    isRead: true,
  },
  {
    id: 3,
    title: "Thông báo nâng cấp hệ thống",
    content:
      "Hệ thống sẽ được nâng cấp vào ngày 15/5/2024 từ 22:00 đến 24:00. Trong thời gian này hệ thống sẽ không thể truy cập.",
    createdAt: "2024-05-12T09:15:00",
    author: "Admin",
    isRead: false,
  },
  {
    id: 2,
    title: "Họp giao ban phòng IT",
    content:
      "Yêu cầu tất cả nhân viên phòng IT tham gia họp giao ban vào 9h sáng thứ 2 ngày 13/5/2024.",
    createdAt: "2024-05-10T14:30:00",
    author: "Manager IT",
    isRead: false,
  },
];

// Mock departments data
const departments = [
  { id: 0, name: "Tất cả" },
  { id: 1, name: "Phòng Nhân sự" },
  { id: 2, name: "Phòng Kế toán" },
  { id: 3, name: "Phòng IT" },
  { id: 4, name: "Phòng Marketing" },
  { id: 5, name: "Phòng Kinh doanh" },
];

const NotificationManagementPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [myNotifications, setMyNotifications] = useState(personalNotifications);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [viewingNotification, setViewingNotification] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (notification: any = null) => {
    setEditingNotification(notification);
    if (notification) {
      form.setFieldsValue({
        ...notification,
        scheduleDate: notification.scheduleDate
          ? dayjs(notification.scheduleDate)
          : null,
      });
    } else {
      form.setFieldsValue({
        target: "All",
        status: "Active",
      });
    }
    setIsModalVisible(true);
  };

  const showViewModal = (notification: any) => {
    setViewingNotification(notification);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        createdAt: new Date().toISOString(),
        read: 0,
        unread: 42, // Assuming 42 total users
        scheduleDate: values.scheduleDate
          ? values.scheduleDate.format("YYYY-MM-DD")
          : null,
      };

      if (editingNotification) {
        // Update existing notification
        setNotifications(
          notifications.map((notif) =>
            notif.id === editingNotification.id
              ? { ...notif, ...formattedValues }
              : notif
          )
        );
      } else {
        // Add new notification
        const newNotification = {
          id: Math.max(...notifications.map((notif) => notif.id)) + 1,
          ...formattedValues,
        };
        setNotifications([newNotification, ...notifications]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (notificationId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa thông báo",
      content: "Bạn có chắc chắn muốn xóa thông báo này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        setNotifications(
          notifications.filter(
            (notification) => notification.id !== notificationId
          )
        );
      },
    });
  };

  const markAsRead = (notificationId: number) => {
    setMyNotifications(
      myNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setMyNotifications(
      myNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        sorter: (a: any, b: any) => a.title.localeCompare(b.title),
        render: (text: string, record: any) => (
          <a onClick={() => showViewModal(record)}>{text}</a>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a: any, b: any) =>
          dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Người tạo",
        dataIndex: "author",
        key: "author",
      },
      {
        title: "Đối tượng",
        dataIndex: "target",
        key: "target",
        filters: [
          { text: "Tất cả", value: "All" },
          { text: "Phòng Nhân sự", value: "Phòng Nhân sự" },
          { text: "Phòng Kế toán", value: "Phòng Kế toán" },
          { text: "Phòng IT", value: "Phòng IT" },
          { text: "Phòng Marketing", value: "Phòng Marketing" },
          { text: "Phòng Kinh doanh", value: "Phòng Kinh doanh" },
        ],
        onFilter: (value: any, record: any) => record.target === value,
        render: (target: string) => {
          let icon = <GlobalOutlined />;
          let text = "Tất cả";

          if (target !== "All") {
            icon = <TeamOutlined />;
            text = target;
          }

          return (
            <Space>
              {icon} {text}
            </Space>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Đã gửi", value: "Active" },
          { text: "Đã lên lịch", value: "Scheduled" },
          { text: "Đã hủy", value: "Inactive" },
        ],
        onFilter: (value: any, record: any) => record.status === value,
        render: (status: string) => {
          let color = "green";
          let text = "Đã gửi";

          if (status === "Scheduled") {
            color = "blue";
            text = "Đã lên lịch";
          } else if (status === "Inactive") {
            color = "volcano";
            text = "Đã hủy";
          }

          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "Đã đọc/Tổng",
        key: "readStats",
        render: (record: any) => (
          <Text>
            {record.read}/{record.read + record.unread}
          </Text>
        ),
      },
    ],
    []
  );

  // Define action column for our table using ActionButton component
  const actionColumn = useMemo(
    () => ({
      render: (record: any) => (
        <ActionButton
          record={record}
          onView={() => showViewModal(record)}
          onUpdate={() => showModal(record)}
          onDelete={() => handleDelete(record.id)}
          tooltips={{
            view: "Xem chi tiết thông báo",
            update: "Chỉnh sửa thông báo",
            delete: "Xóa thông báo",
          }}
        />
      ),
    }),
    []
  );

  return (
    <div className={styles.notificationContainer}>
      <Title level={2} className={styles.pageTitle}>
        Quản lý thông báo
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={styles.notificationTabs}
      >
        <TabPane tab="Thông báo của tôi" key="1">
          <Card className={styles.tabCard}>
            <div className={styles.notificationHeader}>
              <Text>
                Bạn có {myNotifications.filter((n) => !n.isRead).length} thông
                báo chưa đọc
              </Text>
              {myNotifications.some((n) => !n.isRead) && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={markAllAsRead}
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>

            <List
              itemLayout="horizontal"
              dataSource={myNotifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    !item.isRead && (
                      <Button type="link" onClick={() => markAsRead(item.id)}>
                        Đánh dấu đã đọc
                      </Button>
                    ),
                  ]}
                  className={styles.notificationItem}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={!item.isRead} offset={[0, 5]}>
                        <Avatar icon={<BellOutlined />} />
                      </Badge>
                    }
                    title={
                      <a onClick={() => showViewModal(item)}>
                        {item.isRead ? (
                          item.title
                        ) : (
                          <strong>{item.title}</strong>
                        )}
                      </a>
                    }
                    description={
                      <div>
                        <div className={styles.notificationContent}>
                          {item.content.length > 100
                            ? item.content.substring(0, 100) + "..."
                            : item.content}
                        </div>
                        <div className={styles.notificationMeta}>
                          {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")} •{" "}
                          {item.author}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              pagination={{
                pageSize: 5,
                hideOnSinglePage: true,
                showSizeChanger: false,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Quản lý thông báo" key="2">
          <Card className={styles.tabCard}>
            <div className={styles.managementHeader}>
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                prefix={<SearchOutlined />}
                className={styles.searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
              <ActionButton
                onAdd={() => showModal()}
                tooltips={{ add: "Tạo thông báo mới" }}
              />
            </div>

            <Ctable
              columns={columns}
              dataSource={filteredNotifications}
              rowKey="id"
              usePagination={true}
              pageSize={10}
              showActions={true}
              actionColumn={actionColumn}
              stickyHeader={true}
              enableSorting={true}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Create/Edit Modal */}
      <Modal
        title={
          editingNotification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={editingNotification ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={700}
        className={styles.notificationModal}
      >
        <Form form={form} layout="vertical" className={styles.notificationForm}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={5} />
          </Form.Item>

          <Form.Item
            name="target"
            label="Gửi đến"
            rules={[{ required: true, message: "Vui lòng chọn đối tượng!" }]}
          >
            <Select>
              <Option value="All">Tất cả nhân viên</Option>
              {departments
                .filter((dept) => dept.name !== "Tất cả")
                .map((dept) => (
                  <Option key={dept.id} value={dept.name}>
                    {dept.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="Active">Gửi ngay</Option>
              <Option value="Scheduled">Lên lịch gửi</Option>
              <Option value="Inactive">Lưu nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.status !== currentValues.status
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("status") === "Scheduled" ? (
                <Form.Item
                  name="scheduleDate"
                  label="Ngày gửi"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày gửi!" },
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    className={styles.datePicker}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* View Notification Modal */}
      <Modal
        title="Chi tiết thông báo"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Đóng
          </Button>,
        ]}
        width={600}
        className={styles.viewModal}
      >
        {viewingNotification && (
          <div className={styles.notificationDetail}>
            <Title level={4}>{viewingNotification.title}</Title>

            <div className={styles.notificationMeta}>
              <Text type="secondary">
                Gửi bởi: {viewingNotification.author} •
                {dayjs(viewingNotification.createdAt).format(
                  " DD/MM/YYYY HH:mm"
                )}
              </Text>
            </div>

            {viewingNotification.target && (
              <div className={styles.targetInfo}>
                <Tag color="blue">
                  {viewingNotification.target === "All"
                    ? "Gửi đến: Tất cả nhân viên"
                    : `Gửi đến: ${viewingNotification.target}`}
                </Tag>
              </div>
            )}

            <div className={styles.notificationContent}>
              {viewingNotification.content}
            </div>

            {/* Show read stats only in management view */}
            {viewingNotification.read !== undefined && (
              <div className={styles.readStats}>
                <Text type="secondary">
                  Đã đọc: {viewingNotification.read}/
                  {viewingNotification.read + viewingNotification.unread}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotificationManagementPage;
