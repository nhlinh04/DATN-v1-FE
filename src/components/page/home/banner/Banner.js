import React from "react";
import { Link } from "react-router-dom";
import "./Banner.scss";

const Banner = () => {
  return (
    <div className="banner">
      {/* Background */}
      <div className="banner__background"></div>

      {/* Overlay */}
      <div className="banner__overlay"></div>

      {/* Main Banner Content */}
      <div className="banner__content">
        <h2>GIAO TẬN TAY NGƯỜI DÙNG NHANH</h2>
        <h1>THỰC PHẨM GREENECO</h1>
        <h6>Chúng tôi cung cấp các sản phẩm hữu cơ chất lượng cao</h6>
        <Link to="/allProducts">
          <button className="banner__button">MUA NGAY</button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
