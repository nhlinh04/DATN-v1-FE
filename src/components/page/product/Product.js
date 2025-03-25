import React, { useState, useEffect, useMemo } from "react";
import "./Product.scss";
import Dropdown from "./Dropdown/Dropdow";
import ListGroup from "./ListGroup";
import { useDispatch, useSelector } from "react-redux";
import { getAllPriceRangePromotion } from '../../../Service/ApiProductService';
import { fetchAllCategory } from "../../../redux/action/categoryAction";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import ListImageProduct from '../../../image/ListImageProduct';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Product = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [filters, setFilters] = useState({
    nameProduct: "",
    idCategory: null,
    minPrice: null,
    maxPrice: null,
    sortOption: "Giá thấp đến cao", // Mặc định là "Giá thấp đến cao"
  });

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.listCategory || []);
  const [products, setProducts] = useState([]);

  // Hàm gọi API lấy danh sách sản phẩm
  const fetchAllPriceRangePromotion = async () => {
    try {
      const response = await getAllPriceRangePromotion();
      if (response && response.status === 200) {
        setProducts(response.data);
      } else {
        toast.error('Lỗi khi tải danh sách sản phẩm');
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tải danh sách sản phẩm');
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategory());
    fetchAllPriceRangePromotion();
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '0';
    const roundedValue = Math.round(value) || 0;
    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Filter unique products by id
  const uniqueProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const productMap = new Map();
    products.forEach((product) => {
      if (!productMap.has(product.idProduct)) {
        productMap.set(product.idProduct, product);
      }
    });
    return Array.from(productMap.values());
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = [...uniqueProducts];

    if (filters.nameProduct) {
      filteredProducts = filteredProducts.filter((product) =>
        product.nameProduct.toLowerCase().includes(filters.nameProduct.toLowerCase())
      );
    }

    if (filters.idCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.idCategory === filters.idCategory
      );
    }

    if (filters.minPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.priceSale >= filters.minPrice
      );
    }
    if (filters.maxPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.priceSale <= filters.maxPrice
      );
    }

    const sortOptions = {
      "Giá cao đến thấp": (a, b) => b.priceSale - a.priceSale,
      "Giá thấp đến cao": (a, b) => a.priceSale - b.priceSale,
    };

    return filteredProducts.sort(sortOptions[filters.sortOption] || (() => 0));
  }, [uniqueProducts, filters]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(filteredAndSortedProducts)) return 0;
    return Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  }, [filteredAndSortedProducts, itemsPerPage]);

  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    return filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);


  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const renderProductPricing = (product) => (
    <div className="product-pricing">
      {product.priceBase === product.priceSale ? (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip >
              {formatCurrency(product.priceBase)} VND
            </Tooltip>
          }
        >
          <p className="product-price truncate-text" > 
            {formatCurrency(product.priceBase)} VND
          </p>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              Giá gốc: {formatCurrency(product.priceBase)} VND - Giá khuyến mãi: {formatCurrency(product.priceSale)} VND
            </Tooltip>
          }
        >
          <div>
            <p className="product-sale-price text-danger truncate-text">
              {formatCurrency(product.priceSale)} VND
            </p>
            <p className="product-original-price truncate-text">
              {formatCurrency(product.priceBase)} VND
            </p>
          </div>
        </OverlayTrigger>
      )}
    </div>
  );

  return (
    <div className="homePage">
      <div className="banner-ct">
  <a href="/" className="banner-link">
    <img src="./banner-cua-hang.jpg" alt="Banner" />
  </a>
  <div className="banner-buttons">
    <h3 className="text-dark">CỬA HÀNG</h3> {/* Thêm lớp text-dark */}
    <div className="link-back">
      <a href="/" className="text-dark fw-bold"> {/* Thêm text-dark + đậm chữ */}
        Trang chủ
      </a>
    </div>
  </div>
</div>


      <div className="row m-5">
        <div className="col-lg-2 col-md-4 col-sm-12 pt-5 list-gr">
          <ListGroup
            title="Danh mục"
            items={categories.map((category) => category.name)}
            onSelectionChange={(selectedCategory) =>
              updateFilter("idCategory", categories.find((category) => category.name === selectedCategory)?.id || null)
            }
          />
        </div>

        <div className="col-lg-10 col-md-8 col-sm-12">
          <div className="collection-content-wrapper">
            <div className="collection-head">
              <h1></h1>
              <div className="collection-sidebar">
                <input
                  className="form-control"
                  placeholder="Tìm kiếm tên sản phẩm"
                  value={filters.nameProduct}
                  onChange={(e) => updateFilter("nameProduct", e.target.value)}
                />
                <Dropdown
                  title="Sắp xếp"
                  menu={["Giá cao đến thấp", "Giá thấp đến cao"]}
                  value={filters.sortOption}
                  onChange={(selectedSort) => updateFilter("sortOption", selectedSort)}
                />
              </div>
            </div>

            <div className="collection-body">
              {currentProducts.length > 0 ? (
                <div className="row m-2">
                  {currentProducts.map((product) => (
                    <div
                      key={product.idProduct}
                      className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch"
                    >
                      <Link to={`/product-detail?idProduct=${product.idProduct}`} className="w-100">
                        <div className="card product-card h-100">
                          <div className="image-container">
                            <ListImageProduct id={product?.idProduct} />
                          </div>
                          <div className="card-body text-center">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{product.nameProduct}</Tooltip>}
                            >
                              <p className="product-name truncate-text">{product.nameProduct}</p>
                            </OverlayTrigger>
                            {renderProductPricing(product)}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <h3>Không tìm thấy sản phẩm nào</h3>
                  <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
                </div>
              )}

              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {currentPage > 2 && <Pagination.Ellipsis />}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                    .map((page) => (
                      <Pagination.Item
                        key={page}
                        active={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;