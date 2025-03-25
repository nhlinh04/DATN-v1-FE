import React, { useState, useEffect } from 'react';
import { findListImageByIdProduct } from '../Service/ApiProductImage';

const ListImageProduct = ({
    id,
    maxWidth = '100%', // Giá trị mặc định là 100% để linh hoạt
    maxHeight = 'auto', // Giá trị mặc định là auto
    containerClassName = '', // Class tùy chỉnh cho container
    imageClassName = '', // Class tùy chỉnh cho hình ảnh
    center = true, // Căn giữa mặc định
}) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await findListImageByIdProduct(id);
                setImages(response.data || []);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        fetchImage();
    }, [id]);

    const containerStyles = {
        maxWidth,
        maxHeight,
        width: '100%', // Đảm bảo container chiếm toàn bộ chiều rộng được cấp
        height: maxHeight === 'auto' ? 'auto' : maxHeight, // Linh hoạt chiều cao
        position: 'relative',
        display: center ? 'flex' : 'block', // Sử dụng flex để căn giữa nếu center = true
        justifyContent: center ? 'center' : 'flex-start', // Căn giữa theo chiều ngang
        alignItems: center ? 'center' : 'flex-start', // Căn giữa theo chiều dọc
    };

    const imageStyles = {
        width: '100%',
        height: maxHeight === 'auto' ? 'auto' : '100%', // Linh hoạt chiều cao
        objectFit: 'cover', // Đảm bảo hình ảnh không bị méo
        borderRadius: '4px', // Bo góc nhẹ
    };

    return (
        <>
            {images && images.length > 0 ? (
                <div
                    id={`productCarousel-${id}`}
                    className={`carousel slide ${containerClassName}`}
                    data-bs-ride="carousel"
                    style={containerStyles}
                >
                    {/* Indicators */}
                    {/* <div
                        className="carousel-indicators"
                        style={{
                            bottom: '-20px',
                            marginBottom: 0,
                        }}
                    >
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target={`#productCarousel-${id}`}
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : 'false'}
                                aria-label={`Slide ${index + 1}`}
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: index === 0 ? '#000' : '#666',
                                }}
                            ></button>
                        ))}
                    </div> */}

                    {/* Carousel Items */}
                    <div
                        className="carousel-inner"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <img
                                    src={`data:image/jpeg;base64,${image.imageByte}`}
                                    alt={`Product ${index}`}
                                    className={`d-block ${imageClassName}`}
                                    style={imageStyles}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/100x100';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#productCarousel-${id}`}
                        data-bs-slide="prev"
                        style={{
                            width: '20px',
                            height: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',

                            borderRadius: '50%',
                            display: images.length > 1 ? 'block' : 'none',
                        }}
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                            style={{ filter: 'invert(1)', width: '10px', height: '10px' }}
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#productCarousel-${id}`}
                        data-bs-slide="next"
                        style={{
                            width: '20px',
                            height: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',

                            borderRadius: '50%',
                            display: images.length > 1 ? 'block' : 'none',
                        }}
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                            style={{ filter: 'invert(1)', width: '10px', height: '10px' }}
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            ) : (
                <img
                    src="https://placehold.co/100x100"
                    alt="Placeholder"
                    style={{
                        maxWidth,
                        maxHeight,
                        width: '100%',
                        height: maxHeight === 'auto' ? 'auto' : '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                    }}
                />
            )}
        </>
    );
};

export default ListImageProduct;