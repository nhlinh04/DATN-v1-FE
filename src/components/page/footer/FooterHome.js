import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaGoogle, FaInstagram, FaHome, FaEnvelope, FaPhone, FaPrint, FaLeaf } from 'react-icons/fa';

export default function FooterHome() {
  return (
    <footer
      className="text-center text-muted p-4"
      style={{
        backgroundColor:'#F9F6F1'
        // background: "linear-gradient(to top,rgb(223, 218, 222)   ,rgb(231, 255, 218))",
        // backdropFilter: "blur(8px)",
        // borderRadius: "12px 12px 0 0",
        // boxShadow: "0 -4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <style>
        {`
          .hover-effect {
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .hover-effect:hover {
            color: #73C135 !important;
            transform: translateY(-3px);
          }
          .t-content {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.8);
            // border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }
          .t-content h3 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
          }
          .t-content h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #73C135;
          }
          .t-content button {
            background: #73C135;
            color: white;
            padding: 10px 20px;
            font-size: 1.2rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .t-content button:hover {
            background: #5a9c2e;
            transform: scale(1.1);
          }
        `}
      </style>

      <section className="d-flex justify-content-center justify-content-lg-between align-items-center border-bottom pb-4 mb-4">
        <div className="me-5 d-none d-lg-block">
          <span className="fs-5 text-dark fw-semibold">Kết nối với chúng tôi trên các mạng xã hội:</span>
        </div>

        <div>
          <button className="me-3 text-reset fs-4 hover-effect" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaFacebook />
          </button>
          <button className="me-3 text-reset fs-4 hover-effect" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaTwitter />
          </button>
          <button className="me-3 text-reset fs-4 hover-effect" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaGoogle />
          </button>
          <button className="me-3 text-reset fs-4 hover-effect" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaInstagram />
          </button>
        </div>

        
      </section>
      <div className='t-content'>
          <h3>ĐĂNG KÝ NGAY</h3>
          <h1>NHẬN NGHÀN ƯU ĐÃI HẤP DẪN</h1>
          <a href='/register'><button>NOW</button></a>
          </div>
      <section>
        <Container className="text-center text-md-start mt-5">
          <Row className="mt-3">
            <Col md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase text-dark fw-bold mb-3">
                <FaLeaf className="me-2" />
                BEEGREEN
              </h6>
              <p className="text-dark">
                Thực phẩm xanh - Cuộc sống lành mạnh!
              </p>
            </Col>

            <Col md="3" lg="3" xl="3" className="mx-auto mb-4 text-dark">
              <h6 className="text-uppercase text-dark fw-bold mb-3">Hỗ trợ khách hàng</h6>
              <p className="mb-2">
                <a href="/policy" className="text-reset text-decoration-none hover-effect">Chính sách mua hàng</a>
              </p>
              <p className="mb-2">
                <a href="/shipping" className="text-reset text-decoration-none hover-effect">Chính sách giao hàng</a>
              </p>
              <p className="mb-2">
                <a href="/return" className="text-reset text-decoration-none hover-effect">Chính sách đổi trả</a>
              </p>
              <p className="mb-2">
                <a href="/safety" className="text-reset text-decoration-none hover-effect">An toàn thực phẩm</a>
              </p>
              <p>
                <a href="/privacy" className="text-reset text-decoration-none hover-effect">Chính sách bảo mật</a>
              </p>
            </Col>

            <Col md="3" lg="3" xl="3" className="mx-auto mb-4 text-dark">
              <h6 className="text-uppercase text-dark fw-bold mb-3">Về BeeGreen</h6>
              <p className="mb-2">
                <a href="/client/about" className="text-reset text-decoration-none hover-effect">Giới thiệu BeeGreen</a>
              </p>
              <p className="mb-2">
                <a href="/stores" className="text-reset text-decoration-none hover-effect">Hệ thống cửa hàng</a>
              </p>
              <p>
                <a href="/career" className="text-reset text-decoration-none hover-effect">Tuyển dụng</a>
              </p>
            </Col>

            <Col md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4 text-dark">
              <h6 className="text-uppercase text-dark fw-bold mb-3">Liên hệ</h6>
              <p className="mb-1">
                <FaHome className="me-2" />
                Cầu Giấy, Hà Nội, Việt Nam
              </p>
              <p className="mb-1">
                <FaEnvelope className="me-2" />
                contact@beegreen.vn
              </p>
              <p className="mb-1">
                <FaPhone className="me-2" /> +84 888 888 888
              </p>
              <p>
                <FaPrint className="me-2" /> +84 888 888 888
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </footer>
  );
}
