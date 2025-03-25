import React from "react";
import "./about.scss";

const About = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <img
          src="/banner-gt.jpg"
          alt="Nông trại công nghệ cao"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>RAU CỦ QUẢ SẠCH TỪ NÔNG TRƯỜNG CÔNG NGHỆ CAO</h1>
          <p>
            Đồng hành cùng sự tươi ngon và an toàn cho bữa cơm gia đình Việt
          </p>
        </div>
      </section>

      <section className="reasons">
        <h2 className="text-uppercase">Lý do chọn chúng tôi</h2>
        <div className="reason-items">
          <div className="reason-item">
            <img src="/Sticker_Icon_brand.png" alt="Thương hiệu đáng tin cậy" />
            <p>THƯƠNG HIỆU ĐÁNG TIN CẬY</p>
          </div>
          <div className="reason-item">
            <img src="/Sticker_Icon_prod.png" alt="Sản phẩm sạch, an toàn" />
            <p>SẢN PHẨM SẠCH, AN TOÀN</p>
          </div>
          <div className="reason-item">
            <img src="/Sticker_Icon_tech.png" alt="Công nghệ cao" />
            <p>ÁP DỤNG CÔNG NGHỆ CAO</p>
          </div>
          <div className="reason-item">
            <img
              src="/Sticker_IconVN.png"
              alt="Trồng và thu hoạch tại Việt Nam"
            />
            <p>100% TẠI VIỆT NAM</p>
          </div>
        </div>
      </section>

        <section className="introduction">
        <div className="container">
            {/* Phần nội dung bên trái */}
            <div className="intro-content">
            <h2 className="intro-title">Giới thiệu chung</h2>
            <p>
                GreenEco tin rằng sức khỏe khởi nguồn từ những thực phẩm mà chúng ta tiêu thụ mỗi ngày.
                Chúng tôi cam kết mang đến những sản phẩm rau củ quả sạch, tươi ngon và đạt chuẩn quốc tế, 
                giúp nâng cao chất lượng bữa ăn và cuộc sống của mọi gia đình Việt. 
            </p>
            <p>
                Các sản phẩm rau củ quả của GreenEco được sản xuất theo quy trình công nghệ cao, 
                hợp tác cùng các đối tác hàng đầu thế giới như Netafim (Israel), 
                Kubota (Nhật Bản) và Teshuva Agricultural Projects - TAP (Israel).  
            </p>
            <p>
                GreenEco tuân thủ nghiêm ngặt nguyên tắc <b>"3 kiểm soát"</b> và <b>"4 không"</b>, đảm bảo từng sản phẩm không chỉ 
                an toàn mà còn giữ trọn hương vị tươi ngon và giá trị dinh dưỡng.
            </p>
            </div>

            {/* Phần hình ảnh bên phải */}
            <div className="intro-images">
            <div className="grid">
                <img src="/gt1.jpg" alt="Nông trại GreenEco" />
                <img src="/gt2.jpg" alt="Hệ thống tưới nước tự động" />
                <img src="/gt3.jpg" alt="Toàn cảnh nhà kính GreenEco" />
                <img src="/gt4.jpg" alt="Rau sạch đạt chuẩn VietGAP" />
            </div>
            </div>
        </div>
    </section>



      <section className="technology">
        <h2 className="text-uppercase">Các công nghệ sản xuất</h2>
        <div className="tech-items">
          <div className="tech-item">
            <img src="/gt1.jpg" alt="Kiểm soát tự động" />
            <h5>Thực hiện kiểm soát tự động</h5>
          </div>
          <div className="tech-item">
            <img src="/gt3.jpg" alt="Tưới tự động" />
            <h5>Sử dụng hệ thống tưới tự động thông minh</h5>
          </div>
          <div className="tech-item">
            <img src="/gt1.jpg" alt="Công nghệ IoT" />
            <h5>Áp dụng công nghệ IoT</h5>
          </div>
        </div>
      </section>

      <section className="products">
        <h2 className="text-uppercase">Sản phẩm nổi bật</h2>
        <div className="product-items">
          <div className="product-item">
            <img src="/Rau_an_song.png" alt="Rau ăn sống" />
            <p>Rau ăn sống</p>
          </div>
          <div className="product-item">
            <img src="/Rau_an_chin.png" alt="Rau nấu chín" />
            <p>Rau nấu chín</p>
          </div>
          <div className="product-item">
            <img src="/Nam.png" alt="Nấm" />
            <p>Nấm</p>
          </div>
          <div className="product-item">
            <img src="/Trai_cay.png" alt="Trái cây" />
            <p>Trái cây</p>
          </div>
        </div>
        <a href="/allProducts">
          <button className="order-btn">Xem sản phẩm</button>
        </a>
      </section>

      <section className="certificate">
        <h2 className="text-uppercase">Chứng nhận chất lượng</h2>
        <p>
          GreenEco luôn tuân thủ nghiêm ngặt các quy định về “an toàn” trong sản
          xuất và đạt tiêu chuẩn chất lượng: VietGap, GlobalGap, Organic.
        </p>

        <div className="cert-items">
          <div className="cer-item">
            <img src="/Sticker_icon_Vietgap.png" alt="TIÊU CHUẨN VIETGAP" />
            <p>TIÊU CHUẨN VIETGAP </p>
          </div>
          <div className="cer-item">
            <img
              src="/Sticker_Icon_Global_GAP.png"
              alt="TIÊU CHUẨN GLOBAL G.A.P"
            />
            <p>TIÊU CHUẨN GLOBAL G.A.P</p>
          </div>
          <div className="cer-item">
            <img src="/Sticker_Icon_Organic.png" alt="TIÊU CHUẨN ORGANIC" />
            <p>TIÊU CHUẨN ORGANIC</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
