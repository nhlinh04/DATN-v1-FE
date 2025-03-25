
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import TableProduct from './TableProduct';
import { completeBill } from '../../../../../Service/ApiBillDetailService';
import { updateActualQuantity } from '../../../../../Service/ApiBillDetailByEmployeeService';
import swal from 'sweetalert';
import { fetchBillDetailByEmployeeByCodeBill } from '../../../../../redux/action/billDetailByEmployeeAction';
const ModalActualQuantity = ({ billDetail, show, setShow, createHistoryBill, fetchBillDetailsAndPayBill, codeBill }) => {
    const dispatch = useDispatch();
    const [actualQuantities, setActualQuantities] = useState([]);

    const handleClose = () => {
        setShow(false);

    };

    const handleShow = () => setShow(true);
    const validateActualQuantities = (actualQuantities) => {
        if (!actualQuantities || actualQuantities.length === 0) {
            toast.error("Vui lòng nhập số lượng thực tế trước khi lưu!");
            return false;
        }

        for (let item of actualQuantities) {
            if (item.actualQuantity === null || item.actualQuantity === undefined) {
                toast.error(`Sản phẩm ID ${item.id} chưa có số lượng thực tế!`);
                return false;
            }
            if (item.actualQuantity < 0) {
                toast.error(`Sản phẩm ID ${item.id} có số lượng âm!`);
                return false;
            }
        }

        const allZero = actualQuantities.every(item => item.actualQuantity === 0);
        if (allZero) {
            toast.error("Tất cả sản phẩm đều có số lượng thực tế bằng 0. Vui lòng nhập số lượng hợp lệ!");
            return false;
        }

        return true;
    };


    const handleSubmitCreate = async () => {
        try {
            if (!validateActualQuantities(actualQuantities)) return;

            const request = await updateActualQuantity(actualQuantities)
            if (request.status == 200) {
                await completeBill(codeBill);
                await createHistoryBill();
                await fetchBillDetailsAndPayBill(0);
                dispatch(fetchBillDetailByEmployeeByCodeBill(codeBill));
                swal("Thành công!", "Trạng thái hóa đơn đã được cập nhật.", "success");
                setShow(false);
            }

        } catch (error) {
            toast.error("Lỗi hệ thống. Vui lòng thử lại sau.");
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Sản Phẩm: </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>
                            <Row>
                                <Col>
                                    <TableProduct
                                        billDetail={billDetail}
                                        actualQuantities={actualQuantities}
                                        setActualQuantities={setActualQuantities}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="primary" onClick={handleSubmitCreate}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalActualQuantity;