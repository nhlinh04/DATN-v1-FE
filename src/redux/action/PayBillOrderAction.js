import { Fetch_Posts_PayBillOrder_Request, Fetch_Posts_PayBillOrder_Success, Fetch_Posts_PayBillOrder_Error } from '../types/PayBillOrderType';
import { deletePayBill, postCreateNewPayBill, findAllPayBill } from '../../Service/ApiPayBillOrderService';
import { toast } from 'react-toastify';

export const fetchAllPayBillOrder = (codeBill) => {
    return async (dispatch, getState) => {
        dispatch(fetchPostsPayBillOrderRequest());
        try {
            const response = await findAllPayBill(codeBill);
            if (response.status === 200) {
                const data = response.data;
                dispatch(fetchPostsPayBillOrderSuccess(data))
             
            }
        } catch (error) {
            dispatch(fetchPostsPayBillOrderError())
        }

    }
}
export const createNewPayBillOrder = (codeBill, createPayBillOrder) => {
    return async (dispatch) => {
        try {
            const response = await postCreateNewPayBill(createPayBillOrder);
            if (response.status === 200) {
                dispatch(fetchAllPayBillOrder(codeBill));
                toast.success("Thêm thanh toán mới thành công!");
            }
        } catch (error) {
            dispatch(fetchPostsPayBillOrderError());
        }
    };
};
export const deletePayBillOrder = (codeBill, idPayBill) => {
    return async (dispatch) => {
        try {
            const response = await deletePayBill(idPayBill);
            if (response.status === 200) {
                dispatch(fetchAllPayBillOrder(codeBill));
                toast.success("Xóa thanh toán thành công!");
            }
        } catch (error) {
            dispatch(fetchPostsPayBillOrderError());
        }
    };
};
export const fetchPostsPayBillOrderRequest = () => {
    return {
        type: Fetch_Posts_PayBillOrder_Request
    }
}
export const fetchPostsPayBillOrderSuccess = (payload) => {
    return {
        type: Fetch_Posts_PayBillOrder_Success,
        payload
    }
}
export const fetchPostsPayBillOrderError = () => {
    return {
        type: Fetch_Posts_PayBillOrder_Error
    }
}