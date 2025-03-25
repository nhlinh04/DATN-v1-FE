import { useState, useEffect } from 'react';
import ModelCreateCategory from "./ModelCreateCategory";
import TableCategory from "./TableCategory";
import { useDebounce } from 'use-debounce';
import { useDispatch } from 'react-redux';
import { fetchAllCategory, fetchSearchCategory } from '../../../../../redux/action/categoryAction';
import AuthGuard from "../../../../auth/AuthGuard";
import RoleBasedGuard from "../../../../auth/RoleBasedGuard";
const ManageCategory = () => {
    const dispatch = useDispatch();
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName] = useDebounce(searchName, 1000); // Sử dụng useDebounce với delay 1000ms
    useEffect(() => {
        if (debouncedSearchName) {
            dispatch(fetchSearchCategory(debouncedSearchName));
        } else {
            dispatch(fetchAllCategory());
        }
    }, [debouncedSearchName, dispatch]);
    return (
        <AuthGuard>
            <RoleBasedGuard accessibleRoles={["ADMIN"]}>
                <div className="manage-cart-container">
                    <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <h3>Quản lý danh mục</h3>
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    <div className="cart-content">
                                        <div className='shoe-content-hender'>
                                            <label className="form-label">Tên danh mục:</label>
                                            <div className='shoe-search-add row'>
                                                <div className="shoe-search mb-3 col-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="nameShoe"
                                                        placeholder="Tìm kiếm danh mục theo tên...."
                                                        onChange={(event) => setSearchName(event.target.value)}
                                                    />
                                                </div>
                                                <div className='shoe-add mb-3 col-2'>
                                                    <ModelCreateCategory />
                                                </div>
                                                <div className='shoe-content-body mt-3'>
                                                    <TableCategory />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </RoleBasedGuard>
        </AuthGuard>
    )
}
export default ManageCategory;