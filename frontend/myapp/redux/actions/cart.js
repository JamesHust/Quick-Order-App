import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { Alert } from "react-native";

//Khai báo các type của cartAction
export const GET_CART = "GET_CART";
export const REMOVE_CART = "REMOVE_CART";

export const ADD_QUICK_CART = "ADD_QUICK_CART";
export const REMOVE_QUICK_CART = "REMOVE_QUICK_CART";

export const ADD_SELECTED_PROD = "ADD_SELECTED_PROD";
export const REMOVE_SELECTED_PROD = "REMOVE_SELECTED_PROD";
export const REMOVE_ALL_SELECTED = "REMOVE_ALL_SELECTED";

/**
 * Hàm action lấy danh sách cart và lưu lại
 * @returns
 */
export const getOldCart = (customerId, token) => {
  return async (dispatch) => {
    console.log("getOldCart");
    try {
      const response = await fetch(
        `http://192.168.0.4:3000/api/carts?customerId=${customerId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          if (resData.data) {
            // Lưu token vào storage
            return dispatch({ type: GET_CART, cart: resData.data });
          }else{
            dispatch({ type: GET_CART, cart: [] });
          }

        case 404:
          // Lưu token vào storage
          return dispatch({ type: GET_CART, cart: [] });
        default:
          Alert.alert("goFAST", "Lấy giỏ hàng cũ thất bại", [
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm action xử lý sự kiện chọn sản phẩm trong giỏ hàng
 * Cập nhật lại danh sách sản phẩm được chọn
 * @returns
 */
export const addSelectedProductCart = (idProd) => {
  return (dispatch) => {
    try {
      dispatch({ type: ADD_SELECTED_PROD, idProd: idProd });
      return;
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm action xử lý sự kiện bỏ chọn sản phẩm trong cửa hàng
 * Xóa sản phẩm trong danh sách sản phẩm được chọn
 * @returns
 */
export const removeSelectedProductCart = (prodId) => {
  return (dispatch) => {
    try {
      return dispatch({ type: REMOVE_SELECTED_PROD, prodId: prodId });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm action xử lý khi xóa toàn bộ các sản phẩm được chọn khỏi giỏ hàng
 * @returns
 */
export const removeAllSelected = () => {
  return (dispatch) => {
    console.log("removeAllSelected");
    try {
      return dispatch({ type: REMOVE_ALL_SELECTED });
    } catch (err) {
      throw err;
    }
  };
};
