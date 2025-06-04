"use client";

import React from "react";
import {
  Button,
  Typography,
  Row,
  Col,
  Card,
  Collapse,
  Divider,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import "./index.scss";

const { Title, Text, Paragraph } = Typography;

const features = [
  {
    title: "Nhận diện khuôn mặt thời gian thực",
    subtitle: "Nhận diện tức thì, mọi lúc",
    description:
      "Loại bỏ thời gian chờ đợi khi điểm danh. Nhân viên chỉ cần đi ngang qua camera và khuôn mặt của họ được tự động nhận diện, ghi lại thông tin điểm danh với tốc độ nhanh chóng.",
    image: "/assets/image/homeimage/Instant-face-recognition-768x653.png",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Độ chính xác cao",
    subtitle: "Độ tin cậy không thể vượt qua",
    description:
      "Thuật toán nhận diện khuôn mặt tiên tiến của chúng tôi xác định chính xác nhân viên khi họ vào hoặc ra khỏi cơ sở. Loại bỏ việc điểm danh hộ và đảm bảo hồ sơ chấm công luôn đáng tin cậy và chính xác.",
    image: "/assets/image/homeimage/Face-recognition-time-clock.png",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Nhận diện nhiều khuôn mặt",
    subtitle: "Quản lý đội ngũ lớn một cách dễ dàng",
    description:
      "Dù bạn có một đội nhỏ hay lực lượng lao động lớn, hệ thống của chúng tôi đều xử lý được tất cả. Nhận diện nhiều khuôn mặt đồng thời, đảm bảo sự khởi đầu suôn sẻ và hiệu quả cho toàn bộ đội ngũ của bạn.",
    image: "/assets/image/homeimage/5-Attendance-kiosks-768x653.png",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Quản lý điểm danh từ mọi nơi",
    subtitle: "Thông tin bạn cần, ở bất kỳ đâu",
    description:
      "Xem xét dữ liệu điểm danh, thực hiện các điều chỉnh cần thiết và duy trì quyền kiểm soát hoàn toàn đối với hệ thống điểm danh của bạn - dù bạn đang di chuyển với thiết bị di động hay tại bàn làm việc với máy tính.",
    image: "/assets/image/homeimage/time-clock-app-any-device-768x654.png.webp",
    icon: <GlobalOutlined />,
  },
  {
    title: "Bảng chấm công chính xác",
    subtitle: "Không cần nhập dữ liệu thủ công nữa",
    description:
      "Trải nghiệm quản lý bảng chấm công không rắc rối khi hệ thống tự động thêm bản ghi điểm danh vào bảng chấm công khi nhân viên được nhận diện. Việc tạo bảng chấm công và tính toán lương trở nên dễ dàng cho cả nhân viên và quản lý.",
    image:
      "/assets/image/homeimage/Kiosk-linked-to-your-timesheet-app-2-768x653.png.webp",
    icon: <FileTextOutlined />,
  },
  {
    title: "Báo cáo toàn diện",
    subtitle: "Tiết kiệm thời gian và có được thông tin quý giá",
    description:
      "Tạo báo cáo chi tiết để tối ưu hóa hoạt động, với những hiểu biết có giá trị về mô hình điểm danh của nhân viên, giờ làm việc, làm thêm giờ và vắng mặt.",
    image: "/assets/image/homeimage/10-Reports-768x653.png.webp",
    icon: <BarChartOutlined />,
  },
];

const testimonials = [
  {
    quote:
      "Thật sự tuyệt vời. Rất dễ sử dụng. Chế độ ngoại tuyến rất hữu ích. Giải quyết mọi vấn đề với máy chấm công sinh trắc học.",
    author: "Nguyễn Văn A",
    position: "Giám đốc, Tổ chức Xã hội",
  },
  {
    quote:
      "Rất hài lòng với hệ thống. Dễ dàng điều hướng và hỗ trợ khách hàng xuất sắc. Dễ dàng check-in và check-out. Báo cáo rất dễ yêu cầu và tùy chỉnh.",
    author: "Trần Thị B",
    position: "PR Manager",
  },
  {
    quote:
      "Phần mềm nhận diện khuôn mặt thực sự tốt và rất dễ sử dụng. Giao diện thân thiện, tốc độ nhanh và độ chính xác cao. 10/10.",
    author: "Lê Văn C",
    position: "Giám đốc, Nội thất",
  },
  {
    quote:
      "Hệ thống chấm công khuôn mặt tốt nhất. Báo cáo đến tài khoản outlook tất cả các trường hợp không khớp và có tùy chọn xem hình ảnh với vị trí địa lý chính xác.",
    author: "Phạm Văn D",
    position: "Giáo sư, Quản lý Giáo dục",
  },
];

const faqs = [
  {
    question: "Hệ thống chấm công nhận diện khuôn mặt là gì?",
    answer:
      "Hệ thống chấm công nhận diện khuôn mặt là phương pháp hiện đại và tiên tiến để theo dõi điểm danh của nhân viên bằng công nghệ nhận diện khuôn mặt. Nó thường bao gồm một camera được trang bị phần mềm nhận diện khuôn mặt để chụp và phân tích đặc điểm khuôn mặt của nhân viên để xác minh danh tính của họ khi họ check-in hoặc check-out.",
  },
  {
    question: "Tại sao nên sử dụng nhận diện khuôn mặt cho việc chấm công?",
    answer:
      "Nhận diện khuôn mặt cho chấm công mang lại nhiều lợi thế hơn so với phương pháp truyền thống: 1) Độ chính xác – Công nghệ nhận diện khuôn mặt cung cấp phương pháp nhận dạng cá nhân chính xác và đáng tin cậy. 2) Hiệu quả – Tự động hóa theo dõi điểm danh qua nhận diện khuôn mặt tiết kiệm thời gian cho cả nhân viên và quản trị viên. 3) Ngăn chặn gian lận thời gian – Nhận diện khuôn mặt giúp ngăn chặn hành vi gian lận như điểm danh hộ. 4) Tăng cường bảo mật – Nhận diện khuôn mặt thêm một lớp bảo mật cho hệ thống điểm danh của bạn.",
  },
  {
    question: "Hệ thống chấm công camera hoạt động như thế nào?",
    answer:
      "Hệ thống chấm công camera sử dụng nhận diện khuôn mặt để xác định nhân viên khi họ vào hoặc ra khỏi cơ sở. Khuôn mặt của nhân viên được camera chụp lại, và hệ thống so sánh các hình ảnh khuôn mặt này với các mẫu đã lưu trữ để xác định danh tính và ghi lại điểm danh.",
  },
  {
    question: "Công nghệ nhận diện khuôn mặt có an toàn không?",
    answer:
      "Có! Chúng tôi sử dụng các biện pháp bảo mật tiên tiến như mã hóa dữ liệu an toàn để lưu trữ và bảo vệ dữ liệu nhận diện khuôn mặt, đảm bảo quyền riêng tư và tuân thủ các quy định liên quan.",
  },
];

const benefits = [
  {
    title: "Tiết kiệm thời gian",
    description:
      "Giảm thời gian chấm công và quản lý nhân sự, giúp tập trung vào các nhiệm vụ quan trọng khác.",
  },
  {
    title: "Tăng năng suất",
    description:
      "Tự động hóa quy trình chấm công giúp nhân viên tập trung vào công việc, tăng năng suất làm việc.",
  },
  {
    title: "Dễ dàng tích hợp",
    description:
      "Tích hợp liền mạch với các hệ thống quản lý nhân sự và tính lương hiện có.",
  },
  {
    title: "Bảo mật cao",
    description:
      "Bảo vệ dữ liệu chấm công với công nghệ mã hóa tiên tiến và kiểm soát truy cập chặt chẽ.",
  },
];

export default function Page() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section full-height">
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <Title level={1}>
              Hệ Thống Chấm Công Nhận Diện Khuôn Mặt MIỄN PHÍ 100%
            </Title>
            <Paragraph className="hero-description">
              Chuyển đổi quản lý chấm công bằng cách tích hợp nhận diện khuôn
              mặt tiên tiến với camera cho việc điểm danh nhân viên hiệu quả và
              không tiếp xúc. Miễn phí cho người dùng không giới hạn!
            </Paragraph>
            <Link href="/register">
              <Button type="primary" size="large" className="hero-button">
                BẮT ĐẦU NGAY - HOÀN TOÀN MIỄN PHÍ
              </Button>
            </Link>
          </div>

          <div className="hero-image-container">
            <div className="hero-image-placeholder">
              <Image
                src="/assets/image/homeimage/3Facial-recognition (1).png"
                alt="Chấm công trên điện thoại"
                width="100%"
                height="auto"
                preview={false}
              />
            </div>
          </div>
        </div>

        <div className="benefits-container">
          <Title level={2} className="section-title">
            Lợi ích của hệ thống chấm công nhận diện khuôn mặt
          </Title>

          <Row gutter={[24, 24]} className="benefits-row">
            {benefits.map((benefit, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="benefit-card">
                  <Title level={3} className="benefit-title">
                    {benefit.title}
                  </Title>
                  <Text className="benefit-description">
                    {benefit.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="hero-scroll-down">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Title level={2} className="section-title">
          Chấm công thông minh hơn, nhanh hơn với nhận diện khuôn mặt - hãy thử
          ngay!
        </Title>

        {features.map((feature, index) => (
          <Row
            key={index}
            className={`feature-row ${index % 2 === 1 ? "reverse" : ""}`}
            gutter={[48, 0]}
            align="middle"
          >
            <Col xs={24} md={12} className="feature-image-col">
              <div className="feature-image-placeholder">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width="100%"
                  height="auto"
                  preview={false}
                />
              </div>
            </Col>
            <Col xs={24} md={12} className="feature-content-col">
              <Title level={3} className="feature-title">
                {feature.title}
              </Title>
              <Title level={4} className="feature-subtitle">
                {feature.subtitle}
              </Title>
              <Paragraph className="feature-description">
                {feature.description}
              </Paragraph>
            </Col>
          </Row>
        ))}
      </section>

      {/* Mobile App Section */}
      <section className="mobile-app-section">
        <Title level={2} className="section-title">
          Ứng dụng di động - Chấm công mọi lúc mọi nơi
        </Title>

        <Row gutter={[48, 0]} align="middle">
          <Col xs={24} md={12} className="app-content-col">
            <Title level={3} className="app-title">
              Tải ứng dụng của chúng tôi
            </Title>
            <Paragraph
              className="app-description"
              style={{ textAlign: "left", width: "100%", maxWidth: "445px" }}
            >
              Chấm công dễ dàng từ điện thoại của bạn với ứng dụng di động tiện
              lợi. Nhận diện khuôn mặt, GPS, và nhiều tính năng khác ngay trong
              tầm tay bạn.
            </Paragraph>

            <div className="app-download-buttons">
              <Link
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button"
              >
                <Image
                  src="/assets/image/homeimage/English-10.png.webp"
                  alt="Google Play"
                  className="store-image"
                  width={180}
                  height={60}
                  preview={false}
                />
              </Link>

              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button"
              >
                <Image
                  src="/assets/image/homeimage/English-9.png.webp"
                  alt="App Store"
                  className="store-image"
                  width={180}
                  height={60}
                  preview={false}
                />
              </Link>
            </div>
          </Col>

          <Col xs={24} md={12} className="app-image-col">
            <div className="app-image-placeholder">
              <Image
                src="/assets/image/homeimage/GPSFR-New-York-833x1024-1.png"
                alt="Mobile App"
                width="100%"
                height="auto"
                preview={false}
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Title level={2} className="section-title">
          Vô số người dùng yêu thích hệ thống chấm công nhận diện khuôn mặt của
          chúng tôi
        </Title>

        <Row gutter={[24, 24]} className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <Card className="testimonial-card">
                <Title level={3} className="testimonial-title">
                  &ldquo;{testimonial.quote}&rdquo;
                </Title>
                <Divider className="testimonial-divider" />
                <Text strong className="testimonial-author">
                  {testimonial.author}
                </Text>
                <Text className="testimonial-position">
                  {testimonial.position}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <Title level={2} className="section-title">
          Câu hỏi thường gặp
        </Title>
        <Text className="faq-subtitle">Một số câu hỏi thường được hỏi...</Text>

        <Collapse
          className="faq-collapse"
          items={faqs.map((faq, index) => ({
            key: index,
            label: faq.question,
            children: <Paragraph>{faq.answer}</Paragraph>,
          }))}
        />
      </section>
    </div>
  );
}
