const express = require("express");
const {
  getCarts,
  getCartIdByCustomer,
  getDetailCartById,
  addProductToCart,
  updateProductInCart,
  deleteProductInCart,
  deleteCart,
} = require("../controllers/carts");

//create router for object: product
const router = express.Router();

//Lấy toàn bộ giỏ hàng, cho phép lọc theo khách hàng và cửa hàng
router.get("/carts", getCarts);
//Lấy id giỏ hàng theo khách hàng tương ứng
router.get("/carts/id", getCartIdByCustomer);
//Lấy chi tiết giỏ hàng theo id
router.get("/carts/:cartId", getDetailCartById);
//Thêm sản phẩm vào giỏ hàng
router.post("/carts", addProductToCart);
// Cập nhật sản phẩm trong giỏ hàng
router.put("/carts", updateProductInCart);
//Xóa giỏ hàng bao gồm tất cả sản phẩm trong giỏ hàng
router.delete("/carts/:cartId", deleteCart);
//Xóa 1 sản phẩm bất kỳ trong giỏ hàng
router.delete("/carts", deleteProductInCart);

module.exports = router;
