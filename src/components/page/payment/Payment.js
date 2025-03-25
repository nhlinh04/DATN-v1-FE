
import { useState, useEffect } from 'react';
import './Payment.scss';
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getCities, getDistricts, getWards } from "../../../Service/ApiProvincesService";
import { Formik } from 'formik';
import * as yup from 'yup';
import { payBillOnline, payBillOnlinev2 } from '../../../Service/ApiBillService';
import { getCartDetailByAccountIdAndListIdCartDetail } from '../../../Service/ApiCartSevice';
import { findListPayProduct } from '../../../Service/ApiProductService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ListImageProduct from '../../../image/ListImageProduct'
import { getAccountLogin } from "../../../Service/ApiAccountService";
import { findAccountAddress } from "../../../Service/ApiAddressService";
import ModalAddVoucher from './applyVoucher/ModalAddVoucher';
import EventListener from '../../../event/EventListener'
import swal from 'sweetalert';
import { initialize } from '../../../redux/action/authAction';
import { deleteSelectCartLocal } from '../../managerCartLocal/CartManager';
import { Pagination } from 'react-bootstrap';

import { Tooltip, OverlayTrigger } from 'react-bootstrap'
const Payment = () => {
    const SHIPPING_PRICE = Number(30000);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const IdCartDetail = (location.state?.selectedCartDetails || []).join(",");
    const method = location.state?.method ?? false;
    const listProducts = location.state?.listProducts || [];
    const [voucher, setVoucher] = useState({});

    const [currentItems, setCurrentItems] = useState([]);
    const [payProduct, setPayProduct] = useState([]);
    const [totalMerchandise, setTotalMerchandise] = useState(0);//Tổng tiền hàng đã mua
    const [priceDiscount, setPriceDiscount] = useState(0);//Giảm giá
    const [totalAmount, setTotalAmount] = useState(0);//Tổng tiền hàng đã bao gồm giảm giá
    const [address, setAddress] = useState({});
    const [idUser, setIdUser] = useState("");
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Calculate total pages
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = currentItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const checkLogin = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            try {
                findCartDetailPayNowAndLocal()
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng local:", error);
            }
            dispatch(initialize({ isAuthenticated: false, user: null }))
        } else {
            try {
                let users = await getAccountLogin();
                if (users.status === 200) {
                    const data = users.data;
                    setIdUser(data.id)
                    if (method) {
                        findCartDetailOfAccount(data)
                    } else {
                        findCartDetailPayNowAndLocal()
                    }
                    dispatch(initialize({ isAuthenticated: true, data }))
                } else {
                    dispatch(initialize({ isAuthenticated: false, user: null }))
                }
            } catch (error) {
                dispatch(initialize({ isAuthenticated: false, user: null }))
                console.error(error);
            }
        }
    }
    const findCartDetailOfAccount = async (user) => {
        if (IdCartDetail && IdCartDetail.length > 0) {
            try {
                let response = await getCartDetailByAccountIdAndListIdCartDetail(user.id, IdCartDetail);
                if (response.status === 200) {
                    setCurrentItems(response.data);
                    if (response.data.length <= 0) {
                        navigate('/cart')
                        toast.error("Không có sản phẩm trong giỏ hàng")
                    }
                }
            } catch (error) {
                console.error(error);
                navigate('/cart')
            }
        } else {
            navigate('/cart')
            toast.error("Không có sản phẩm cần thanh toán")
        }
    }
    const findCartDetailPayNowAndLocal = async () => {
        if (listProducts && listProducts.length > 0) {
            try {
                let response = await findListPayProduct(listProducts);
                if (response.status === 200) {
                    const validProducts = response.data.filter((product) => !product.error);
                    setCurrentItems(validProducts);
                    const productPromoRequests = validProducts.map((product) => ({
                        idProduct: product.idProduct,
                        quantity: product.quantityBuy,
                    }));

                    setPayProduct(productPromoRequests);
                    const invalidProducts = response.data.filter((product) => product.error);
                    console.error("Invalid products:", invalidProducts);
                    invalidProducts.forEach((product) => {
                        toast.error(product.error);
                    });
                    if (validProducts.length <= 0) {
                        toast.error("Không có sản phẩm cần thanh toán")
                        navigate('/')
                    }
                }
            } catch (error) {
                console.error(error);
                navigate('/')
            }
        } else {
            toast.error("Không có sản phẩm cần thanh toán")
            navigate('/')
        }
    }
    useEffect(() => {
        setSelectedCity("01");
        checkLogin()
    }, [dispatch]);

    function findAddressDetail(address) {
        if (address) {
            // Tách chuỗi thành một mảng các phần tử
            const addressParts = address.split(", ");

            // Lấy các phần tử từ đầu đến trước 4 phần tử cuối cùng
            const resultParts = addressParts.slice(0, -4);

            // Kết hợp lại thành chuỗi
            const resultAddress = resultParts.join(", ");

            return resultAddress ? resultAddress : "";
        }
    }
    //Dữ liệu thanh toán hóa đơn
    useEffect(() => {
        //Tính tổng tiền hàng
        let total = calculateTotalCartPriceForSelected();
        setTotalMerchandise(total);
    }, [currentItems, totalMerchandise, voucher]);

    const calculateTotalCartPriceForSelected = () => {
        // Tính tổng giá các sản phẩm được chọn
        return currentItems.reduce((total, product) => {
            return total + calculatePricePerProduct(product);
        }, 0);
    };
    useEffect(() => {
        //Tính tiền giảm giá
        let discount = voucher?.value || 0;
        let maximumDiscount = voucher?.maximumDiscount || 0;
        let sale = (totalMerchandise + SHIPPING_PRICE) * (discount / 100)
        if (maximumDiscount <= sale) {
            setPriceDiscount(maximumDiscount)
        } else {
            setPriceDiscount(sale)
        }

    }, [totalMerchandise, voucher]);

    useEffect(() => {
        //tính tổng tiền bao gồm giảm giá
        setTotalAmount(totalMerchandise + SHIPPING_PRICE - priceDiscount)
    }, [priceDiscount, voucher, totalMerchandise]);
    const handlers = {
        UPDATE_PAYMENT: checkLogin
    };


    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        getCities().then((data) => {
            setCities(data);
        });
    }, []);

    // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố được chọn
    useEffect(() => {
        if (selectedCity) {
            getDistricts(selectedCity).then((data) => {
                setDistricts(data);
                setWards([]); // Xóa danh sách phường/xã khi thay đổi tỉnh/thành phố
            });
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedCity]);

    // Lấy danh sách phường/xã dựa trên quận/huyện được chọn
    useEffect(() => {
        if (selectedDistrict) {
            getWards(selectedDistrict).then((data) => {
                setWards(data);
            });
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    // Hàm tìm kiếm theo mã và trả về tên
    function findByCode(code, data) {
        const result = data.find(item => String(item.code) === String(code)); // Chuyển mã thành chuỗi để so sánh chính xác
        return result ? result.name_with_type : "";
    }
    const formatCurrency = (value) => {
        if (!value) return 0;
        // Làm tròn thành số nguyên
        const roundedValue = Math.round(value) || 0;
        // Định dạng số thành chuỗi với dấu phẩy phân cách hàng nghìn
        return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const calculatePricePerProduct = (product) => {
        const {
            pricePerBaseUnit,
            quantityCartDetail,
            quantityBuy,
            quantityPromotionDetail,
            value
        } = product;

        // Áp dụng điều kiện để chọn số lượng phù hợp
        const quantity = method ? quantityCartDetail : quantityBuy;
        if (!value) {
            // Nếu không có khuyến mãi
            return pricePerBaseUnit * quantity;
        } else if (quantity <= quantityPromotionDetail) {
            // Nếu có khuyến mãi và số lượng <= số lượng được áp dụng khuyến mãi
            return pricePerBaseUnit * (1 - value / 100) * quantity;
        } else {
            // Nếu có khuyến mãi và số lượng > số lượng được áp dụng khuyến mãi
            return (
                pricePerBaseUnit * (1 - value / 100) * quantityPromotionDetail +
                pricePerBaseUnit * (quantity - quantityPromotionDetail)
            );
        }
    };


    // Validation schema
    const validationSchema = yup.object().shape({
        name: yup.string()
            .required('Tên là bắt buộc')
            .min(2, 'Tên phải chứa ít nhất 2 ký tự')
            .max(50, 'Tên không được vượt quá 50 ký tự')
            .matches(/^[A-Za-zÀ-ỹ\s]+$/, 'Tên không được chứa số hoặc ký tự đặc biệt'),
        phoneNumber: yup
            .string()
            .required('Số điện thoại là bắt buộc')
            .test('isValidPhone', 'Số điện thoại phải bắt đầu bằng số 0 và có từ 10 đến 11 số', (value) =>
                /^0[0-9]{9,10}$/.test(value)
            )
            .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
            .max(11, 'Số điện thoại không được quá 11 chữ số'),
        city: yup.string().required('Tỉnh/Thành phố là bắt buộc.'),
        district: yup.string().required('Quận/Huyện là bắt buộc.'),
        ward: yup.string().required('Phường/Xã là bắt buộc.'),
        address: yup.string().required('Địa chỉ chi tiết là bắt buộc').min(2, 'Địa chỉ chi tiết phải chứa ít nhất 2 ký tự').max(100, 'Địa chỉ chi tiết không được vượt quá 100 ký tự'),
        note: yup.string().max(250, 'Lời nhắn không được vượt quá 250 ký tự.')
    });
    const payBill = async (IdCartDetail, codeVoucher, idAccount, name, phoneNumber, address, note) => {
        try {
            const response = await payBillOnline(IdCartDetail, codeVoucher, idAccount, name, phoneNumber, address, note)
            if (response.status === 200) {
                toast.success("Thanh toán thành công!");
                return true;
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            return false;
        }
    }
    const payBillv2 = async (productPromoRequests, codeVoucher, idAccount, name, phoneNumber, address, note) => {
        try {
            const response = await payBillOnlinev2(productPromoRequests, codeVoucher, idAccount, name, phoneNumber, address, note)
            if (response.status === 200) {
                toast.success("Thanh toán thành công!");
                return true;
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            return false;
        }
    }

    const handleSubmitCreate = async (values) => {
        try {
            if (totalAmount > 100000000) {
                swal({
                    title: "Tổng thanh toán vượt quá giới hạn!",
                    text: "Tổng thanh toán không được vượt quá 100.000.000 VND. Vui lòng liên hệ đến hotline +84 888 888 888.",
                    icon: "error",
                    button: "OK",
                });
                return; // Dừng quá trình nếu vượt quá giới hạn
            }
            // Kiểm tra các trường cần thiết
            if (!values.name || !values.phoneNumber || !values.address || !values.city || !values.district || !values.ward) {
                swal({
                    title: "Thông tin chưa đầy đủ!",
                    text: "Vui lòng nhập đầy đủ thông tin bao gồm họ tên, số điện thoại, địa chỉ, thành phố, quận/huyện và phường/xã.",
                    icon: "warning",
                    button: "OK",
                });
                return; // Dừng quá trình nếu thiếu thông tin
            }
            const cityName = findByCode(values.city, cities);
            const districtName = findByCode(values.district, districts);
            const wardName = findByCode(values.ward, wards);
            const nameCustomer = values?.name || '';
            const phoneNumber = values?.phoneNumber || '';
            const note = values?.note || '';
            // Tạo địa chỉ đầy đủ
            const fullAddress = `${values.address}, ${wardName}, ${districtName}, ${cityName}, Việt Nam`;

            swal({
                title: "Bạn có muốn thanh toán sản phẩm?",
                text: `Thanh toán sản phẩm!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    if (method) {
                        // Gửi yêu cầu thanh toán
                        const isSuccess = await payBill(IdCartDetail, voucher.codeVoucher, idUser || '', nameCustomer, phoneNumber, fullAddress, note);

                        if (isSuccess) {
                            // Nếu thành công
                            swal("Thanh toán thành công!", {
                                icon: "success",
                            });
                            navigate('/cart')
                        } else {
                            // Nếu thất bại
                            swal("Thanh toán thất bại!", {
                                icon: "error",
                            });
                        }
                    } else {
                        const isSuccess = await payBillv2(payProduct, voucher.codeVoucher, idUser || '', nameCustomer, phoneNumber, fullAddress, note);

                        if (isSuccess) {
                            // Nếu thành công
                            if (payProduct && payProduct?.length > 0) {
                                deleteSelectCartLocal(payProduct)
                            }
                            swal("Thanh toán thành công!", {
                                icon: "success",
                            });
                            navigate('/')
                        } else {
                            // Nếu thất bại
                            swal("Thanh toán thất bại!", {
                                icon: "error",
                            });
                        }
                    }
                } else {
                    // Người dùng hủy thanh toán
                    swal("Hủy thanh toán!", {
                        icon: "info",
                    });
                }
            });
        } catch (error) {
            toast.error("Lỗi . Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="payment-container p-5 row">
            <EventListener handlers={handlers} />
            <div className="col-lg-6 col-md-12 p-5">
                <h4>Trang thanh toán</h4>
                <p className="text-custom-color">Kiểm tra các mặt hàng của bạn. Và chọn một phương thức vận chuyển phù hợp</p>
                {currentProducts?.map((item) => (
                    <div key={idUser ? item.idCartDetail : item.idProduct} className="payment-card">
                        <table className="product-table">
                            <tbody>
                                <tr>
                                    <td rowSpan="4" className="product-image-cell">
                                        <ListImageProduct
                                            id={item?.idProduct}
                                            maxWidth="150px"
                                            maxHeight="150px"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{item.nameProduct}</Tooltip>}
                                        >
                                            <p className="product-name truncate-text">{item.nameProduct} ({item.baseUnit})</p>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                                <tr><td>Số lượng: {(method ? item.quantityCartDetail : item.quantityBuy)}</td></tr>
                                <tr>
                                    {item.value ? (
                                        <td>
                                            <p className='text-danger'>
                                                {formatCurrency((item.pricePerBaseUnit || 0) * (1 - (item.value / 100)))} VND
                                            </p>
                                            <p className="text-decoration-line-through">
                                                {formatCurrency(item.pricePerBaseUnit || 0)} VND
                                            </p>
                                            {/* <Countdown endDate={item.endAtByPromotion} /> */}
                                        </td>
                                    ) : (
                                        <td>
                                            <p className=''>{formatCurrency(item.pricePerBaseUnit || 0)} VND</p>
                                        </td>
                                    )}
                                    <td colSpan="2" style={{ textAlign: 'right' }} className='text-danger'>
                                        Thành tiền: {formatCurrency(calculatePricePerProduct(item))} VND
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <hr className="dotted-line" />
                    </div>
                ))}
                <Pagination className="justify-content-center mt-4">
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>

                {/* Voucher Application */}
                <div className="voucher-container">
                    <h3>ÁP DỤNG MÃ GIẢM GIÁ</h3>
                    <div className="voucher-input-container">
                        <input
                            type="text"
                            value={voucher.codeVoucher}
                            placeholder="Nhập mã voucher tại đây"
                            className="voucher-input"
                            readOnly
                        />
                        <ModalAddVoucher totalMerchandise={totalMerchandise} setVoucher={setVoucher} />
                    </div>
                </div>
            </div>
            <Formik
                initialValues={{
                    name: address?.nameAccount || "",
                    phoneNumber: address?.phoneNumber || "",
                    city: "01",
                    district: address?.codeDistrict || "",
                    ward: address?.codeWard || "",
                    address: findAddressDetail(address?.address || ""),
                    note: "",
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={handleSubmitCreate}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <Form noValidate onSubmit={handleSubmit} className="col-lg-6 col-md-12 p-5">
                        <h4>Chi tiết thanh toán</h4>
                        <p className="text-custom-color">
                            Hoàn thành đơn đặt hàng của bạn bằng cách cung cấp chi tiết thanh toán của
                            bạn.
                        </p>
                        <div className="p-4">
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Nhập họ và tên"
                                        isInvalid={touched.name && !!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Nhập số điện thoại"
                                        isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Tỉnh/Thành Phố</Form.Label>
                                    <Form.Select
                                        name="city"
                                        value={values.city}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedCity(e.target.value);
                                            setFieldValue("district", "");
                                            setFieldValue("ward", "");
                                        }}
                                        onBlur={handleBlur}
                                        isInvalid={touched.city && !!errors.city}
                                        disabled
                                    >
                                        <option value="">Chọn Tỉnh/Thành Phố</option>
                                        {cities.map((city, index) => (
                                            <option key={index} value={city.code}>
                                                {city.name_with_type}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Quận/Huyện</Form.Label>
                                    <Form.Select
                                        name="district"
                                        value={values.district}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedDistrict(e.target.value);
                                            setFieldValue("ward", "");
                                        }}
                                        onBlur={handleBlur}
                                        isInvalid={touched.district && !!errors.district}
                                        disabled={!selectedCity}
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.code}>
                                                {district.name_with_type}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.district}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Phường/Xã</Form.Label>
                                    <Form.Select
                                        name="ward"
                                        value={values.ward}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.ward && !!errors.ward}
                                        disabled={!selectedDistrict}
                                    >
                                        <option value="">Chọn Phường/Xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name_with_type}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ward}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Địa chỉ cụ thể</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.address && !!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Lời nhắn</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="note"
                                    value={values.note}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.note && !!errors.note}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.note}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="radio"
                                    name="paymentMethod"
                                    label="Thanh toán khi nhận hàng"
                                    value="cod"
                                    defaultChecked
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <hr className="dotted-line" />

                            <div className="payment-summary">
                                <div className="summary-row">
                                    <span>Tổng tiền hàng</span>
                                    <span>{(totalMerchandise || 0).toLocaleString()} VND</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển</span>
                                    <span>{(SHIPPING_PRICE || 0).toLocaleString()} VND</span>
                                </div>
                                <div className="summary-row">
                                    <span>Giảm giá</span>
                                    <span>- {priceDiscount ? priceDiscount.toLocaleString() : "0"} VND</span>
                                </div>
                                <hr className="dotted-line" />
                                <div className="summary-row total">
                                    <span>Tổng thanh toán</span>
                                    <span className="highlight">
                                        {((totalAmount || 0)).toLocaleString()} VND
                                    </span>
                                </div>
                                <Button variant="primary" type="submit" className="btn btn-primary place-order-btn">
                                    Đặt hàng
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>;
        </div>
    );
};

export default Payment;