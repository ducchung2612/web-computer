// thanhtoan.js

function getProductListForCheckout() {
    let list_products = window.list_products;
    if (!list_products || !list_products.length) {
        list_products = getListProducts() || [];
    }
    return list_products;
}

function renderCheckoutProducts() {
    const currentuser = getCurrentUser();
    const productList = document.getElementById('productList');
    const totalPriceDiv = document.getElementById('totalPrice');
    let totalPrice = 0;
    let html = '';

    if (!currentuser || !currentuser.products || !currentuser.products.length) {
        productList.innerHTML = '<p style="text-align: center; color: #666;">Không có sản phẩm trong giỏ hàng</p>';
        totalPriceDiv.innerHTML = '';
        return;
    }

    const list_products = getProductListForCheckout();

    for (let item of currentuser.products) {
        let product = null;
        for (let p of list_products) {
            if (p.masp === item.ma) {
                product = p;
                break;
            }
        }
        if (product) {
            const price = (product.promo && product.promo.name == 'giareonline' ? product.promo.value : product.price);
            const thanhTien = stringToNum(price) * item.soluong;
            totalPrice += thanhTien;
            html += `
                <div class="product-item">
                    <img src="${product.img}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="quantity-text">Số lượng: ${item.soluong}</div>
                        <div class="unit-price">Đơn giá: ${price} ₫</div>
                        <div class="product-price">Thành tiền: ${numToString(thanhTien)} ₫</div>
                    </div>
                </div>
            `;
        }
    }
    if (!html) {
        html = '<p style="text-align: center; color: #666;">Không có sản phẩm trong giỏ hàng</p>';
    }
    productList.innerHTML = html;
    totalPriceDiv.innerHTML = `Tổng tiền: ${numToString(totalPrice)} ₫`;
}

function handleCheckout(event) {
    event.preventDefault();
    const currentuser = getCurrentUser();
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    let paymentMethod = 'cod';
    const pmInput = document.querySelector('input[name="paymentMethod"]:checked');
    if (pmInput) paymentMethod = pmInput.value;
    if (!currentuser || !currentuser.products.length) {
        alert('Giỏ hàng trống!');
        return false;
    }
    currentuser.donhang.push({
        "sp": currentuser.products,
        "ngaymua": new Date(),
        "tinhTrang": 'Đang chờ xử lý',
        "thongTinGiaoHang": {
            fullName,
            phone,
            address,
            note,
            paymentMethod
        }
    });
    currentuser.products = [];
    setCurrentUser(currentuser);
    updateListUser(currentuser);
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    window.location.href = 'index.html';
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    renderCheckoutProducts();
    var form = document.getElementById('checkoutForm');
    if (form) {
        form.onsubmit = handleCheckout;
    }
}); 