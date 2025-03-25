import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import addressReducer from "./addressReducer";
import categoryReducer from "./categoryReducer";
import voucherReducer from "./voucherReducer";
import productReducer from "./productReducer";
import productFavoriteReducer from "./productFavoriteReducer";
import promotionReducer from "./promotionReducer";
import billReducer from "./billReducer";
import billByEmployeeReducer from "./billByEmployeeReducer";
import billDetailByEmployeeReducer from "./billDetailByEmployeeReducer";
import voucherBillReducer from "./voucherBillReducer";
import payBillOrderReducer from "./payBillOrderReducer";
import authReducer from "./authReducer";
const rootReducer = combineReducers({
  account: accountReducer,
  address: addressReducer,
  auth: authReducer,
  category: categoryReducer,
  voucher: voucherReducer,
  product: productReducer,
  productFavorite: productFavoriteReducer,
  promotion: promotionReducer,
  bill: billReducer,
  codeBill: billByEmployeeReducer,
  billDetailOrder: billDetailByEmployeeReducer,
  voucherBill: voucherBillReducer,
  payBillOrder: payBillOrderReducer,
});

export default rootReducer;
