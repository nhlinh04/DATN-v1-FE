import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProduct } from '../../../../../redux/action/productAction';
import ListImageProduct from '../../../../../image/ListImageProduct'
import { findProductResponseById } from '../../../../../Service/ApiProductService'
import { toast } from 'react-toastify';
const NotFoundData = '/NotFoundData.png';
const TableProductUpdate = ({ selectedProductIds, setSelectedProductIds }) => {
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
    // const [debouncedSearchName] = useDebounce(searchName, 1000);
    // useEffect(() => {
    //     if (debouncedSearchName) {
    //         dispatch(fetchSearchProduct(debouncedSearchName));
    //     } else {
    //         dispatch(fetchAllProduct());
    //     }
    // }, [debouncedSearchName, dispatch]);


    const [isAllChecked, setIsAllChecked] = useState(false);
    // Sửa hàm quản lý checkbox chọn tất cả
    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setIsAllChecked(isChecked);

        if (isChecked) {
            // Tạo mảng đối tượng chứa id và quantity mặc định là 1
            const allProductWithQuantity = listProduct.map(item => ({
                idPromotionDetail: item.idPromotionDetail,
                quantity: 1
            }));
            setSelectedProductIds(allProductWithQuantity);
        } else {
            setSelectedProductIds([]);
        }
    };

    // Sửa hàm quản lý checkbox từng sản phẩm
    const handleCheckProduct = (event, idPromotionDetail) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            // Thêm sản phẩm với quantity mặc định là 1
            setSelectedProductIds((prev) => [...prev, { idPromotionDetail, quantity: 1 }]);
        } else {
            // Loại bỏ sản phẩm theo id
            setSelectedProductIds((prev) => prev.filter((product) => product.idPromotionDetail !== idPromotionDetail));
        }
    };

    useEffect(() => {
        if (listProduct.length > 0) {
            const selectedIds = selectedProductIds.map(product => product.idPromotionDetail);
            const allChecked = listProduct.every(item => selectedIds.includes(item.idPromotionDetail));
            setIsAllChecked(allChecked);
        }
    }, [listProduct, selectedProductIds]);

    // Sửa hàm cập nhật số lượng
    const handleQuantityChange = async (event, idPromotionDetail, idProduct) => {
        try {
            let updatedQuantity = Math.max(1, Number(event.target.value)); // Đảm bảo số lượng >= 1
            let response = await findProductResponseById(idProduct);
            if (response.status === 200) {
                const data = response.data;
                if (updatedQuantity > data.quantity) {
                    toast.error("Số lượng sản phẩm giảm giá vượt quá số lượng sản phẩm");
                    updatedQuantity = data.quantity;
                }
                // Cập nhật quantity cho sản phẩm đã chọn
                setSelectedProductIds((prev) =>
                    prev.map((product) =>
                        product.idPromotionDetail === idPromotionDetail ? { ...product, quantity: updatedQuantity } : product
                    )
                );
            } else {
                toast.error("Xảy ra lỗi khi nhập số lượng sản phẩm");
                console.log("Xảy ra lỗi khi nhập số lượng sản phẩm");
            }

        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
                if (statusCode === 409) {
                    const { mess } = errorData;
                    toast.error(mess || "Lỗi khi bỏ trống Id.");
                }
            }
            toast.error(error)
            console.error("Lối khi nhập số lượng", error)
        }
    };

    // Hàm kiểm tra xem sản phẩm có được chọn không
    const isProductSelected = (id) => {
        return selectedProductIds.some(product => product.idPromotionDetail === id);
    };

    // Hàm lấy quantity của sản phẩm đã chọn
    const getSelectedQuantity = (id) => {
        const selectedProduct = selectedProductIds.find(product => product.idPromotionDetail === id);
        return selectedProduct ? selectedProduct.quantity : 1;
    };

    return (
        <>
            <div className='search-product mb-3'>
                <label htmlFor="nameProduct" className="form-label">Danh sách sản phẩm</label>
                <input
                    type="text"
                    className="form-control"
                    id="nameProduct"
                    placeholder="Tìm kiếm sản phẩm theo tên...."
                    onChange={(event) => setSearchName(event.target.value)}
                />
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
                            <th>Số lượng sản phẩm</th>
                            <th>Số lượng sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.idPromotionDetail}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            id={`flexCheckProduct-${item.idPromotionDetail}`}
                                            checked={isProductSelected(item.idPromotionDetail)}
                                            onChange={(event) => handleCheckProduct(event, item.idPromotionDetail)}
                                        />
                                    </td>
                                    <td>{index + 1 + (currentPage - 1) * 3}</td>
                                    <td><ListImageProduct id={item?.idProduct} maxWidth={'100px'} maxHeight={'100px'} /></td>
                                    <td>{item.nameProduct}</td>
                                    <td>{item.quantityProduct} {item.baseUnit}</td>
                                    <td>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="number"
                                                id="quantityPromotionDetail"
                                                name="quantityPromotionDetail"
                                                min="1"
                                                value={getSelectedQuantity(item.idPromotionDetail)}
                                                onChange={(event) => handleQuantityChange(event, item.idPromotionDetail, item.idProduct)}
                                                readOnly={!isProductSelected(item.idPromotionDetail)}
                                            />
                                            <InputGroup.Text id="basic-addon2">{item.baseUnit}</InputGroup.Text>
                                        </InputGroup>
                                    </td>
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

export default TableProductUpdate;