import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { findListProductUnitsByIdByIdProduct } from '../../../../../../Service/ApiProductUnitsService';
const ModelDetailUnit = ({ idProduct }) => {
    const [productUnits, setProductUnits] = useState();
    const findProductUnits = async () => {
        try {
            const response = await findListProductUnitsByIdByIdProduct(idProduct);
            if (response && response.status === 200) {
                setProductUnits(response.data);
            } else {
                toast.error('Lỗi khi tải danh sách sản phẩm');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi tải danh sách sản phẩm');
        }
    };

    useEffect(() => {
        findProductUnits();
    }, []);
    return (
        <Container>
            {productUnits?.map((unit, index) => (
                <Row key={index} className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Tên đơn vị:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên đơn vị ..."
                                name="unitName"
                                value={unit.unitName}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Giá trị quy đổi:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Giá trị quy đổi ..."
                                name="conversionFactor"
                                value={unit.conversionFactor}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Label>Hiển thị:</Form.Label>
                        <div className='text-center'>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`flexSwitchCheckChecked-${index}`}
                                    checked={unit.type}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

export default ModelDetailUnit;