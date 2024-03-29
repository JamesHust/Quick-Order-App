import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { Alert } from "react-native";
import configData from "../../config/config.json";

//Khai báo các type của authAction
export const SAVE_TOKEN = "SAVE_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";

/**
 * Hàm action lưu token khi đăng nhập
 * @returns
 */
export const storageToken = (data) => {
  return async (dispatch) => {
    try {
      const token = data.accessToken;
      const customer = data.user ? data.user : data.customer;
      // Lưu token vào storage
      await AsyncStorage.setItem("userToken", token);
      return dispatch({ type: SAVE_TOKEN, customer: customer, token: token });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm action xử lý sự kiện khi đăng xuất
 * Xóa token trong DB và storage
 * @returns
 */
export const logout = () => {
  return async (dispatch) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      // Thực hiện xóa token trong cơ sở dữ liệu
      const response = await fetch(`${configData.SERVER_URL}logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": userToken,
        },
      });
      switch (response.status) {
        case 200:
          await AsyncStorage.removeItem("userToken");
          return dispatch({ type: REMOVE_TOKEN });
        case 403:
          Alert.alert("goFAST", "Chưa xác thực được người dùng", [
            {
              text: "OK",
              style: "cancel",
            },
          ])
          return;
      }
    } catch (err) {
      throw err;
    }
  };
};
