import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from "react-icons/fa";
import swal from 'sweetalert';
import { exportProduct } from '../../../../../Service/ApiProductService'
import { fetchAllProductProductDetail } from '../../../../../redux/action/productAction';
function ModelExportProduct({ idProduct }) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleClose = () => {
        setShow(false);
        setQuantity('');
        setError('');
    };

    const handleShow = () => setShow(true);


    const parseNumber = (formattedValue) => {
        return formattedValue.replace(/\./g, '');
    };

    const validateForm = (fieldValue) => {
        const numericValue = parseNumber(fieldValue);
        const num = Number(numericValue);

        if (!numericValue) {
            setError("Số lượng là bắt buộc");
            return false;
        }
        if (isNaN(num)) {
            setError("Số lượng phải là một số hợp lệ");
            return false;
        }
        if (num < 1) {
            setError("Số lượng phải lớn hơn hoặc bằng 1");
            return false;
        }
        if (num > 100000) {
            setError("Số lượng không được vượt quá 100.000");
            return false;
        }

        setError('');
        return true;
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setQuantity(value);
        validateForm(value);
    };
    const handleBlur = (e) => {
        const { value } = e.target;
        setQuantity(value);
        validateForm(value);
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (!validateForm(quantity)) {
                swal('Lỗi dữ liệu', 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.', 'error');
                return;
            }
            const willCreate = await swal({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn xuất hủy sản phẩm này không?',
                icon: 'warning',
                buttons: ['Hủy', 'Đồng ý'],
                dangerMode: true,
            });
            if (willCreate) {
                try {
                    const response = await exportProduct(idProduct, quantity);
                    if (response && response.status === 200) {
                        swal('Thành công', 'Sản phẩm đã được xuất hủy thành công!', 'success');
                        dispatch(fetchAllProductProductDetail());
                    } else {
                        swal('Thất bại', 'Không thể xuất hủy sản phẩm. Vui lòng thử lại.', 'error');
                    }
                } catch (error) {
                    swal('Thất bại', 'Không thể xuất hủy sản phẩm. Vui lòng thử lại.', 'error');
                }
            }

            handleClose();
        } catch (error) {
            toast.error("Lỗi khi xử lý xuất hủy. Vui lòng thử lại sau.");
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow} className="mx-2">
                <FaTrash />
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Xuất hủy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="quantity">
                                <span className="text-danger">*</span> Số lượng hủy:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="quantity"
                                id="quantity"
                                placeholder="Nhập số lượng sản phẩm ..."
                                value={quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModelExportProduct;