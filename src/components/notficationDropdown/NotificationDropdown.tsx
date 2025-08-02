/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Dropdown, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Button, 
  Empty,
  Badge
} from 'antd';
import { 
  BellOutlined,
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  InfoCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  DollarOutlined,
  ToolOutlined,
  GiftOutlined,
  DownloadOutlined,
  TeamOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Text, Title } = Typography;

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    title: "Chấm công thành công",
    message: "Bạn đã chấm công thành công lúc 08:00 sáng hôm nay",
    type: "success",
    time: "2 phút trước",
    isRead: false,
    icon: "check-circle",
  },
  {
    id: "2",
    title: "Nhắc nhở chấm công",
    message: "Đừng quên chấm công trước 09:00 sáng",
    type: "warning",
    time: "15 phút trước",
    isRead: false,
    icon: "clock-circle",
  },
  {
    id: "3",
    title: "Đơn từ được duyệt",
    message: "Đơn xin nghỉ phép của bạn đã được phê duyệt",
    type: "info",
    time: "1 giờ trước",
    isRead: false,
    icon: "file-done",
  },
  {
    id: "4",
    title: "Lương tháng 12",
    message: "Lương tháng 12/2024 đã được chuyển vào tài khoản",
    type: "success",
    time: "2 giờ trước",
    isRead: true,
    icon: "dollar",
  },
  {
    id: "5",
    title: "Bảo trì hệ thống",
    message: "Hệ thống sẽ bảo trì từ 22:00 - 06:00 ngày mai",
    type: "warning",
    time: "3 giờ trước",
    isRead: true,
    icon: "tool",
  },
  {
    id: "6",
    title: "Chúc mừng sinh nhật",
    message: "Chúc mừng sinh nhật! Chúc bạn một ngày tuyệt vời",
    type: "info",
    time: "1 ngày trước",
    isRead: true,
    icon: "gift",
  },
  {
    id: "7",
    title: "Cập nhật ứng dụng",
    message: "Phiên bản mới của ứng dụng đã có sẵn",
    type: "info",
    time: "2 ngày trước",
    isRead: true,
    icon: "download",
  },
  {
    id: "8",
    title: "Nhắc nhở họp",
    message: "Cuộc họp tuần sẽ diễn ra lúc 14:00 chiều nay",
    type: "warning",
    time: "3 ngày trước",
    isRead: true,
    icon: "team",
  },
];

interface NotificationDropdownProps {
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  placement = 'bottomRight' 
}) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [visible, setVisible] = useState(false);
  
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const getIcon = (iconType: string) => {
    const iconStyle = { fontSize: '16px' };
    
    switch (iconType) {
      case 'check-circle':
        return <CheckCircleOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ ...iconStyle, color: '#faad14' }} />;
      case 'info-circle':
        return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'clock-circle':
        return <ClockCircleOutlined style={{ ...iconStyle, color: '#722ed1' }} />;
      case 'file-done':
        return <FileTextOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'dollar':
        return <DollarOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'tool':
        return <ToolOutlined style={{ ...iconStyle, color: '#faad14' }} />;
      case 'gift':
        return <GiftOutlined style={{ ...iconStyle, color: '#eb2f96' }} />;
      case 'download':
        return <DownloadOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'team':
        return <TeamOutlined style={{ ...iconStyle, color: '#722ed1' }} />;
      default:
        return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const renderNotificationItem = (notification: any) => (
    <List.Item
      key={notification.id}
      style={{
        backgroundColor: notification.isRead ? 'transparent' : '#f0f9ff',
        borderRadius: '6px',
        marginBottom: '4px',
        padding: '8px 12px',
        border: notification.isRead ? 'none' : '1px solid #e6f7ff',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            icon={getIcon(notification.icon)}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none'
            }}
            size="small"
          />
        }
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text 
              strong={!notification.isRead}
              style={{ 
                fontSize: '13px',
                fontWeight: notification.isRead ? 'normal' : '600',
                color: notification.isRead ? '#595959' : '#262626',
                lineHeight: '1.3',
                maxWidth: '200px'
              }}
              ellipsis={{ tooltip: notification.title }}
            >
              {notification.title}
            </Text>
            {!notification.isRead && (
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  marginLeft: '8px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              />
            )}
          </div>
        }
        description={
          <div>
            <Text 
              style={{ 
                fontSize: '12px',
                color: '#8c8c8c',
                lineHeight: '1.4',
                display: 'block',
                marginBottom: '4px'
              }}
              ellipsis={{ tooltip: notification.message }}
            >
              {notification.message}
            </Text>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '11px',
                fontStyle: 'italic'
              }}
            >
              {notification.time}
            </Text>
          </div>
        }
      />
    </List.Item>
  );

  const dropdownContent = (
    <div style={{ 
      width: '320px', 
      maxHeight: '400px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #f0f0f0'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space align="center">
          <Title level={5} style={{ margin: 0, fontSize: '14px' }}>
            Thông báo
          </Title>
          {unreadCount > 0 && (
            <Badge 
              count={unreadCount} 
              size="small"
              style={{ backgroundColor: '#ff4d4f' }}
            />
          )}
        </Space>
        
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            style={{ fontSize: '11px', padding: '0 4px' }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ 
        maxHeight: '280px', 
        overflowY: 'auto',
        padding: '8px'
      }}>
        {notifications.length > 0 ? (
          <List
            dataSource={notifications.slice(0, 5)} // Show only first 5 notifications
            renderItem={renderNotificationItem}
            style={{ margin: 0 }}
            split={false}
          />
        ) : (
          <Empty 
            description="Không có thông báo nào"
            style={{ padding: '20px 0' }}
            imageStyle={{ height: 40 }}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '8px 16px', 
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/thong-bao" style={{ textDecoration: 'none' }}>
          <Button 
            type="link" 
            size="small"
            style={{ fontSize: '12px', padding: 0 }}
            onClick={() => setVisible(false)}
          >
            Xem tất cả thông báo
          </Button>
        </Link>
        
        <Button
          type="text"
          size="small"
          icon={<SettingOutlined style={{ fontSize: '12px' }} />}
          style={{ fontSize: '12px', color: '#8c8c8c' }}
        >
          Cài đặt
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      placement={placement}
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
      overlayStyle={{ zIndex: 1050 }}
    >
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        style={{ backgroundColor: '#ff4d4f' }}
      >
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            width: '40px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          className="icon-button help-button"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;