import React, { useEffect, useState } from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarContent,
} from 'react-pro-sidebar';
import { FaUser, FaMoneyBillAlt, FaShoePrints, FaUserAstronaut, FaUsers } from 'react-icons/fa';
import { FaChartPie, FaBoxesPacking } from "react-icons/fa6";
import { MdOutlinePayment, MdLogout } from "react-icons/md";
import { GiConverseShoe, GiPresent, GiRunningShoe, GiMaterialsScience } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { BiSolidDiscount, BiCategory } from "react-icons/bi";
import { IoMdColorFill, IoIosResize } from "react-icons/io";
import { TbBrandArc } from "react-icons/tb";
import './SideBar.scss';
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image';
import { initialize } from '../../redux/action/authAction';
import { getAccountLogin } from '../../Service/ApiAccountService';
import { useDispatch } from 'react-redux';
const SideBar = (props) => {
    const dispatch = useDispatch();
    const { show, handleToggleSidebar } = props;
    const [account, setAccount] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            dispatch(initialize({ isAuthenticated: false, user: null }))
        } else {
            fetchAccount();
        }
    }, []);

    const fetchAccount = async () => {
        try {
            const response = await getAccountLogin();
            if (response.status === 200) {
                const data = response.data;
                setAccount(data);
                dispatch(initialize({ isAuthenticated: true, data }))
            }
        } catch (error) {
            dispatch(initialize({ isAuthenticated: false, user: null }))
            console.error('Failed to fetch account data:', error);
            setAccount(null);
        }
    };
    return (
        <div>
            <ProSidebar
                collapsed={!show}
                toggled={show}
                breakPoint="md"  // Sidebar ẩn khi màn hình nhỏ hơn 768px
                onToggle={handleToggleSidebar}
            >
                <SidebarHeader>
                    <div
                        style={{
                            padding: '24px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: 14,
                            letterSpacing: '1px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {show ? (
                            <Link to="/" className='text-center'>
                                <Image
                                    src="/logoPage.png"
                                    className="text-center"
                                    style={{ maxWidth: '30%' }}
                                />
                            </Link>
                        ) : (
                            <Link to="/" >
                                <Image
                                    src="/logoPage.png"
                                    className="text-center"
                                    style={{ maxWidth: '100%' }}
                                />
                            </Link>
                        )}

                    </div>

                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="circle">
                        {account?.role === "ADMIN" && <MenuItem icon={<FaChartPie />} suffix={<span className="badge red">New</span>}>
                            Thống kê <Link to="/admins/manage-statistical" />
                        </MenuItem>}
                    </Menu>
                    <Menu iconShape="circle">
                        <MenuItem icon={<FaMoneyBillAlt />}>
                            Bán hàng <Link to="/admins/manage-billByEmployee" />
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="circle">
                        <MenuItem icon={<MdOutlinePayment />}>
                            Quản lý hóa đơn <Link to="/admins/manage-bill" />
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="circle">
                        <SubMenu icon={<FaUsers />} title="Quản lý tài khoản">
                            <MenuItem icon={<FaUser />}>Quản lý khách hàng<Link to="/admins/manage-account-customer" /></MenuItem>
                            {account?.role === "ADMIN" && <MenuItem icon={<FaUserAstronaut />}>Quản lý nhân viên<Link to="/admins/manage-account-employee" /></MenuItem>}
                        </SubMenu>
                    </Menu>
                    {account?.role === "ADMIN" && <Menu iconShape="circle">
                        <SubMenu icon={<FaBoxesPacking />} title="Quản lý sản phẩm">
                            <MenuItem icon={<GiConverseShoe />}>Sản phẩm<Link to="/admins/manage-product" /></MenuItem>
                            <SubMenu icon={<GiRunningShoe />} title="Thuộc tính sản phẩm">
                                <MenuItem icon={<BiCategory />}>Danh mục<Link to="/admins/manage-category" /></MenuItem>
                            </SubMenu>
                        </SubMenu>
                    </Menu>}
                    {account?.role === "ADMIN" && <Menu iconShape="circle">
                        <SubMenu
                            icon={<GiPresent />}
                            title="Quản lý giảm giá"
                        >
                            <MenuItem icon={<RiDiscountPercentFill />}>Quản lý đợt giảm giá<Link to="/admins/manage-promotion" /></MenuItem>
                            <MenuItem icon={<BiSolidDiscount />}>Quản lý phiếu giảm giá<Link to="/admins/manage-voucher" /></MenuItem>
                        </SubMenu>
                    </Menu>}
                    <hr />
                    <Menu iconShape="circle">
                        <MenuItem icon={<MdLogout />}>
                            Đăng xuất <Link to="/logout" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>
            </ProSidebar>
        </div>
    )
}
export default SideBar;