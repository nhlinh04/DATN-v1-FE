import { findProductResponseById } from '../../Service/ApiProductService';
import { toast } from 'react-toastify';
const CART_KEY = "cartLocal";

// Hàm thêm sản phẩm vào giỏ hàng
export function addToCartLocal(cart, quantityProduct) {
    const currentTime = new Date().getTime();
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY)) || { items: [], expiration: null };
    const existingItemIndex = storedCart.items.findIndex(item => item.idProduct === cart.idProduct);

    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
        const existingItem = storedCart.items[existingItemIndex];
        if (existingItem.quantity + cart.quantity > quantityProduct) {
            console.error("Số lượng vượt quá số lượng cho phép.");
            return;
        }
        existingItem.quantity += cart.quantity;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        if (cart.quantity > quantityProduct) {
            console.error("Số lượng vượt quá số lượng cho phép.");
            return;
        }
        storedCart.items.push(cart);
    }

    const expirationTime = currentTime + 24 * 60 * 60 * 1000; // 1 ngày
    storedCart.expiration = expirationTime;

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(storedCart));
}

// Hàm lấy giỏ hàng từ localStorage
export function getCart() {
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY)) || { items: [], expiration: null };

    // Loại bỏ trùng lặp sản phẩm
    const uniqueItems = {};
    storedCart.items = storedCart.items?.filter(item => {
        if (!uniqueItems[item.idProduct]) {
            uniqueItems[item.idProduct] = true;
            return true;
        }
        return false;
    });
    return storedCart;
}
// Cập nhật lại cartLocal với dữ liệu mới nhưng giữ expiration cũ
export function updateCartWithExpiration(validProducts) {
    const currentCart = JSON.parse(localStorage.getItem(CART_KEY)) || { items: [], expiration: null };

    const updatedCart = {
        items: validProducts.map((product) => ({
            idProduct: product.idProduct,
            quantity: product.quantity,
        })),
        expiration: currentCart.expiration, // Giữ expiration cũ
    };

    saveCart(updatedCart);
}
// Hàm lưu giỏ hàng vào localStorage
export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Hàm kiểm tra và xóa các mục hết hạn
function removeExpiredCart() {
    const currentTime = new Date().getTime();
    const cart = getCart();

    if (cart.expiration && currentTime > cart.expiration) {
        // Xóa toàn bộ giỏ hàng nếu hết hạn
        localStorage.removeItem(CART_KEY);
        console.log("Cart expired and removed.");
    }
}

// Hàm kiểm tra và xóa sản phẩm trùng ID
function removeDuplicateItems() {
    const cart = getCart();

    if (!cart.items || cart.items.length === 0) return;

    const uniqueItems = {};
    cart.items = cart.items?.filter(item => {
        if (!uniqueItems[item.idProduct]) {
            uniqueItems[item.idProduct] = true;
            return true;
        }
        return false;
    });

    saveCart(cart);
}

// Hàm tăng số lượng sản phẩm
export async function plusProductToCart(idProduct) {
    const cart = getCart();
    const product = cart.items.find(item => item.idProduct === idProduct);

    if (product) {
        try {
            const response = await findProductResponseById(idProduct);
            if (response.status === 200) {
                const data = response.data;
                const newQuantity = product.quantity + 1
                if (newQuantity > data.quantity) {
                    toast.error("Số lượng vượt quá số lượng sản phẩm trong kho.");
                    return false;
                }
                product.quantity = newQuantity;
                saveCart(cart);
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    } else {
        toast.error("Sản phẩm không tồn tại trong giỏ hàng.");
        console.error("Sản phẩm không tồn tại trong giỏ hàng.");
        return false;
    }
}

// Hàm giảm số lượng sản phẩm
export async function subtractProductToCart(idProduct) {
    const cart = getCart();
    const product = cart.items.find(item => item.idProduct === idProduct);

    if (product) {
        if (product.quantity > 1) {
            product.quantity -= 1;
            saveCart(cart);
            return true;
        } else {
            toast.error("Số lượng không thể nhỏ hơn 1.");
            console.error("Số lượng không thể nhỏ hơn 1.");
            return false;
        }
    } else {
        toast.error("Sản phẩm không tồn tại trong giỏ hàng.");
        console.error("Sản phẩm không tồn tại trong giỏ hàng.");
        return false;
    }
}
// Hàm xóa sản phẩm khỏi giỏ hàng
export async function deleteProductToCart(idProduct) {
    const cart = getCart();
    cart.items = cart.items?.filter(item => item.idProduct !== idProduct);
    saveCart(cart);
}
// Hàm xóa các sản phẩm được chọn khỏi giỏ hàng
export function deleteSelectCartLocal(productPromoRequests) {
    const cart = getCart();

    // Lọc lại giỏ hàng, loại bỏ các sản phẩm có idProduct khớp với danh sách được cung cấp
    cart.items = cart.items?.filter(item => {
        return !productPromoRequests.some(request => request.idProduct === item.idProduct);
    });

    saveCart(cart); // Lưu lại giỏ hàng sau khi xóa
}

// Hàm kiểm tra định kỳ
function autoCheckCart() {
    removeExpiredCart(); // Kiểm tra và xóa giỏ hàng hết hạn
    removeDuplicateItems(); // Kiểm tra và xóa sản phẩm trùng
}

// Hàm khởi động quá trình kiểm tra tự động
export function startCartAutoCheck(interval = 300000) {
    autoCheckCart(); // Kiểm tra ngay khi khởi động
    setInterval(autoCheckCart, interval); // Chạy định kỳ mỗi `interval` ms
}
