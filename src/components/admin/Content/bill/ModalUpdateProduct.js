import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { getAllProductPromotion } from '../../../../Service/ApiProductService';

import ListImageProduct from '../../../../image/ListImageProduct'
const TableProduct = ({ selectedProductIds, setSelectedProductIds }) => {
    const dispatch = useDispatch();

    const [listProduct, setListProduct] = useState([]);

    const [isAllChecked, setIsAllChecked] = useState(false);

    const [searchName, setSearchName] = useState("");
    useEffect(() => {
        getProduct()
    }, [dispatch]);
    const filteredAccounts = listProduct.filter((product) => {
        const searchLower = searchName?.trim().toLowerCase();

        const namePromotion = product.nameProduct?.trim().toLowerCase().includes(searchLower);

        return (namePromotion);
    });
    const getProduct = async () => {
        try {
            const response = await getAllProductPromotion();
            if (response.status === 200) {
                const data = response.data;
                setListProduct(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const currentProduct = [...filteredAccounts];

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
    // Hàm làm tròn và định dạng số
    const formatCurrency = (value) => {
        // Làm tròn thành số nguyên
        const roundedValue = Math.round(value);
        // Định dạng số thành chuỗi với dấu phẩy phân cách hàng nghìn
        return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    // Handle checkbox for all products  
    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setIsAllChecked(isChecked);

        if (isChecked) {
            const allProducts = listProduct.map(item => ({ idProduct: item.idProduct, quantity: 1 }));
            setSelectedProductIds(allProducts);
        } else {
            setSelectedProductIds([]);
        }
    };

    // Handle checkbox for individual products  
    const handleCheckProduct = (event, idProduct) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            // Add product if not in selectedProductIds  
            setSelectedProductIds((prev) => {
                const existingProduct = prev.find(product => product.idProduct === idProduct);
                if (!existingProduct) {
                    return [...prev, { idProduct, quantity: 1 }];
                }
                return prev; // Return previous state if product is already checked  
            });
        } else {
            // Remove product if unchecked  
            setSelectedProductIds((prev) => prev.filter(product => product.idProduct !== idProduct));
        }
    };

    // Handle quantity change  
    const handleQuantityChange = (event, idProduct, maxQuantity) => {
        const updatedQuantity = event.target.value;
        const billQuanttity = (updatedQuantity < maxQuantity) ? updatedQuantity : maxQuantity;
        setSelectedProductIds((prev) =>
            prev.map((product) =>
                product.idProduct === idProduct ? { ...product, quantity: parseFloat(billQuanttity) } : product
            )
        );
    };

    // Sync checkbox state with selectedProductIds and listProduct  
    useEffect(() => {
        if (listProduct.length > 0) {
            const allChecked = listProduct.every(item =>
                selectedProductIds.some(product => product.idProduct === item.idProduct)
            );
            setIsAllChecked(allChecked);
        }
    }, [listProduct, selectedProductIds]);


    return (
        <>
            <div className='search-product row mb-3'>
                <div className='col'>
                    <label htmlFor="nameProduct" className="form-label">Tên sản phẩm</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nameProduct"
                        placeholder="Tìm kiếm sản phẩm theo tên...."
                        onChange={(event) => setSearchName(event.target.value)}
                    />
                </div>
            </div>
            <div className='table-product mb-3'>
                <Table striped bordered hover className='align-middle'>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    id="flexCheckAll"
                                    checked={isAllChecked}
                                    onChange={handleCheckAll}
                                />
                            </th>
                            <th>#</th>
                            <th>Ảnh sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Số lượng sale</th>
                            <th>Số lượng mua</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.idProduct}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            id={`flexCheckProduct-${item.idProduct}`} // Fixed id syntax  
                                            checked={selectedProductIds.some(product => product.idProduct === item.idProduct)} // Check for inclusion correctly  
                                            onChange={(event) => handleCheckProduct(event, item.idProduct)}
                                        />
                                    </td>
                                    <td>{index + 1 + (currentPage - 1) * 3}</td>
                                    <td><ListImageProduct id={item?.idProduct} maxWidth={'100px'} maxHeight={'100px'} /></td>
                                    <td>
                                        <div>
                                            {item.nameProduct} ({item.baseUnit})
                                        </div>
                                    </td>
                                    <td>{item?.quantityProduct || 0}</td>
                                    <td>{item?.quantityPromotionDetail || 0}</td>
                                    <td style={{ maxWidth: 25 }}>
                                        <Form.Control
                                            type="number"
                                            id="quantityPromotionDetail"
                                            name="quantityPromotionDetail"
                                            value={selectedProductIds.find(product => product.idProduct === item.idProduct)?.quantity || 1}
                                            onChange={(event) => handleQuantityChange(event, item.idProduct, item?.quantityProduct || 0)}
                                            readOnly={!selectedProductIds.some(product => product.idProduct === item.idProduct)}
                                        />
                                    </td>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className='text-center'>Không tìm thấy danh sách</td>
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
