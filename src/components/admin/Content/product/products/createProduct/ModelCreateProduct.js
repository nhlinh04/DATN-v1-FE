import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import AuthGuard from '../../../../../auth/AuthGuard';
import RoleBasedGuard from '../../../../../auth/RoleBasedGuard';
import { createNewNewProduct, fetchAllProductProductDetail } from '../../../../../../redux/action/productAction';
import InfoProduct from './InfoProduct';
import ModelCreateUnits from './ModelCreateUntis';
import './ModelCreateProduct.scss';

// Initial state cho product
const initialProductState = {
    name: '',
    pricePerBaseUnit: '',
    quantity: '',
    baseUnit: '',
    idCategory: '',
    listImages: [],
};

const ModelCreateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State management
    const [product, setProduct] = useState(initialProductState);
    const [productUnits, setProductUnits] = useState([
        {
            unitName: '',
            conversionFactor: '',
            type: false,
        },
    ]);
    const [formErrors, setFormErrors] = useState({});

    // Validate product
    const validateProduct = (productData) => {
        const errors = {};

        if (!productData.name?.trim()) {
            toast.error('Tên sản phẩm là bắt buộc')
            return false;
        }
        if (!productData.idCategory) {
            toast.error('Danh mục sản phẩm là bắt buộc')
            return false;
        }
        if (!productData.baseUnit?.trim()) {
            toast.error('Tên đơn vị gốc là bắt buộc')
            return false;
        }
        if (!productData.pricePerBaseUnit.replace(/\./g, "")) {
            toast.error('Giá là bắt buộc')
            return false;
        }
        if (isNaN(productData.pricePerBaseUnit.replace(/\./g, "")) || Number(productData.pricePerBaseUnit.replace(/\./g, "")) <= 0) {
            toast.error('Giá là số dương')
            return false;
        }
        if (!productData.quantity.replace(/\./g, "")) {
            toast.error('Số lượng là bắt buộc')
            return false;
        }
        if (isNaN(productData.quantity.replace(/\./g, "")) || Number(productData.quantity.replace(/\./g, "")) <= 0) {
            toast.error('Số lượng là số dương')
            return false;
        }
        if (Array.isArray(productData.image) && productData.image.length === 0) {
            toast.error('Ảnh sản phẩm là bắt buộc')
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
    const handleSubmitCreate = async () => {
        try {
            const newProduct = {
                name: product.name,
                pricePerBaseUnit: product.pricePerBaseUnit.replace(/\./g, ""),
                quantity: product.quantity,
                baseUnit: product.baseUnit,
                idCategory: product.idCategory,
                listImages: product.listImages,
            };

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
                // Uncomment this when API is ready
                const isSuccess = await dispatch(createNewNewProduct({ ...newProduct, productUnits }));
                if (isSuccess) {
                    swal('Thành công', 'Sản phẩm đã được tạo thành công!', 'success');
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
                        <h4 className="text-center p-3">Thêm sản phẩm</h4>
                        <InfoProduct
                            product={product}
                            setProduct={setProduct}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            handleSubmitCreate={handleSubmitCreate}
                        />
                    </div>
                    <div className="model-create-product-sizecolor p-3 m-3">
                        <ModelCreateUnits productUnits={productUnits} setProductUnits={setProductUnits} formErrors={formErrors} />
                    </div>
                </div>
            </RoleBasedGuard>
        </AuthGuard>
    );
};

export default ModelCreateProduct;