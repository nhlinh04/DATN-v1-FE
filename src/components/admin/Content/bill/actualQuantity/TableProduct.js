import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ListImageProduct from '../../../../../image/ListImageProduct';
import { findProductResponseById } from '../../../../../Service/ApiProductService'

const TableProduct = ({ billDetail, actualQuantities, setActualQuantities }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 3;
    const currentProduct = billDetail;

    useEffect(() => {
        const initialQuantities = currentProduct.map(item => ({
            id: item.id,
            actualQuantity: 0
        }));
        setActualQuantities(initialQuantities);
    }, [currentProduct]);

    // Xử lý khi người dùng thay đổi actualQuantity
    const handleActualQuantityChange = async (id, idProduct, value) => {
        let updatedQuantity = parseFloat(value);

        // Kiểm tra giá trị âm
        if (updatedQuantity < 0) {
            updatedQuantity = 0;
        }

        // Gọi hàm kiểm tra số lượng từ API
        updatedQuantity = await getProduct(updatedQuantity, idProduct);

        // Cập nhật state
        setActualQuantities(prev =>
            prev.map(item =>
                item.id === id ? { ...item, actualQuantity: updatedQuantity || 0 } : item
            )
        );
    };

    // Hàm kiểm tra số lượng từ API
    const getProduct = async (updatedQuantity, idProduct) => {
        try {
            const response = await findProductResponseById(idProduct);
            if (response.status === 200) {
                const data = response.data;
                // Kiểm tra nếu số lượng nhập vào vượt quá số lượng tồn kho
                if (updatedQuantity > data.quantity) {
                    toast.error("Số lượng sản phẩm giảm giá vượt quá số lượng tồn kho");
                    return data.quantity; // Trả về số lượng tối đa
                }
                return updatedQuantity; // Trả về số lượng hợp lệ
            } else {
                toast.error("Xảy ra lỗi khi kiểm tra số lượng sản phẩm");
                return updatedQuantity; // Trả về giá trị ban đầu nếu API lỗi
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Xảy ra lỗi khi kiểm tra số lượng sản phẩm");
            return updatedQuantity; // Trả về giá trị ban đầu nếu có lỗi
        }
    };

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

    return (
        <>
            <div className='table-product mb-3'>
                <Table striped bordered hover className='align-middle'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ảnh sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Số lượng thực</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((item, index) => {
                                const realValueIndex = (currentPage - 1) * itemsPerPage + index;
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td><ListImageProduct id={item?.idProduct} maxWidth={'100px'} maxHeight={'100px'} /></td>
                                        <td>
                                            <div>
                                                {item.nameProduct} ({item.baseUnit})
                                            </div>
                                        </td>
                                        <td>{item?.quantity || 0}</td>
                                        <td style={{ maxWidth: 25 }}>
                                            <Form.Control
                                                type="number"
                                                name="actualQuantity"
                                                min="0" // Đảm bảo không nhập số âm từ UI
                                                value={actualQuantities.find(q => q.id === item.id)?.actualQuantity || 0}
                                                onChange={(e) => handleActualQuantityChange(item.id, item.idProduct, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className='text-center'>Không tìm thấy danh sách</td>
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

export default TableProduct;