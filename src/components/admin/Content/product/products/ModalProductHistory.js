import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableProductHistory from './TableProductHistory';
import { MdHistory } from "react-icons/md";
import { getProductHistoryById } from '../../../../../Service/ApiProductHistoryService';

const ModalAddCustomer = ({ idProduct }) => {
    const [productHistory, setProductHistory] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setProductHistory([]); // Reset khi đóng modal
    };

    const handleShow = () => {
        setShow(true);
    };

    useEffect(() => {
        if (show && idProduct) {
            getProductHistory();
        }
    }, [show, idProduct]);

    const getProductHistory = async () => {
        try {
            const response = await getProductHistoryById(idProduct);
            if (response.status === 200) {
                // Đảm bảo data là array, nếu không thì set mảng rỗng
                setProductHistory(Array.isArray(response.data) ? response.data : []);
            } else {
                setProductHistory([]);
                toast.error("Không tìm thấy lịch sử sản phẩm");
            }
        } catch (error) {
            setProductHistory([]);
            toast.error("Lỗi khi tải lịch sử sản phẩm: " + error.message);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="mx-2">
                <MdHistory />
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Lịch sử sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>
                            <Row>
                                <Col>
                                    <TableProductHistory productHistory={productHistory} />
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalAddCustomer;