//lớp Sản phẩm
module.exports = class Product {
  constructor(
    productId, //id sản phẩm - khóa chính
    productCode, //mã sản phẩm(cho phép người dùng nhìn)
    productName, //tên sản phẩm
    description, //mô tả
    unit, //mô tả
    imageUrl, //đường dẫn hình ảnh minh họa sản phẩm
    importPrice, //giá nhập hàng
    purchasePrice, //giá bán
    amount, //số lượng sản phẩm còn trong kho
    quantitySold, //số lượng sản phẩm đã bán
    dateOfImport, //ngày nhập hàng gần nhất
    rating, //đánh giá
    sale, //giảm giá
    shopId, //id cửa hàng
    categoryId //id loại sản phẩm
  ) {
    this.productId = productId;
    this.productCode = productCode;
    this.productName = productName;
    this.description = description;
    this.unit = unit;
    this.imageUrl = imageUrl;
    this.importPrice = importPrice;
    this.purchasePrice = purchasePrice;
    this.amount = amount;
    this.quantitySold = quantitySold;
    this.dateOfImport = dateOfImport;
    this.rating = rating;
    this.sale = sale;
    this.shopId = shopId;
    this.categoryId = categoryId;
  }
};
