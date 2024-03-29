import React, { useState, useEffect, useCallback } from "react";
import {
  CCardBody,
  CCol,
  CDataTable,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTextarea,
  CSpinner,
  CModalFooter,
  CButton,
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";
import { formatShowDate, fomatMoney } from "src/utils/Common";
import { SERVER_URL } from "src/config/config";

const CancelOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listCancelOrder, setListCancelOrder] = useState([]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [dataModal, setDataModal] = useState({
    orderId: "",
    orderCode: "",
    orderShippingCode: "",
    total: "",
    createDate: "",
    modifyDate: "",
    customerId: "",
    customerCode: "",
    customerName: "",
    phoneNumber: "",
    shipperCode: "",
    shipperName: "",
    phoneNumberShipper: "",
    address: "",
    reason: "",
    products: [],
  });
  const admin = useSelector((state) => state.authReducer.admin);

  // Hàm thực hiện lấy danh sách hóa đơn bị hủy
  const getShippingOrders = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}admin/orders?status=6&shopId=${admin.shopId}`,
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
          setListCancelOrder(resData.data);
          setIsLoading(false);
          return;
        case 404:
          setListCancelOrder([]);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          alert("Lỗi lấy danh sách hóa đơn bị hủy");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải danh sách hóa đơn bị hủy: ${err}`);
    }
  }, [admin]);

  // Hàm theo dõi để lấy danh sách
  useEffect(() => {
    getShippingOrders();
  }, [getShippingOrders]);

  // Phần config tên cột, style độ rộng cho từng cột của bảng
  const fields = [
    {
      key: "orderCode",
      label: "Mã đơn",
      _style: { width: "7%" },
    },
    {
      key: "orderShippingCode",
      label: "Mã đơn ship",
      _style: { width: "10%" },
    },
    {
      key: "customerCode",
      label: "Mã KH",
      _style: { width: "7%" },
    },
    {
      key: "customerName",
      label: "Tên khách hàng",
      _style: { width: "12%" },
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      _style: { width: "9%" },
    },
    {
      key: "shipperCode",
      label: "Mã shipper",
      _style: { width: "8%" },
    },
    {
      key: "shipperName",
      label: "Tên shipper",
      _style: { width: "12%" },
    },
    {
      key: "phoneNumberShipper",
      label: "Liên hệ shipper",
      _style: { width: "10%" },
    },
    {
      key: "total",
      label: "Tổng tiền",
      _style: { width: "8%" },
    },
    {
      key: "modifyDate",
      label: "Bị hủy lúc",
      _style: { width: "16%" },
    },
  ];

  // Hàm xử lý khi click vào từng dòng
  const handlerOnRowClick = (item) => {
    setDataModal({ ...dataModal, ...item });
    setShowModalDetail(true);
  };

  // Trường hợp chưa load được dữ liệu
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 pt-5">
        <CSpinner color="info" />
      </div>
    );
  }

  // Modal chi tiết đơn và chuyển sang giai đoạn tiếp theo
  const DetailModal = () => {
    // Hàm thực hiện xóa hóa đơn đang được giao
    const deleteDeliveryOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${SERVER_URL}delivery/${dataModal.orderId}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );
        switch (response.status) {
          case 200:
            return;
          default:
            setShowModalDetail(false);
            alert("Lỗi lấy xóa thông tin giao đơn hàng.");
            return;
        }
      } catch (err) {
        setIsLoading(false);
        alert(`Lỗi xóa hóa đơn đang được giao: ${err}`);
      }
    }

    // hàm xác nhận đơn hàng, chuyển sang trạng thái mới
    const handlerConfirmOrder = async () => {
      //fetching data ở đây
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${SERVER_URL}cancel/orders`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              orderId : dataModal.orderId,
            })
          }
        );
        switch (response.status) {
          case 200:
            await deleteDeliveryOrder();
            await getShippingOrders();
            setShowModalDetail(false);
            return;
          case 404:
            setIsLoading(false);
            return;
          default:
            setShowModalDetail(false);
            alert("Lỗi lấy cập nhật trạng thái đơn hàng.");
            return;
        }
      } catch (err) {
        setIsLoading(false);
        alert(`Lỗi tải cập nhật hóa đơn: ${err}`);
      }
    }

    return (
      <CModal
        show={showModalDetail}
        color="info"
        style={{ ...borderCustom }}
        onClose={() => setShowModalDetail(!showModalDetail)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Chi tiết đơn hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Thông tin khách hàng */}
          <div>
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                CHI TIẾT KHÁCH HÀNG
              </div>
            </div>
            <CRow className="mt-2">
              <CCol md="3">Tên khách hàng: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.customerName}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Mã khách hàng: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.customerCode}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Số điện thoại: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.phoneNumber}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Địa chỉ: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.address}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Ngày tạo: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {formatShowDate(dataModal.createDate)}
              </CCol>
            </CRow>
          </div>
          {/* Thông tin shipper */}
          <div className="mt-3">
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                THÔNG TIN SHIPPER
              </div>
            </div>
            <CRow className="mt-2">
              <CCol md="3">Tên shipper: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.shipperName}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Mã shipper: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.shipperCode}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Số điện thoại: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.phoneNumberShipper}
              </CCol>
            </CRow>
          </div>
          <div>
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center mt-3"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                <div>CHI TIẾT ĐƠN HÀNG</div>
              </div>
            </div>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: 7 }}>STT</th>
                  <th style={{ width: 120 }}>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: 90 }}>Số lượng</th>
                  <th style={{ width: 120 }}>Giá sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                {dataModal.products.map((item, index) => (
                  <tr key={item.productCode}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td style={{ textAlign: "right" }}>{item.productAmount}</td>
                    <td style={{ textAlign: "right" }}>
                      {fomatMoney(item.productPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Tổng tiền</th>
                  <th style={{ textAlign: "right" }}>
                    {fomatMoney(dataModal.total)}
                  </th>
                </tr>
              </tfoot>
            </table>
            {/* Thời gian giao hành công */}
            <div className="mt-3">
              <div
                className="d-flex justify-content-between align-items-center mt-3 px-2 py-2"
                style={{ fontWeight: "bold", backgroundColor: COLORS.grey_3 }}
              >
                <div>GIAO HÀNG THẤT BẠI</div>
                <div>{formatShowDate(dataModal.modifyDate)}</div>
              </div>
              <div className="mt-2">
                <div>Lý do thất bại:</div>
                <CTextarea
                  defaultValue={
                    dataModal.reason
                      ? dataModal.reason.Reason
                      : "Không có lý do"
                  }
                  disabled
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="info" shape="pill" onClick={handlerConfirmOrder}>
            Xác nhận hoàn đơn
          </CButton>
          <CButton color="secondary" shape="pill" onClick={() => setShowModalDetail(!showModalDetail)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <CCardBody>
      <DetailModal />
      <CDataTable
        items={listCancelOrder}
        fields={fields}
        columnFilter
        tableFilter
        footer
        itemsPerPageSelect
        itemsPerPage={10}
        hover
        sorter
        pagination
        onRowClick={(item) => handlerOnRowClick(item)}
        scopedSlots={{
          total: (item) => <td>{fomatMoney(item.total)}</td>,
          modifyDate: (item) => <td>{formatShowDate(item.modifyDate)}</td>,
        }}
      />
    </CCardBody>
  );
};

export default CancelOrders;
