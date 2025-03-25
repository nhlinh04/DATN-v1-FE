import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import uploadFile from './pngegg.png'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCategoryActive } from '../../../../../../redux/action/categoryAction';

const InfoProduct = ({ product, setProduct, formErrors, setFormErrors, handleSubmitUpdate, images }) => {
    const dispatch = useDispatch();
    const [listImage, setListImage] = useState({
        previewImages: []
    });
    const resetForm = () => {
        setProduct({
            id: null,
            name: '',
            pricePerBaseUnit: '',
            quantity: '',
            baseUnit: '',
            idCategory: '',
            listImages: []
        });

        setListImage({
            previewImages: []
        });
    };

    const categorys = useSelector((state) => state.category.listCategory);

    useEffect(() => {
        dispatch(fetchAllCategoryActive());
    }, [dispatch]);

    const formatNumber = (value) => {
        if (!value) return '';

        // Chỉ cho phép nhập số
        let cleanValue = value.replace(/[^0-9]/g, '');

        // Chuyển về số nguyên để kiểm tra giới hạn
        let numericValue = parseInt(cleanValue, 10) || 0;

        // Giới hạn tối đa 1.000.000
        if (numericValue > 1000000) {
            numericValue = 1000000;
        }

        // Định dạng lại số với dấu chấm ngăn cách hàng nghìn
        return numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseNumber = (formattedValue) => {
        return formattedValue.replace(/\./g, '');
    };

    const validateField = (field, value, minLength = 2, maxLength = 100) => {
        if (!value.trim()) return `${field} là bắt buộc`;
        if (value.trim().length < minLength) return `${field} phải có ít nhất ${minLength} ký tự`;
        if (value.trim().length > maxLength) return `${field} không được vượt quá ${maxLength} ký tự`;
        return null;
    };

    const validateForm = (fieldName, fieldValue) => {
        const errorMessages = {
            name: "Tên sản phẩm",
            baseUnit: "Đơn vị gốc sản phẩm",
            pricePerBaseUnit: "Giá sản phẩm",
            quantity: "Số lượng sản phẩm",
            idCategory: "Danh mục",
            previewImage: "Vui lòng upload hình ảnh",
        };

        const errors = {};

        if (fieldName in errorMessages) {
            if (fieldName === "pricePerBaseUnit") {
                errors[fieldName] = fieldValue.trim() ? null : errorMessages[fieldName] + " là bắt buộc";
            } else if (fieldName === "quantity") {
                const numericValue = parseNumber(fieldValue);
                const num = Number(numericValue);
                if (!numericValue) {
                    errors[fieldName] = errorMessages[fieldName] + " là bắt buộc";
                } else if (!num) {
                    if (isNaN(num)) {
                        errors[fieldName] = "Số lượng phải là một số hợp lệ";
                    } else if (num < 1) {
                        errors[fieldName] = "Số lượng phải lớn hơn hoặc bằng 1";
                    } else if (num > 100000) {
                        errors[fieldName] = "Số lượng không được vượt quá 100.000";
                    }
                } else {
                    errors[fieldName] = null;
                }
            } else if (fieldName === "idCategory") {
                // Chỉ kiểm tra xem đã chọn danh mục hay chưa
                errors[fieldName] = fieldValue ? null : "Vui lòng chọn danh mục";
            } else {
                // Các trường khác (name, baseUnit) vẫn sử dụng validateField
                errors[fieldName] = validateField(errorMessages[fieldName], fieldValue);
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'pricePerBaseUnit') {
            const formattedValue = formatNumber(value);
            setProduct((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));

            const newError = validateForm(name, formattedValue);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        } else if (name === 'quantity') {
            const formattedValue = value;
            setProduct((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));

            const newError = validateForm(name, formattedValue);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        } else {
            setProduct((prev) => ({
                ...prev,
                [name]: value,
            }));

            const newError = validateForm(name, value);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'pricePerBaseUnit') {
            const formattedValue = formatNumber(value);
            setProduct((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));

            const newError = validateForm(name, formattedValue);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        } else if (name === 'quantity') {
            const formattedValue = value;
            setProduct((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));

            const newError = validateForm(name, formattedValue);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        } else {
            setProduct((prev) => ({
                ...prev,
                [name]: value,
            }));

            const newError = validateForm(name, value);
            setFormErrors((prev) => ({
                ...prev,
                ...newError,
            }));
        }
    };

    const handleUploadImages = (files) => {
        const fileList = Array.from(files);

        // Tính số lượng ảnh hiện tại và ảnh mới
        const currentImageCount = listImage.previewImages.length;
        const newImageCount = fileList.length;
        const totalImageCount = currentImageCount + newImageCount;

        // Nếu tổng số ảnh vượt quá 5
        if (totalImageCount > 5) {
            // Tính số lượng ảnh cần giữ lại từ danh sách mới
            const slotsAvailable = 5 - currentImageCount;
            const imagesToAdd = fileList.slice(0, slotsAvailable);

            // Nếu vẫn còn vượt quá 5, thay thế hoàn toàn bằng 5 ảnh cuối
            if (imagesToAdd.length < newImageCount && totalImageCount > 5) {
                const newImages = fileList.slice(-5); // Lấy 5 ảnh cuối từ danh sách mới

                const newPreviewImages = newImages.map((file) => URL.createObjectURL(file));
                const readers = newImages.map(
                    (file) =>
                        new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const bytes = new Uint8Array(e.target.result);
                                resolve(Array.from(bytes));
                            };
                            reader.readAsArrayBuffer(file);
                        })
                );

                Promise.all(readers).then((bytesArray) => {
                    setProduct((prev) => ({
                        ...prev,
                        listImages: bytesArray
                    }));
                    setListImage({
                        previewImages: newPreviewImages
                    });
                });
            } else {
                // Thêm các ảnh mới vào danh sách hiện tại
                const newPreviewImages = imagesToAdd.map((file) => URL.createObjectURL(file));
                const readers = imagesToAdd.map(
                    (file) =>
                        new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const bytes = new Uint8Array(e.target.result);
                                resolve(Array.from(bytes));
                            };
                            reader.readAsArrayBuffer(file);
                        })
                );

                Promise.all(readers).then((bytesArray) => {
                    setProduct((prev) => ({
                        ...prev,
                        listImages: [...prev.listImages, ...bytesArray]
                    }));
                    setListImage((prev) => ({
                        previewImages: [...prev.previewImages, ...newPreviewImages]
                    }));
                });
            }
        } else {
            // Nếu tổng số ảnh không vượt quá 5, thêm bình thường
            const newPreviewImages = fileList.map((file) => URL.createObjectURL(file));
            const readers = fileList.map(
                (file) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const bytes = new Uint8Array(e.target.result);
                            resolve(Array.from(bytes));
                        };
                        reader.readAsArrayBuffer(file);
                    })
            );

            Promise.all(readers).then((bytesArray) => {
                setProduct((prev) => ({
                    ...prev,
                    listImages: [...prev.listImages, ...bytesArray]
                }));
                setListImage((prev) => ({
                    previewImages: [...prev.previewImages, ...newPreviewImages]
                }));
            });
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) handleUploadImages(files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) handleUploadImages(files);
    };

    const handleRowClick = () => {
        document.getElementById('uploadListFiles').click();
    };

    return (
        <Container fluid>
            <Form.Group className="m-3">
                <Form.Label>Tên sản phẩm:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm ..."
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={formErrors?.name}
                />
                <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                </Form.Control.Feedback>
            </Form.Group>
            <Row>
                <Col className="m-3">
                    <Form.Group>
                        <Form.Label>Số lượng:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số lượng sản phẩm ..."
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={formErrors?.quantity}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.quantity}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="m-3">
                    <Form.Group>
                        <Form.Label>Giá sản phẩm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập giá sản phẩm ..."
                            name="pricePerBaseUnit"
                            value={product.pricePerBaseUnit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={formErrors?.pricePerBaseUnit}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.pricePerBaseUnit}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col className="m-3">
                    <Form.Group>
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select
                            name="idCategory"
                            value={product.idCategory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={formErrors?.idCategory}
                        >
                            <option value="">Chọn danh mục</option>
                            {categorys?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.idCategory}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="m-3">
                    <Form.Group>
                        <Form.Label>Đơn vị gốc sản phẩm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập đơn vị gốc sản phẩm ..."
                            name="baseUnit"
                            value={product.baseUnit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={formErrors?.baseUnit}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.baseUnit}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Control
                type="file"
                id="uploadListFiles"
                accept="image/*"
                style={{ display: "none" }}
                multiple
                onChange={handleFileChange}
            />
            <Row
                className="preview-image p-3"
                style={{
                    cursor: 'pointer',
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    borderColor: 'LightGray',
                    minHeight: '100px',
                    display: 'flex', // Sử dụng flex để căn giữa
                    justifyContent: 'center', // Căn giữa theo chiều ngang
                    alignItems: 'center', // Căn giữa theo chiều dọc
                }}
                onClick={handleRowClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Col className="d-flex justify-content-center align-items-center flex-wrap">
                    {listImage.previewImages.length > 0 ? (
                        listImage.previewImages.slice(0, 5).map((image, index) => (
                            <img
                                src={image}
                                alt={`Preview ${index}`}
                                style={{ maxWidth: '20%', margin: '5px' }} // Thay className m-2 bằng style để kiểm soát tốt hơn
                                key={index}
                            />
                        ))
                    ) : (
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            {images && images.length > 0 ? (
                                images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`data:image/jpeg;base64,${image.imageByte}`}
                                        alt={`Product ${index}`}
                                        style={{ maxWidth: '20%', margin: '5px' }}
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/100x100'; // Placeholder image if error
                                        }}
                                    />
                                ))
                            ) : (
                                <>
                                    <img src={uploadFile} alt="Preview" style={{ maxWidth: '20%', marginRight: '10px' }} />
                                    <p className="m-0">Kéo thả file hoặc nhấn vào đây để upload</p>
                                </>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
            <Row className='m-4 text-end'>
                <Col>
                    <Button className='mx-3' variant="success" onClick={() => resetForm()}>Reset Form</Button>
                    <Button className='mx-3' variant="primary" onClick={() => handleSubmitUpdate()}>Cập nhật sản phẩm</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default InfoProduct;