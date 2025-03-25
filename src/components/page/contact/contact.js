import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { postCreateNewAccount } from "../../../Service/ApiAccountService";
import "./contact.scss";

const Contact = () => {
  // Schema xác thực form
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Họ và tên là bắt buộc")
      .min(2, "Tên ít nhất 2 ký tự")
      .max(50, "Không quá 50 ký tự"),
    phoneNumber: yup
      .string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^0[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    birthday: yup
      .date()
      .required("Ngày sinh là bắt buộc")
      .max(new Date(), "Ngày sinh không hợp lệ"),
    gender: yup
      .string()
      .required("Giới tính là bắt buộc")
      .oneOf(["1", "2"], "Chọn giới tính hợp lệ"),
  });

  // Xử lý gửi form
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = { ...values, role: "CUSTOMER", status: "ACTIVE" };
      const response = await postCreateNewAccount(payload);
      if (response.status === 200) {
        toast.success(response.data);
        resetForm();
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="banner-ct">
        <a href="/" className="banner-link">
          <img src="./banner-top.png" alt="Banner" />
        </a>
        <div className="banner-buttons">
          <h3>LIÊN HỆ</h3>
          <div className="link-back-ct">
            <a href="/" className="">
              Trang chủ
            </a>
            <a href="/allProducts" className="">
              Cửa hàng
            </a>
          </div>
        </div>
      </div>

      {/* Phần chính */}
      <div className="contact-container">
        <div className="contact-left">
          {/* Google Maps */}
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.2443808355342!2d105.80354257922139!3d21.01142613069844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9fd55e5677%3A0xea6e9608a672ac29!2zMTQzIMSQLiBOZ3V54buFbiBOZ-G7jWMgVsWpLCBUcnVuZyBIb8OgLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmlldG5hbQ!5e1!3m2!1sen!2s!4v1742376386644!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="contact-right">
          <div className="contact-info">
            <h1>Liên Hệ</h1>
            <p>
              <strong>Địa chỉ:</strong> 143 Nguyễn Ngọc Vũ - Trung Hòa - Cầu
              Giấy - Hà Nội
            </p>
            <p>
              <strong>Email:</strong> linhnhph33830@fpt.edu.vn
            </p>
            <p>
              <strong>Điện thoại:</strong> 088 888 8888
            </p>
          </div>

          {/* Form đăng ký */}
          <div className="contact-form">
            <h2>Đăng Ký</h2>
            <Formik
              initialValues={{
                name: "",
                phoneNumber: "",
                email: "",
                birthday: "",
                gender: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.name && touched.name ? "input-error" : ""
                      }
                    />
                    {touched.name && errors.name && (
                      <div className="error">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Số điện thoại"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.phoneNumber && touched.phoneNumber
                          ? "input-error"
                          : ""
                      }
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <div className="error">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email ? "input-error" : ""
                      }
                    />
                    {touched.email && errors.email && (
                      <div className="error">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="date"
                      name="birthday"
                      value={values.birthday}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.birthday && touched.birthday ? "input-error" : ""
                      }
                    />
                    {touched.birthday && errors.birthday && (
                      <div className="error">{errors.birthday}</div>
                    )}
                  </div>

                  <div className="gender-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="1"
                        onChange={handleChange}
                        checked={values.gender === "1"}
                      />
                      Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="2"
                        onChange={handleChange}
                        checked={values.gender === "2"}
                      />
                      Nữ
                    </label>
                  </div>
                  {touched.gender && errors.gender && (
                    <div className="error">{errors.gender}</div>
                  )}

                  <button type="submit" className="submit-btn">
                    ĐĂNG KÝ
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
