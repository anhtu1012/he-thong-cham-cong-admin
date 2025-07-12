"use client";
import React, { useState } from "react";
import { Button, Row, Col, Tabs, Modal, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./index.scss";

const { TabPane } = Tabs;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Hàm mở modal chỉnh sửa thông tin cá nhân
  const openPersonalInfoModal = () => {
    setModalTitle("Chỉnh sửa thông tin cá nhân");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          firstName: "Rafiqur",
          lastName: "Rahman",
          email: "rafiqurrahman51@gmail.com",
          phone: "+09 345 346 46",
          bio: "Team Manager",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Họ" name="firstName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tên" name="lastName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Điện thoại" name="phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Giới thiệu" name="bio">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa địa chỉ
  const openAddressModal = () => {
    setModalTitle("Chỉnh sửa địa chỉ");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          country: "United Kingdom",
          city: "Leeds, East London",
          postalCode: "ERT 2354",
          taxId: "AS45645756",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Quốc gia" name="country">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thành phố" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mã bưu chính" name="postalCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mã số thuế" name="taxId">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa học vấn
  const openEducationModal = () => {
    setModalTitle("Chỉnh sửa học vấn");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          school: "Đại học Leeds",
          major: "Công nghệ thông tin",
          graduationYear: "2018",
          degree: "Cử nhân",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Trường học" name="school">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chuyên ngành" name="major">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Năm tốt nghiệp" name="graduationYear">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Bằng cấp" name="degree">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa kinh nghiệm làm việc
  const openExperienceModal = () => {
    setModalTitle("Chỉnh sửa kinh nghiệm làm việc");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          company: "Tech Solutions Ltd",
          position: "Team Leader",
          startDate: "01/2020",
          endDate: "Hiện tại",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Công ty" name="company">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Vị trí" name="position">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời gian bắt đầu" name="startDate">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời gian kết thúc" name="endDate">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa thông tin công việc
  const openJobInfoModal = () => {
    setModalTitle("Chỉnh sửa thông tin công việc");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          department: "Kỹ thuật",
          position: "Team Manager",
          startDate: "01/01/2020",
          contractType: "Toàn thời gian",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Phòng ban" name="department">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chức vụ" name="position">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ngày vào công ty" name="startDate">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Loại hợp đồng" name="contractType">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa thông tin lương
  const openSalaryModal = () => {
    setModalTitle("Chỉnh sửa thông tin lương");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          baseSalary: "5,000 £",
          allowance: "500 £",
          paymentMethod: "Chuyển khoản ngân hàng",
          paymentCycle: "Hàng tháng",
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Lương cơ bản" name="baseSalary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phụ cấp" name="allowance">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Hình thức trả lương" name="paymentMethod">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chu kỳ trả lương" name="paymentCycle">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa avatar và thông tin cơ bản
  const openProfileModal = () => {
    setModalTitle("Chỉnh sửa hồ sơ");
    setModalContent(
      <Form
        layout="vertical"
        initialValues={{
          name: "Rafiqur Rahman",
          role: "Team Manager",
          location: "Leeds, United Kingdom",
        }}
      >
        <div className="avatar-upload">
          <div className="avatar-preview">
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocLidJiEJ0IX0xRgRyKss06fMdg4zoFVdT1TkRQrYLEjQtds5gQ=s192-c-rg-br100"
              alt="Avatar"
            />
          </div>
          <Button type="primary">Thay đổi ảnh</Button>
        </div>
        <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
          <Col span={24}>
            <Form.Item label="Họ và tên" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chức vụ" name="role">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Địa điểm" name="location">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi nhấn nút lưu
  const handleOk = () => {
    setIsModalVisible(false);
    // Ở đây sẽ xử lý lưu dữ liệu, nhưng hiện tại chỉ đóng modal
  };

  return (
    <div className="profile-page-new">
      <div className="profile-container-new">
        {/* Right Content */}
        <div className="profile-content">
          <div className="content-header">
            <h1 className="page-title">Hồ sơ cá nhân</h1>
          </div>

          {/* Profile Header Section */}
          <div className="profile-header-section">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocLidJiEJ0IX0xRgRyKss06fMdg4zoFVdT1TkRQrYLEjQtds5gQ=s192-c-rg-br100"
                  alt="Rafiqur Rahman"
                  className="profile-avatar-img"
                />
              </div>
              <div className="profile-basic-info">
                <h2 className="profile-name">Rafiqur Rahman</h2>
                <p className="profile-role">Team Manager</p>
                <p className="profile-location">Leeds, United Kingdom</p>
              </div>
            </div>
            <Button
              type="text"
              className="edit-button"
              icon={<EditOutlined />}
              onClick={openProfileModal}
            >
              Chỉnh sửa
            </Button>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="custom-tabs"
            >
              <TabPane tab="Thông tin chung" key="1">
                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Thông tin cá nhân</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openPersonalInfoModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Họ</div>
                        <div className="field-value">Rafiqur</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Tên</div>
                        <div className="field-value">Rahman</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Email</div>
                        <div className="field-value">
                          rafiqurrahman51@gmail.com
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Điện thoại</div>
                        <div className="field-value">+09 345 346 46</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-field">
                        <div className="field-label">Giới thiệu</div>
                        <div className="field-value">Team Manager</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Địa chỉ</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openAddressModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Quốc gia</div>
                        <div className="field-value">United Kingdom</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Thành phố</div>
                        <div className="field-value">Leeds, East London</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Mã bưu chính</div>
                        <div className="field-value">ERT 2354</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Mã số thuế</div>
                        <div className="field-value">AS45645756</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="Sơ yếu lý lịch" key="2">
                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Học vấn</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openEducationModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Trường học</div>
                        <div className="field-value">Đại học Leeds</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Chuyên ngành</div>
                        <div className="field-value">Công nghệ thông tin</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Năm tốt nghiệp</div>
                        <div className="field-value">2018</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Bằng cấp</div>
                        <div className="field-value">Cử nhân</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Kinh nghiệm làm việc</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openExperienceModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Công ty</div>
                        <div className="field-value">Tech Solutions Ltd</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Vị trí</div>
                        <div className="field-value">Team Leader</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Thời gian bắt đầu</div>
                        <div className="field-value">01/2020</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Thời gian kết thúc</div>
                        <div className="field-value">Hiện tại</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="Công việc & Lương" key="3">
                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Thông tin công việc</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openJobInfoModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Phòng ban</div>
                        <div className="field-value">Kỹ thuật</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Chức vụ</div>
                        <div className="field-value">Team Manager</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Ngày vào công ty</div>
                        <div className="field-value">01/01/2020</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Loại hợp đồng</div>
                        <div className="field-value">Toàn thời gian</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="info-section">
                  <div className="section-header">
                    <h3 className="section-title">Thông tin lương</h3>
                    <Button
                      type="text"
                      className="edit-button"
                      icon={<EditOutlined />}
                      onClick={openSalaryModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>

                  <Row gutter={[24, 24]} className="info-form">
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Lương cơ bản</div>
                        <div className="field-value">5,000 £</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Phụ cấp</div>
                        <div className="field-value">500 £</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Hình thức trả lương</div>
                        <div className="field-value">
                          Chuyển khoản ngân hàng
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="form-field">
                        <div className="field-label">Chu kỳ trả lương</div>
                        <div className="field-value">Hàng tháng</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default ProfilePage;
