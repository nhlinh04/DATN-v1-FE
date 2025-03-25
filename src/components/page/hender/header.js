import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaSignOutAlt, FaCartPlus, FaMicroblog } from 'react-icons/fa';
import { getAccountLogin } from '../../../Service/ApiAccountService';
import { useDispatch } from 'react-redux';
import './header.scss';
import { initialize } from '../../../redux/action/authAction';

function Header() {
    const dispatch = useDispatch();
    const [account, setAccount] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    // Fetch account data
    const fetchAccount = useCallback(async () => {
        try {
            const response = await getAccountLogin();
            if (response.status === 200) {
                const data = response.data;
                setAccount(data);
                dispatch(initialize({ isAuthenticated: true, user: data }));
            }
        } catch (error) {
            dispatch(initialize({ isAuthenticated: false, user: null }));
            setAccount(null);
        }
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            dispatch(initialize({ isAuthenticated: false, user: null }));
        } else {
            fetchAccount();
        }

        // Xử lý hiệu ứng thu nhỏ header khi scroll
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchAccount, dispatch]);

    return (
        <Navbar collapseOnSelect expand="lg" className={`header-navbar ${scrolled ? "scrolled" : ""}`} fixed="top">
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/">
                    <img src="/logoPage.png" alt="Logo" className="navbar-brand-img" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Menu chính */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto justify-content-center w-100">
                        <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/allProducts">Cửa hàng</Nav.Link>
                        <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>
                        {/* <Nav.Link as={Link} to="/blog">Blog</Nav.Link> */}
                    </Nav>

                    {/* Tài khoản / Đăng nhập */}
                    <Nav>
                        {account ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle as="a" href="#" className="d-flex text-dark align-items-center">
                                    <p style={{ fontSize: '16px' }} className="m-0">Hi, {account.name}</p>
                                    <img
                                        src={account.avatar || "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"}
                                        alt="Avatar"
                                        className="rounded-circle ms-2"
                                        height="40"
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">
                                        <FaUserAlt className="menu-icon" /> Tài khoản
                                    </Dropdown.Item>
                                    {account.role && (account.role === 'ADMIN' || account.role === 'EMPLOYEE') && (
                                        <Dropdown.Item as={Link} to="/admins">
                                            <FaMicroblog className="menu-icon" /> Quản lý
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item as={Link} to="/cart">
                                        <FaCartPlus className="menu-icon" /> Giỏ hàng
                                    </Dropdown.Item>
                                    <hr />
                                    <Dropdown.Item as={Link} to="/logout">
                                        <FaSignOutAlt className="menu-icon" /> Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Dropdown align="end">
                                <div className="d-flex align-items-center">
                                    <Link to="/cart" className="text-dark me-3">
                                        <FaCartPlus style={{ fontSize: '24px' }} />
                                    </Link>
                                    <Dropdown.Toggle as="div" className="d-flex align-items-center">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                            alt="Avatar"
                                            className="rounded-circle"
                                            height="30"
                                        />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/login">Đăng nhập</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/register">Đăng ký</Dropdown.Item>
                                    </Dropdown.Menu>
                                </div>
                            </Dropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
