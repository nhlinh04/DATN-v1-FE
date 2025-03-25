import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProduct, fetchSearchProduct } from '../../../../../redux/action/productAction';
import { useDebounce } from 'use-debounce';
import ListImageProduct from '../../../../../image/ListImageProduct'

const NotFoundData = '/NotFoundData.png';
const TableProductDetail = () => {
    const dispatch = useDispatch();
    const listProduct = useSelector(state => state.promotion.listProductPromotion);
    useEffect(() => {
        dispatch(fetchAllProduct());
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const currentProduct = [...listProduct];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentProduct.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(currentProduct.length / itemsPerPage);

    const handleClickPage = (number) => {
        setCurrentPage(number);
    };

    const getPaginationItems = () => {
        let startPage, endPage;

        if (totalPages <= 3) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage === 1) {
            startPage = 1;
            endPage = 3;
        } else if (currentPage === totalPages) {
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }

        return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
    };

    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName] = useDebounce(searchName, 1000);
    useEffect(() => {
        if (debouncedSearchName) {
            dispatch(fetchSearchProduct(debouncedSearchName));
        } else {
            dispatch(fetchAllProduct());
        }
    }, [debouncedSearchName, dispatch]);


    return (
        <>
            <div className='search-product mb-3'>
                <label htmlFor="nameProduct" className="form-label">Danh sách sản phẩm</label>
            </div>
            <div className='table-product mb-3'>
                <Table striped bordered hover className='align-middle'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ảnh sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng sản phẩm</th>
                            <th>Số lượng sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.idPromotionDetail}>
                                    <td>{index + 1 + (currentPage - 1) * 3}</td>
                                    <td><ListImageProduct id={item?.idProduct} maxWidth={'100px'} maxHeight={'100px'} /></td>
                                    <td>{item.nameProduct}</td>
                                    <td>{item.quantityProduct} {item.baseUnit}</td>
                                    <td>{item.quantityPromotionDetail} {item.baseUnit}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="preview-image justify-content-center text-center p-3">
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
            </div>
        </>
    );
};

export default TableProductDetail;