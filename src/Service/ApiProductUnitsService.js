import authorizeAxiosInstance from '../hooks/authorizeAxiosInstance';

const findListProductUnitsByIdByIdProduct = async (id) => {
    const response = await authorizeAxiosInstance.get(`/productUntis/findListProductUnitsById?idProductUnits=${id}`)
    return response;
};
const findProductUnitsById = async (id) => {
    const response = await authorizeAxiosInstance.get(`/productUntis/findProductUnitsById?idProductUnits=${id}`)
    return response;
};
const findProductResponseByIdAndType = async (id, type) => {
    const response = await authorizeAxiosInstance.get(`/productUntis/findProductResponseByIdAndType?idProductUnits=${id}&type=${type}`)
    return response;

};

export { findListProductUnitsByIdByIdProduct, findProductResponseByIdAndType, findProductUnitsById };