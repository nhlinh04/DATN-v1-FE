import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProductPromotion, fetchFilterProductPromotion } from '../../../../redux/action/productDetailAction';
import { useDebounce } from 'use-debounce';
import ListImageProduct from '../../../../image/ListImageProduct'
const NotFoundData = '/NotFoundData.png';
const TableProduct = ({ selectedProductIds, setSelectedProductIds }) => {
    const dispatch = useDispatch();

    const listProduct = useSelector((state) => state.productDetail.listProductPromotion);
    const [isAllChecked, setIsAllChecked] = useState(false);

    useEffect(() => {
        dispatch(fetchAllProductPromotion());
    }, [dispatch]);

    const [searchName, setSearchName] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [debouncedSearchName] = useDebounce(searchName, 1000);

    useEffect(() => {
        if (debouncedSearchName ||  searchPrice !== "") {
            // dispatch(fetchFilterProductPromotion(debouncedSearchName, searchSize, searchColor, searchPrice));
            setCurrentPage(1);
        } else {
            dispatch(fetchAllProductPromotion());
        }

    }, [debouncedSearchName, searchColor, searchPrice, searchSize, dispatch]);

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
            const allProductDetails = listProduct.map(item => ({ idProduct: item.idProduct, quantity: 1 }));
            setSelectedProductIds(allProductDetails);
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
    const handleQuantityChange = (event, idProduct) => {
        const updatedQuantity = Math.max(1, Number(event.target.value)); // Ensure quantity>=1  
        setSelectedProductIds((prev) =>
            prev.map((product) =>
                product.idProduct === idProduct ? { ...product, quantity: updatedQuantity } : product
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
                <div className='col'>
                    <Form.Label>Khoảng Giá:</Form.Label>
                    <Form.Select
                        value={searchPrice}
                        onChange={(event) => setSearchPrice(event.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="under500">Dưới 500.000 VND</option>
                        <option value="500to2000">Từ 500.000 VND đến 2.000.000 VND</option>
                        <option value="above2000">Trên 2.000.000 VND</option>
                    </Form.Select>
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
                                            {item.nameProduct}[{item.nameColor}-{item.nameSize}]
                                        </div>
                                        <p>Màu: {item.nameColor} - Kích cỡ: {item.nameSize}</p>
                                    </td>
                                    <td>{item.quantityProductDetail}</td>
                                    <td>{item?.quantityPromotionDetail || 0}</td>
                                    <td style={{ maxWidth: 25 }}>
                                        <Form.Control
                                            type="number"
                                            id="quantityPromotionDetail"
                                            name="quantityPromotionDetail"
                                            min="1"
                                            max={item?.quantityProductDetail || 0}
                                            value={selectedProductIds.find(product => product.idProduct === item.idProduct)?.quantity || 1}
                                            onChange={(event) => handleQuantityChange(event, item.idProduct)}
                                            readOnly={!selectedProductIds.some(product => product.idProduct === item.idProduct)}
                                        />
                                    </td>
                                    {item.value ? (
                                        <td>
                                            <p className='text-danger'>
                                                {formatCurrency((item.productDetailPrice || 0) * (1 - (item.value / 100)))} VND
                                            </p>
                                            <p className="text-decoration-line-through">
                                                {formatCurrency(item.productDetailPrice || 0)} VND
                                            </p>
                                            {/* <Countdown endDate={item.endAtByPromotion} /> */}
                                        </td>
                                    ) : (
                                        <td>
                                            <p className=''>{formatCurrency(item.productDetailPrice || 0)} VND</p>
                                        </td>
                                    )}
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

export default TableProduct;
