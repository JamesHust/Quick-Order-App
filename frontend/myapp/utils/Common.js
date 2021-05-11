import { ToastAndroid } from "react-native";

export const addRequireSourceImg = (path) => {
  return `require("${path}")`;
};

//Hàm thêm '.' vào số
export const addDotToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Hàm show thông báo
export const showToast = (textMess) => {
  ToastAndroid.show(textMess, ToastAndroid.SHORT);
};

//Hàm format lại hiển thị thời gian ngày tháng
export const formatShowDate = (dateTime) => {
  const date = dateTime.split("T")[0];
  const time = dateTime.split("T")[1].split(".")[0];
  const dateArr = date.split("-");
  const timeArr = time.split(":");
  return `${timeArr[0]}:${timeArr[1]} ${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
} 
