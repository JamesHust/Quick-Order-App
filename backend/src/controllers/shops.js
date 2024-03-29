const db = require("../util/database");
const Shop = require("../models/shop");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  convertPathFile,
} = require("../util/common");
const fs = require("fs");
const { isBuffer } = require("lodash");

//khai báo các biến toàn cục dùng chung
const tableName = "shop";
const objName = "Shop";
const primaryKeyTable = "ShopId";
const propName = "ShopName";
const codePropName = "ShopCode";

//#region API function - service
/**
 * Controller lấy toàn bộ shop
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getShops = async (req, res, next) => {
  try {
    const result = getInfoShops(null);

    if (result && result.length > 0) {
      let shops = [];
      result.forEach((item) => {
        const shop = new Shop(
          item.ShopId,
          item.ShopCode,
          item.ShopName,
          item.Avatar,
          item.PhoneNumber,
          item.OtherPhoneNumber,
          item.Address,
          item.Email,
          item.OpenTime,
          item.CloseTime,
          item.Rating,
          item.ChatId,
          item.AreaId,
        );
        shops.push(shop);
      });
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = null),
          (userMsg = null),
          (moreInfo = null),
          (data = shops)
        )
      );
    } else {
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = "Data is empty."),
          (userMsg = "Không tồn tại dữ liệu trong cơ sở dữ liệu."),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } catch (err) {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = "DB001"),
        (devMsg = err.toString()),
        (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Lấy thông tin shop theo id
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getShopById = async (req, res, next) => {
  const shopId = req.params.shopId;
  //check id có trống không
  if (shopId) {
    try {
      const result = await checkExist(primaryKeyTable, shopId);
      if (result) {
        const shop = new Shop(
          result.ShopId,
          result.ShopCode,
          result.ShopName,
          convertPathFile(result.Avatar),
          result.PhoneNumber,
          result.OtherPhoneNumber,
          result.Address,
          result.Email,
          result.OpenTime,
          result.CloseTime,
          result.Rating,
          result.ChatId,
          result.AreaId,
        );
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = shop)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Cannot found account of shop have id='${shopId}' in the database.`),
            (userMsg = `Không tồn tại cửa hàng có id=${shopId} cần tìm.`),
            (moreInfo = null),
            (data = null)
          )
        );
      }
    } catch (err) {
      res.send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB001"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
      new Response(
        (isSuccess = true),
        (errorCode = null),
        (devMsg = "Params in request is null"),
        (userMsg = null),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Tìm kiếm tài khoản shop theo tên hoặc theo mã shop(phải đúng mã)
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const searchShop = async (req, res, next) => {
  const searchText = req.query.text;

  //check id có trống không
  if (searchText) {
    try {
      //tạo câu lệnh truy vấn
      let sql = "";
      sql = `select * from ${tableName} where ${propName} LIKE '%${searchText}%' union select * from ${tableName} where ${codePropName} = '${searchText}';`;
      //thực hiện lấy danh sách shop
      db.execute(sql).then((result) => {
        if (result && result.length > 0) {
          let shops = [];
          result[0].forEach((item) => {
            const shop = new Shop(
              item.ShopId,
              item.ShopCode,
              item.ShopName,
              item.Avatar,
              item.PhoneNumber,
              item.OtherPhoneNumber,
              item.Address,
              item.Email,
              item.OpenTime,
              item.CloseTime,
              item.Rating,
              item.ChatId,
              item.AreaId,
            );
            shops.push(shop);
          });
          res.send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = shops)
            )
          );
        } else {
          res.send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Data is empty."),
              (userMsg = `Không tìm thấy kết quả với từ khóa "${searchText}"`),
              (moreInfo = null),
              (data = null)
            )
          );
        }
      });
    } catch (err) {
      res.send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB001"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
      new Response(
        (isSuccess = true),
        (errorCode = null),
        (devMsg = "Params in request is null"),
        (userMsg = null),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Thêm cửa hàng mới
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const addNewShop = async (req, res, next) => {
  //lấy các giá trị request
  const shopId = Guid.newGuid().toString();
  let shopCode = null;
  const shopName = req.body.shopName;
  const avatar = req.body.avatar ? req.body.avatar : "shops/shops.png";
  const phoneNumber = req.body.phoneNumber;
  const otherPhoneNumber =
    req.body.otherPhoneNumber === undefined ? "" : req.body.otherPhoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const openTime = req.body.openTime;
  const closeTime = req.body.closeTime;
  const chatId = Guid.newGuid().toString();

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới cửa hàng
  const maxCode = await getMaxCode(objName);
  shopCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    shopId &&
    shopCode &&
    shopName &&
    phoneNumber &&
    address &&
    email &&
    openTime &&
    closeTime &&
    chatId
  ) {
    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (ShopId, ShopCode, ShopName, Avatar, PhoneNumber, OtherPhoneNumber, Address, Email, OpenTime, CloseTime, Rating, ChatId) values ('${shopId}', '${shopCode}', '${shopName}', '${avatar}', '${phoneNumber}', '${otherPhoneNumber}', '${address}', '${email}', ${openTime}, '${closeTime}', 0.0, '${chatId}')`
    )
      .then((result) => {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = ""),
            (userMsg = ""),
            (moreInfo = null),
            (data = result)
          )
        );
      })
      .catch((err) => {
        res.send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB004"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không thêm mới được dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
      });
  } else {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = ""),
        (devMsg = "Params in request is null."),
        (userMsg = "Dữ liệu truyền sang đang để trống."),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Cập nhật thông tin cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoShop = async (req, res, next) => {
  const dataReq = JSON.parse(req.body.shop);
  //lấy các giá trị request
  let shopId = dataReq.shopId;
  let shopName = dataReq.shopName;
  let phoneNumber = dataReq.phoneNumber;
  let otherPhoneNumber = dataReq.otherPhoneNumber;
  let email = dataReq.email;
  let address = dataReq.address;
  let openTime = dataReq.openTime;
  let closeTime = dataReq.closeTime;

  //check id shop truyền vào rỗng
  if (shopId) {
    try {
      const existShop = await checkExist(primaryKeyTable, shopId);
      //check tồn tại account admin có id tương ứng
      if (existShop) {
        // Lấy đường dẫn cho ảnh
        if (req.file) {
          avatar = `shops/${req.nameFileImg}`;
          // thực hiện xóa file cũ
          const pathImg = `./public/${existShop.Avatar}`;
          if (existShop.Avatar) {
            fs.unlinkSync(pathImg);
          }
        } else {
          avatar = existShop.Avatar;
        }

        shopName = shopName ? shopName : existShop.ShopName;
        phoneNumber = phoneNumber ? phoneNumber : existShop.PhoneNumber;
        otherPhoneNumber = otherPhoneNumber
          ? otherPhoneNumber
          : existShop.OtherPhoneNumber;
        email = email ? email : existShop.Email;
        address = address ? address : existShop.Address;
        openTime = openTime ? openTime : existShop.OpenTime;
        closeTime = closeTime ? closeTime : existShop.CloseTime;
        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set ShopName = "${shopName}", Avatar = "${avatar}", PhoneNumber = "${phoneNumber}", Address = "${address}", Email = "${email}", OpenTime = "${openTime}", CloseTime = "${closeTime}", OtherPhoneNumber = "${otherPhoneNumber}" where ${primaryKeyTable} = "${shopId}"`
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = result)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = ""),
              (devMsg = `Cannot found account of shop have id='${shopId}' in the database.`),
              (userMsg = `Không tồn tại cửa hàng có id=${shopId} cần cập nhật.`),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB002"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không cập nhật được dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(400)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "Params in request is null."),
          (userMsg = "Dữ liệu truyền sang đang để trống."),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Xóa dữ liệu cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteShop = async (req, res, next) => {
  //lấy các giá trị request
  let shopId = req.params.shopId;

  if (shopId) {
    try {
      const result = await deleteRecord(primaryKeyTable, shopId);
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = ""),
          (devMsg = ""),
          (userMsg = ""),
          (moreInfo = null),
          (data = result)
        )
      );
    } catch (err) {
      res.send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB003"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi không xóa được dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = ""),
        (devMsg = "Params in request is null."),
        (userMsg = "Dữ liệu truyền sang đang để trống."),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};
//#endregion

//#region Private Function
// Lấy thông tin tất cả cửa hàng
const getInfoShops = async (areaId) => {
  let result = null;
  //tạo câu lệnh sql tương ứng
  let sql = `select * from ${tableName}`;
  if(areaId){
    sql += ` where AreaId = '${areaId}'`;
  }
  const response = await db.execute(sql);
  if (response[0] && response[0].length > 0) {
    result = response[0];
  }
  return result;
};
//#endregion

//export controller
module.exports = {
  getShops,
  getShopById,
  searchShop,
  addNewShop,
  updateInfoShop,
  deleteShop,
  getInfoShops,
};
