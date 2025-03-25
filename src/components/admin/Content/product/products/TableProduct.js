import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import './TableProduct.scss';
import { IoIosEye, IoMdAdd } from "react-icons/io";
import { updateStatusProductById } from '../../../../../redux/action/productAction'
import { Link } from 'react-router-dom';
import { FaPenToSquare } from "react-icons/fa6";
import ListImageProduct from '../../../../../image/ListImageProduct';
import ModelExportProduct from './ModelExportProduct'
import ModalProductHistory from './ModalProductHistory'
const NotFoundData = '/NotFoundData.png';
const TableShoe = ({ currentPage, setCurrentPage }) => {
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.listProduct);

    const itemsPerPage = 5;

    const sorted = [...product]

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sorted.length / itemsPerPage);

    const handleClickPage = (number) => {
        setCurrentPage(number);
    };

    // Xác định các trang được hiển thị dựa trên currentPage
    const getPaginationItems = () => {
        let startPage, endPage;

        if (totalPages <= 3) {
            // Nếu tổng số trang <= 3, hiển thị tất cả
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage === 1) {
            // Nếu đang ở trang đầu tiên
            startPage = 1;
            endPage = 3;
        } else if (currentPage === totalPages) {
            // Nếu đang ở trang cuối cùng
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            // Nếu đang ở giữa
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }

        return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
    };
    const formatCurrency = (value) => {
        if (!value) return '0';
        const roundedValue = Math.round(value) || 0;
        return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return (
        <>
            <Table striped bordered hover>
                <thead className='table'>
                    <tr>
                        <th className='text-center'>STT</th>
                        <th className='text-center'>Tên sản phẩm</th>
                        <th className='text-center'>Số lượng</th>
                        <th className='text-center'>Đơn vị gốc</th>
                        <th className='text-center'>Giá</th>
                        <th className='text-center'>Danh mục</th>
                        <th className='text-center'>Ảnh</th>
                        <th className='text-center'>Trạng thái</th>
                        <th className='text-center'>Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <tr key={`table-product-${item.id}`}>
                                <td className='text-center align-middle'>{index + 1 + (currentPage - 1) * 5}</td>
                                <td className='text-center align-middle'>{item.name}</td>
                                <td className='text-center align-middle'>{item.quantity} {item.baseUnit}</td>
                                <td className='text-center align-middle'>{item.baseUnit}</td>
                                <td className='text-center align-middle'>{formatCurrency(item.pricePerBaseUnit)} VND</td>
                                <td className='text-center align-middle'>{item.nameCategory}</td>
                                <td className="d-flex justify-content-center align-items-center">
                                    <ListImageProduct
                                        id={item?.id}
                                        maxWidth="100px"
                                        maxHeight="100px"
                                        containerClassName="product-image-container"
                                        imageClassName="product-image"
                                        center={true} // Căn giữa
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <div
                                        className="form-check form-switch d-flex justify-content-center align-items-center"
                                        style={{ padding: '0' }}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id={`flexSwitchCheckChecked-${item.id}`}
                                            checked={item.status === 'ACTIVE'}
                                            onChange={(e) => dispatch(updateStatusProductById(item.id, e.target.checked))}
                                            style={{ margin: 0 }}
                                        />
                                    </div>
                                </td>
                                <td className="text-center align-middle">
                                    <div className="d-flex justify-content-start justify-content-center align-items-center">
                                        <Link to={`/admins/manage-detail-product?idProduct=${item.id}`} className="mx-2">
                                            <Button variant='warning'>
                                                <IoIosEye />
                                            </Button>
                                        </Link>
                                        <Link to={`/admins/manage-update-product?idProduct=${item.id}`} className="mx-2">
                                            <Button variant="success">
                                                <FaPenToSquare />
                                            </Button>
                                        </Link>
                                        <ModelExportProduct idProduct={item.id} />
                                        <ModalProductHistory idProduct={item.id} />
                                    </div>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="preview-image justify-content-center text-center p-3">
                                <img src={NotFoundData} alt="Preview" style={{ maxWidth: "10%" }} />
                                <p className='p-3'>Không có dữ liệu</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='d-flex justify-content-center'>
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                    {getPaginationItems().map((page) => (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => handleClickPage(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </>
    );
};

export default TableShoe;
