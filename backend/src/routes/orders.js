const express = require("express");
const {
  getOrders,
  getDetailProductOrders,
  getProcessingOrderByCustomer,
  addProductsToOrder,
  addQuickCartToOrder,
  getOrderReceiveByCode,
  updateOrder,
  cancelOrder,
  deleteOrder,
  getOrdersForShop,
} = require("../controllers/orders");

//create router for object: product
const router = express.Router();

//Lấy danh sách thông tin đơn hàng, cho phép lọc theo Mã khách hàng, Mã đơn hàng, Mã cửa hàng
router.get("/orders", getOrders);
//Lấy danh sách sản phẩm trong đơn hàng, cho phép lọc theo Mã khách hàng, Mã đơn hàng, Mã cửa hàng
router.get("/orders/detail", getDetailProductOrders);
//Lấy danh sách các đơn hàng đang trong tiến trình chưa hoàn thành theo khách hàng.
router.get("/process/orders", getProcessingOrderByCustomer);
//Thực hiện đặt hàng thường
router.post("/orders", addProductsToOrder);
// Thực hiện đặt hàng giỏ hàng nhanh
router.post("/quick/orders", addQuickCartToOrder);
//Cập nhật lại trạng thái hóa đơn, trừ hủy đơn hàng đã có API khác thay thế
router.put("/orders", updateOrder);
//Hủy đơn hàng
router.put("/cancel/orders", cancelOrder);
//Xóa đơn hàng theo id, bao gồm xóa tất cả sản phẩm trong đơn
router.delete("/orders/:orderId", deleteOrder);

/**
 * router cho app shipper
 */
// Lấy đơn hàng nhận cho shipper
router.get("/receiver/orders", getOrderReceiveByCode);

/**
 * router cho admin
 */
// Lấy đơn hàng theo trạng thái của admin
router.get("/admin/orders", getOrdersForShop);

module.exports = router;
