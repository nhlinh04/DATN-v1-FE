import React, { useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

const ModelCreateUnit = ({ productUnits, setProductUnits }) => {
    const [errors, setErrors] = useState(productUnits.map(() => ({})));

    // Hàm validate một unit
    const validateUnit = (unit, index) => {
        const newErrors = [...errors];
        newErrors[index] = {};

        // Validate unitName
        if (!unit.unitName || unit.unitName.trim() === '') {
            newErrors[index].unitName = 'Tên đơn vị không được để trống';
        }

        // Validate conversionFactor
        const rawValue = unit.conversionFactor.replace(/\./g, ''); // Loại bỏ dấu chấm để kiểm tra số thực
        const conversionFactor = parseFloat(rawValue);
        if (isNaN(conversionFactor)) {
            newErrors[index].conversionFactor = 'Giá trị quy đổi phải là số';
        } else if (conversionFactor <= 0) {
            newErrors[index].conversionFactor = 'Giá trị quy đổi phải lớn hơn 0';
        }

        setErrors(newErrors);
        return !newErrors[index].unitName && !newErrors[index].conversionFactor;
    };

    // Hàm thêm mới một product unit
    const handleAddUnit = () => {
        setProductUnits([...productUnits, { unitName: '', conversionFactor: '', type: false }]);
        setErrors([...errors, {}]);
    };

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newUnits = [...productUnits];

        if (name === 'conversionFactor') {
            newUnits[index] = {
                ...newUnits[index],
                [name]: value,
            };
        } else {
            newUnits[index] = {
                ...newUnits[index],
                [name]: value,
            };
        }

        setProductUnits(newUnits);
        validateUnit(newUnits[index], index);
    };

    // Hàm xử lý blur để kiểm tra lại khi rời khỏi input
    const handleBlur = (index, e) => {
        const { name, value } = e.target;
        const newUnits = [...productUnits];

        if (name === 'conversionFactor') {
            newUnits[index] = {
                ...newUnits[index],
                [name]: value,
            };
        } else {
            newUnits[index] = {
                ...newUnits[index],
                [name]: value,
            };
        }

        setProductUnits(newUnits);
        validateUnit(newUnits[index], index);
    };

    // Hàm xử lý thay đổi checkbox
    const handleTypeChange = (index, checked) => {
        const newUnits = [...productUnits];
        newUnits[index] = {
            ...newUnits[index],
            type: checked,
        };
        setProductUnits(newUnits);
        validateUnit(newUnits[index], index);
    };

    // Hàm xóa unit
    const handleRemoveUnit = (index) => {
        if (productUnits.length > 1) {
            const newUnits = productUnits.filter((_, i) => i !== index);
            const newErrors = errors.filter((_, i) => i !== index);
            setProductUnits(newUnits);
            setErrors(newErrors);
        }
    };

    return (
        <Container>
            <Button variant="success" onClick={handleAddUnit} className="mb-3">
                Thêm các đơn vị quy đổi
            </Button>

            {productUnits.map((unit, index) => (
                <Row key={index} className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Tên đơn vị:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên đơn vị ..."
                                name="unitName"
                                value={unit.unitName}
                                onChange={(e) => handleChange(index, e)}
                                onBlur={(e) => handleBlur(index, e)}
                                isInvalid={!!errors[index]?.unitName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[index]?.unitName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Giá trị quy đổi:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Giá trị quy đổi ..."
                                name="conversionFactor"
                                value={unit.conversionFactor}
                                onChange={(e) => handleChange(index, e)}
                                onBlur={(e) => handleBlur(index, e)}
                                isInvalid={!!errors[index]?.conversionFactor}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[index]?.conversionFactor}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Label>Hiển thị:</Form.Label>
                        <div className="text-center">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`flexSwitchCheckChecked-${index}`}
                                    checked={unit.type}
                                    onChange={(e) => handleTypeChange(index, e.target.checked)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="danger"
                            onClick={() => handleRemoveUnit(index)}
                            disabled={productUnits.length === 1}
                            className="mt-4"
                        >
                            Xóa
                        </Button>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

export default ModelCreateUnit;