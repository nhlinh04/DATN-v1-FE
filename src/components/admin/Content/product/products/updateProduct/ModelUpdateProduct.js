import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import AuthGuard from '../../../../../auth/AuthGuard';
import RoleBasedGuard from '../../../../../auth/RoleBasedGuard';
import { updatePutProduct, fetchAllProductProductDetail } from '../../../../../../redux/action/productAction';
import { findListProductUnitsByIdByIdProduct } from '../../../../../../Service/ApiProductUnitsService';
import { findProductByIdProduct } from '../../../../../../redux/action/productAction'
import InfoProduct from './InfoProduct';
import ModelUpdateUntis from './ModelUpdateUntis';
import './ModelUpdateProduct.scss';
import { findListImageByIdProduct } from '../../../../../../Service/ApiProductImage';
// Initial state cho product
const initialProductState = {
    id: null,
    name: '',
    pricePerBaseUnit: '',
    quantity: '',
    baseUnit: '',
    idCategory: '',
    listImages: [],
};

const ModelUpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const idProduct = searchParams.get('idProduct');
    const productOld = useSelector((state) => state.product.product);
    const [images, setImages] = useState([]);
    const [product, setProduct] = useState(initialProductState);
    const [idProductUnits, setIdProductUnits] = useState([]);
    const [productUnits, setProductUnits] = useState([
        {
            id: null,
            unitName: '',
            conversionFactor: '',
            type: false,
        },
    ]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (idProduct) {
            getData(idProduct);
            findProductUnits();
            fetchImage();
        }

    }, [dispatch, idProduct]);

    useEffect(() => {
        if (productOld) {
            setProduct({
                id: productOld.id,
                name: productOld.name,
                pricePerBaseUnit: formatNumber(String(productOld.pricePerBaseUnit)),
                quantity: productOld.quantity,
                baseUnit: productOld.baseUnit,
                idCategory: productOld.idCategory,
                listImages: [],
            });
        }
    }, [productOld]);
    const formatNumber = (value) => {
        if (!value) return '';
        const cleanValue = value.replace(/[^0-9]/g, '');
        return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    const getData = (idProduct) => {
        if (idProduct) {
            dispatch(findProductByIdProduct(idProduct));
        }
    }
    const findProductUnits = async () => {
        try {
            const response = await findListProductUnitsByIdByIdProduct(idProduct);
            if (response && response.status === 200) {
                const data = response.data;
                setProductUnits(
                    data.map((unit) => ({
                        id: unit.id,
                        unitName: unit.unitName,
                        conversionFactor: unit.conversionFactor,
                        type: unit.type,
                    }))
                );
            } else {
                toast.error('Lỗi khi tải danh sách sản phẩm');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi tải danh sách sản phẩm');
        }
    };
    const fetchImage = async () => {
        try {
            const response = await findListImageByIdProduct(idProduct);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    // Validate product
    const validateProduct = (productData) => {
        const errors = {};

        if (!productData.name?.trim()) {
            toast.error('Tên sản phẩm là bắt buộc');
            return false;
        }
        if (!productData.idCategory) {
            toast.error('Danh mục sản phẩm là bắt buộc');
            return false;
        }
        if (!productData.baseUnit?.trim()) {
            toast.error('Tên đơn vị gốc là bắt buộc');
            return false;
        }

        const priceStr = String(productData.pricePerBaseUnit ?? '').replace(/\./g, '');
        if (!priceStr) {
            toast.error('Giá là bắt buộc');
            return false;
        }
        if (isNaN(priceStr) || Number(priceStr) <= 0) {
            toast.error('Giá là số dương');
            return false;
        }

        const quantityStr = productData.quantity;
        if (!quantityStr) {
            toast.error('Số lượng là bắt buộc');
            return false;
        }
        if (isNaN(quantityStr) || Number(quantityStr) <= 0) {
            toast.error('Số lượng phải là số dương');
            return false;
        }

        setFormErrors(errors);
        return true;
    };


    // Validate productUnits
    const validateProductUnits = () => {
        const errors = {};
        // Kiểm tra nếu productUnits rỗng
        if (!productUnits || productUnits.length === 0) {
            toast.error('Phải có ít nhất một đơn vị sản phẩm')
            return false;
        }
        // Kiểm tra từng unit
        productUnits.forEach((unit, index) => {
            if (!unit.unitName?.trim()) {
                toast.error(`Tên đơn vị ${index + 1} là bắt buộc`)
                return false;
            }
            if (!unit.conversionFactor || isNaN(unit.conversionFactor) || Number(unit.conversionFactor) <= 0) {
                toast.error(`Giá trị quy đổi ${index + 1} phải là số dương`)
                return false;
            }
        });
        setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
        return true;
    };

    // Check if product and productUnits are valid
    const isFormValid = () => {
        const isProductValid = validateProduct(product);
        const areUnitsValid = validateProductUnits();
        return isProductValid && areUnitsValid;
    };

    // Handle submit
    const handleSubmitUpdate = async () => {
        try {
            const updateProduct = {
                id: product.id,
                name: product.name,
                pricePerBaseUnit: String(product.pricePerBaseUnit).replace(/\./g, ""),
                quantity: product.quantity,
                baseUnit: product.baseUnit,
                idCategory: product.idCategory,
                listImages: product.listImages,
            };
            const updateProductRequest = {
                productRequest: { ...updateProduct, productUnits },
                idProductUnits: idProductUnits
            }
            // Validate before submit
            if (!isFormValid()) {
                swal('Lỗi dữ liệu', 'Thông tin sản phẩm hoặc đơn vị không hợp lệ. Vui lòng kiểm tra lại.', 'error');
                return;
            }
            // Confirm before creating
            const willCreate = await swal({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn tạo sản phẩm này không?',
                icon: 'warning',
                buttons: ['Hủy', 'Đồng ý'],
                dangerMode: true,
            });

            if (willCreate) {

                const isSuccess = await dispatch(updatePutProduct(updateProductRequest));
                if (isSuccess === true) {
                    swal('Thành công', 'Sản phẩm đã được update thành công!', 'success');
                    dispatch(fetchAllProductProductDetail());
                    navigate('/admins/manage-product');
                } else {
                    swal('Thất bại', 'Không thể tạo sản phẩm. Vui lòng thử lại.', 'error');
                }
            }
        } catch (error) {
            console.error('Error creating product:', error);
            swal('Lỗi hệ thống', 'Đã xảy ra lỗi trong quá trình thêm sản phẩm. Vui lòng thử lại sau.', 'error');
        }
    };

    return (
        <AuthGuard>
            <RoleBasedGuard accessibleRoles={['ADMIN']}>
                <div className="model-create-product container-fluid">
                    <div className="model-create-product-info p-3 m-3">
                        <h4 className="text-center p-3">Cập nhật sản phẩm</h4>
                        <InfoProduct
                            product={product}
                            setProduct={setProduct}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            handleSubmitUpdate={handleSubmitUpdate}
                            images={images}
                        />
                    </div>
                    <div className="model-create-product-sizecolor p-3 m-3">
                        {productUnits && <ModelUpdateUntis productUnits={productUnits} setProductUnits={setProductUnits} formErrors={formErrors} idProductUnits={idProductUnits} setIdProductUnits={setIdProductUnits} />}
                    </div>
                </div>
            </RoleBasedGuard>
        </AuthGuard>
    );
};

export default ModelUpdateProduct;