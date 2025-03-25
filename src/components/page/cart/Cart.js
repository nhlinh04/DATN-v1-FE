import React, { useState, useEffect } from 'react';
import './Cart.scss';
import { toast } from 'react-toastify';
import { getCartDetailByAccountId } from '../../../Service/ApiCartSevice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import ListImageProduct from '../../../image/ListImageProduct';
import { MdOutlineDeleteForever } from "react-icons/md";
import { plusCartDetail, subtractCartDetail, deleteCartDetail } from '../../../Service/ApiCartSevice'
import { findListPayProduct } from '../../../Service/ApiProductService';
import { createCartDetailByCartLocal } from '../../../Service/ApiCartSevice';
import { getAccountLogin } from "../../../Service/ApiAccountService";
import { initialize } from '../../../redux/action/authAction';
import { getCart, updateCartWithExpiration, deleteProductToCart, plusProductToCart, subtractProductToCart } from '../../managerCartLocal/CartManager'
import EventListener from '../../../event/EventListener'
const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [selectedCartDetails, setSelectedCartDetails] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [cartDetails, setCartDetails] = useState([]);
    const [user, setUser] = useState(null);
    const CART_KEY = "cartLocal";
    const checkLogin = async () => {
        setSelectedCartDetails([]);
        setSelectedProduct([]);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            try {
                if (getCart().items && getCart().items.length > 0) {
                    try {
                        let response = await findListPayProduct(getCart().items);
                        if (response.status === 200) {
                            const validProducts = response.data?.filter((product) => !product.error);
                            setCartDetails(validProducts);
                            const productPromoRequests = validProducts.map((product) => ({
                                idProduct: product.idProduct,
                                quantity: product.quantityBuy,
                            }));
                            updateCartWithExpiration(productPromoRequests);
                            const invalidProducts = response.data?.filter((product) => product.error);
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
                    setCartDetails([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng local:", error);
            }
            setUser(null);
            dispatch(initialize({ isAuthenticated: false, user: null }))
        } else {
            try {
                let users = await getAccountLogin();
                if (users.status === 200) {
                    const data = users.data;
                    try {
                        if (getCart().items && getCart().items.length > 0) {
                            for (const item of getCart().items) {
                                try {
                                    const response = await createCartDetailByCartLocal(item, data.id);
                                    if (response.status === 200) {
                                        await deleteProductToCart(item.idProduct);
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        }
                        const response = await getCartDetailByAccountId(data.id);

                        if (response.status === 200) {
                            setCartDetails(response.data);
                        }
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
                    }
                    setUser(data);
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
    useEffect(() => {
        const fetchLogin = async () => {
            await checkLogin();
        };
        fetchLogin();
    }, [dispatch]);


    useEffect(() => {
        const totalPrice = calculateTotalCartPriceForSelected();
        setTotalCartPrice(totalPrice);
    }, [selectedCartDetails, selectedProduct, cartDetails]);

    const calculateTotalCartPriceForSelected = () => {

        // Lọc các sản phẩm được chọn từ cartDetails
        let selectedProducts = cartDetails.filter(product =>
            selectedProduct.some(selected => selected.idProduct === product.idProduct)
        );
        if (user) {
            selectedProducts = cartDetails.filter(product =>
                selectedCartDetails.some(selected => selected.idCartDetail === product.idCartDetail)
            );
        }
        // Tính tổng giá các sản phẩm được chọn
        return selectedProducts.reduce((total, product) => {
            return total + calculatePricePerProduct(product);
        }, 0);
    };


    const formatCurrency = (value) => {
        if (!value) return 0;
        // Làm tròn thành số nguyên
        const roundedValue = Math.round(value) || 0;
        // Định dạng số thành chuỗi với dấu phẩy phân cách hàng nghìn
        return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePayment = () => {
        if (user) {
            if (selectedCartDetails.length > 0) {
                const listId = selectedCartDetails.map(item => item.idCartDetail);
                navigate(`/Payment`, {
                    state: {
                        selectedCartDetails: listId,
                        method: true
                    }
                });
            } else {
                toast.error("Bạn chưa chọn sản phẩm cần thanh toán");
            }
        } else {
            if (selectedProduct.length > 0) {
                const cartItems = getCart().items;
                const filteredItems = cartItems.filter(item =>
                    selectedProduct.some(selected => selected.idProduct === item.idProduct)
                );
                navigate(`/Payment`, {
                    state: {
                        listProducts: filteredItems,
                        method: false
                    }
                });
            }
            else {
                toast.error("Bạn chưa chọn sản phẩm cần thanh toán");
            }
        }
    };

    const calculatePricePerProduct = (product) => {
        const { pricePerBaseUnit, quantityCartDetail, quantityBuy, quantityPromotionDetail, value } = product;
        const quantity = user ? quantityCartDetail : quantityBuy;
        if (!value) {
            // Nếu không có khuyến mãi
            return pricePerBaseUnit * quantity;
        } else if (quantity <= quantityPromotionDetail) {
            // Nếu có khuyến mãi và số lượng trong giỏ <= số lượng được áp dụng khuyến mãi
            return pricePerBaseUnit * (1 - value / 100) * quantity;
        } else {
            // Nếu có khuyến mãi và số lượng trong giỏ > số lượng được áp dụng khuyến mãi
            return (
                pricePerBaseUnit * (1 - value / 100) * quantityPromotionDetail +
                pricePerBaseUnit * (quantity - quantityPromotionDetail)
            );
        }
    };
    const saleProduct = (product) => {
        const { pricePerBaseUnit, value } = product;
        if (!value) {
            // Nếu không có khuyến mãi
            return pricePerBaseUnit;
        } else {
            return pricePerBaseUnit * (1 - value / 100);
        }
    }
    // Handle checkbox for all products  
    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setIsAllChecked(isChecked);
        if (user) {
            if (isChecked) {
                const allCartDetails = cartDetails.map(item => ({ idCartDetail: item.idCartDetail }));
                setSelectedCartDetails(allCartDetails);
            } else {
                setSelectedCartDetails([]);
            }
        } else {
            if (isChecked) {
                const allProduct = cartDetails.map(item => ({ idProduct: item.idProduct }));
                setSelectedProduct(allProduct);
            } else {
                setSelectedProduct([]);
            }
        }

    };

    // Handle checkbox for individual products  
    const handleCheckProduct = (event, id) => {
        const isChecked = event.target.checked;
        if (user) {
            if (isChecked) {
                setSelectedCartDetails((prev) => [...prev, { idCartDetail: id }]);
            } else {
                setSelectedCartDetails((prev) => prev.filter(cartDetails => cartDetails.idCartDetail !== id));
            }
        } else {
            if (isChecked) {
                setSelectedProduct((prev) => [...prev, { idProduct: id }]);
            } else {
                setSelectedProduct((prev) => prev.filter(cartDetails => cartDetails.idProduct !== id));
            }
        }
    };
    const deleteByIdCartDetail = async (idProduct, user) => {
        if (idProduct) {
            try {
                const response = await deleteCartDetail(idProduct);
                if (response.status === 200) {
                    try {
                        const updatedCart = await getCartDetailByAccountId(user.id);
                        if (updatedCart.status === 200) {
                            setCartDetails(updatedCart.data);
                            setIsAllChecked(false);
                        }
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
                    }
                    toast.success(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm :", error);
            }

        }
    }
    const subtractByIdCartDetail = async (idProduct, user) => {
        if (idProduct) {
            try {
                const response = await subtractCartDetail(idProduct);
                if (response.status === 200) {
                    try {
                        const updatedCart = await getCartDetailByAccountId(user.id);
                        if (updatedCart.status === 200) {
                            setCartDetails(updatedCart.data);
                            setIsAllChecked(false);
                        }
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
                    }
                    toast.success("Trừ số lượng thành công!");
                }
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm :", error);
            }

        }
    }
    const plusByIdCartDetail = async (idProduct, user) => {
        if (idProduct) {
            try {
                const response = await plusCartDetail(idProduct);
                if (response.status === 200) {
                    try {
                        const updatedCart = await getCartDetailByAccountId(user.id);
                        if (updatedCart.status === 200) {
                            setCartDetails(updatedCart.data);
                            setIsAllChecked(false);
                        }
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
                    }
                    toast.success("Thêm thành công!");
                }
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm :", error);
            }

        }
    }
    const handleDeleteByIdCartDetail = async (idProduct) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            await deleteProductToCart(idProduct);
            checkLogin();
            setIsAllChecked(false);
            toast.error("Xóa thành công!")
        } else {
            try {
                let users = await getAccountLogin();
                if (users.status === 200) {
                    const data = users.data;
                    try {
                        deleteByIdCartDetail(idProduct, data);
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
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
    };
    const handleDecreaseQuantity = async (idProduct) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const isSuccess = await subtractProductToCart(idProduct);
            if (isSuccess) {
                checkLogin();
                setIsAllChecked(false);
                toast.success("Trừ số lượng thành công!");
            } else {
                toast.error("Trừ số lượng bại!");
            }
        } else {
            try {
                let users = await getAccountLogin();
                if (users.status === 200) {
                    const data = users.data;
                    try {
                        subtractByIdCartDetail(idProduct, data);
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
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
    };
    const handleIncreaseQuantity = async (idProduct) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const isSuccess = await plusProductToCart(idProduct);
            if (isSuccess) {
                checkLogin();
                setIsAllChecked(false);
                toast.success("Thêm thành công!");
            } else {
                toast.error("Thêm thất bại!");
            }
        } else {
            try {
                let users = await getAccountLogin();
                if (users.status === 200) {
                    const data = users.data;
                    try {
                        plusByIdCartDetail(idProduct, data);
                    } catch (error) {
                        window.location.href = "/cart";
                        console.error(error);
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
    };
    const checkBox = (item) => {
        if (user) {
            return selectedCartDetails.some(cartDetails => cartDetails.idCartDetail === item.idCartDetail);
        } else {
            return selectedProduct.some(cartDetails => cartDetails.idProduct === item.idProduct);
        }
    };
    const handlers = {
        UPDATE_CART: checkLogin
    };
    window.addEventListener('storage', (event) => {
        if (event.key === CART_KEY) {
            getCart();
            checkLogin();
        }
    });
    return (
        <div id="cart" className="inner m-5 p-5">
            <EventListener handlers={handlers} />
            <h1 className="cart-title">GIỎ HÀNG</h1>
            {cartDetails && cartDetails.length > 0 ? (
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='text-center'>
                                            <Form.Check
                                                type="checkbox"
                                                id="flexCheckAll"
                                                checked={isAllChecked}
                                                onChange={handleCheckAll}
                                            />
                                        </th>
                                        <th className='text-center'>#</th>
                                        <th className='text-center'>Ảnh</th>
                                        <th className='text-center'>Sản phẩm</th>
                                        <th className='text-center'>Giá</th>
                                        <th className='text-center'>Số lượng</th>
                                        <th className='text-center'>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="cart-list">
                                    {cartDetails.map((item, index) => (
                                        <tr key={user ? item.idCartDetail : item.idProduct}>
                                            <td className="text-center align-middle">
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`flexCheckCartDetails-${user ? item.idCartDetail : item.idProduct}`} // Fixed id syntax  
                                                    checked={checkBox(item)} // Check for inclusion correctly  
                                                    onChange={(event) => handleCheckProduct(event, user ? item.idCartDetail : item.idProduct)}
                                                />
                                            </td>
                                            <th scope="row" className="text-center align-middle">{index + 1}</th>
                                            <td className="d-flex justify-content-center align-items-center">
                                                <ListImageProduct
                                                    id={item?.idProduct}
                                                    maxWidth={'100px'}
                                                    maxHeight={'100px'}
                                                    containerClassName="product-image-container"
                                                    imageClassName="product-image"
                                                    center={true} // Căn giữa
                                                />
                                            </td>
                                            <td className="text-center align-middle">
                                                {item.nameProduct} ({item.baseUnit})
                                            </td>
                                            <td className="text-center align-middle">{formatCurrency(saleProduct(item))} VND</td>
                                            <td className="text-center align-middle">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <CiCircleMinus className="me-2" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => handleDecreaseQuantity(user ? item.idCartDetail : item.idProduct)} />
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Giá trị hiện tại là {user ? item.quantityCartDetail : item.quantityBuy}</Tooltip>}
                                                    >
                                                        <Form.Control
                                                            type="number"
                                                            readOnly
                                                            value={user ? item.quantityCartDetail : item.quantityBuy}
                                                            size="sm"
                                                            className="text-center mx-1"
                                                            style={{ width: `${Math.max(5, String(user ? item.quantityCartDetail : item.quantityBuy).length)}ch`, fontSize: '1.25rem' }}
                                                        />
                                                    </OverlayTrigger>
                                                    <CiCirclePlus className="ms-2" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => handleIncreaseQuantity(user ? item.idCartDetail : item.idProduct)} />
                                                </div>
                                            </td>

                                            <td className="text-center align-middle"><MdOutlineDeleteForever className='text-danger' size={'30px'} onClick={() => handleDeleteByIdCartDetail(user ? item.idCartDetail : item.idProduct)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                        <div className="cart-summary mb-3">
                            <span className="total-label">Tổng tiền:</span>
                            <h2>{formatCurrency(totalCartPrice)} VND</h2>
                        </div>
                        <div className="text-end">
                            <button className="btn btn-primary w-100" onClick={handlePayment}>Tiến hành thanh toán</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart text-center">
                    <h1>Giỏ hàng của bạn hiện chưa có sản phẩm nào</h1>
                    <img
                        src="https://banbuonuytin.com/tp/T0213/img/tmp/cart-empty.png"
                        alt="empty-cart"
                        className="img-fluid"
                    />
                </div>
            )}
        </div>
    );
}

export default Cart;
