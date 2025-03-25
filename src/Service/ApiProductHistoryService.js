import authorizeAxiosInstance from '../hooks/authorizeAxiosInstance';
export async function getProductHistoryById(idProduct) {
    let response = await authorizeAxiosInstance.get(`productHistory/findProductHistory?idProduct=${idProduct}`);
    return response;
}