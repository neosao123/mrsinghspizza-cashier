import React, { useEffect, useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";
import {
  allDeliveryExecutiveApi,
  changeDeliveryExecutive,
  orderDetails,
  orderListApi,
} from "../../API/order";
import { ToastContainer, toast } from "react-toastify";

function Order() {
  const [listData, setListData] = useState();
  const [orderFrom, setOrderFrom] = useState("all");
  const [orderDetail, setOrderDetail] = useState();
  const [orderId, setOrderId] = useState();
  const [allDeliveryExecutiveData, setAllDeliveryExecutiveData] = useState();
  const [updatedDeliveryExecutive, setUpdatedDeliveryExecutive] = useState();

  const orderList = async () => {
    let cashierCode = localStorage.getItem("cashierCode");
    orderListApi({ cashierCode: cashierCode, orderFrom: orderFrom })
      .then((res) => {
        setListData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Order List API : ", err);
      });
  };
  const handleDeliveryExecutiveChange = (payload) => {
    console.log(payload, "Order Detail :");
    if (payload !== "") {
      setUpdatedDeliveryExecutive(payload);
    }
  };
  const getOrderDetailsApi = async () => {
    await orderDetails({ orderCode: orderId }).then((res) => {
      setOrderDetail(res.data.data);
    });
  };
  const updateDeliveryExecutive = async () => {
    if (updatedDeliveryExecutive !== "") {
      await changeDeliveryExecutive({
        orderCode: orderId,
        deliveryExecutiveCode: updatedDeliveryExecutive,
      })
        .then((res) => {
          toast.success(res.data.message);
          getOrderDetailsApi();
          setUpdatedDeliveryExecutive();
        })
        .catch((err) => toast.error(err?.response?.data.message));
    } else {
      toast.error("select delivery executive");
    }
  };

  const getAllDeliveryExecutive = async () => {
    await allDeliveryExecutiveApi()
      .then((res) => {
        setAllDeliveryExecutiveData(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    console.log(orderDetail, "orderDetail");
  }, [orderDetail]);

  useEffect(() => {
    if (orderId !== undefined) {
      getOrderDetailsApi();
    }
  }, [orderId]);

  useEffect(() => {
    orderList();
    setOrderDetail();
    getAllDeliveryExecutive();
  }, [orderFrom]);

  return (
    <>
      <Nav />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-4 p-0   text-center main'>
            <div className='card'>
              <div className='selectDiv p-0'>
                <select
                  className='form-select px-4 py-2 orderType-selection'
                  onChange={(e) => setOrderFrom(e.target.value)}
                >
                  <option value=''>--Choose --</option>
                  <option value='store' className='options'>
                    Store Order
                  </option>
                  <option value='online' className='options'>
                    Online Order
                  </option>
                </select>
              </div>
              <div>
                {orderFrom && (
                  <h6
                    className={
                      "orderTitle mb-0 py-1 text-white " +
                      (orderFrom === "store" ? "bg-info" : "bg-dark")
                    }
                  >
                    {orderFrom.toLocaleUpperCase()}
                  </h6>
                )}
                <div
                  className='overflow-scroll'
                  style={{ height: "calc(100vh - 147px)" }}
                >
                  <ul className='list-group list-group-flush'>
                    {listData?.map((data) => {
                      return (
                        <li
                          className='list-group-item p-1 orderList'
                          key={data.code}
                          onClick={() => setOrderId(data.code)}
                        >
                          <div className='d-flex px-3 my-1 justify-content-between align-items-center'>
                            <div>
                              <span>
                                <strong>#</strong>
                              </span>
                              <span className='mx-3'>{data.code}</span>
                            </div>
                            <div>
                              <span className='mx-3'>$ {data.grandTotal}</span>
                            </div>
                            <div className='d-flex my-1 justify-content-end '>
                              <span>
                                <i
                                  class='fa fa-map-marker'
                                  aria-hidden='true'
                                ></i>
                              </span>
                              <span className='mx-2 badge bg-info'>Store</span>
                            </div>
                            <div className='d-flex my-1 justify-content-end'>
                              <span>
                                <i class='fa fa-check' aria-hidden='true'></i>
                              </span>
                              <span className='mx-2 badge bg-secondary'>
                                {data?.deliveryType}
                              </span>
                            </div>
                            <div className='d-flex my-1 justify-content-end'>
                              <span>
                                <i class='fa fa-trash' aria-hidden='true'></i>
                              </span>
                              <span className='mx-2 badge bg-danger'>
                                Cancel
                              </span>
                            </div>
                          </div>
                          <div className='d-flex justify-content-between'>
                            <div className='d-flex px-3 my-1 justify-content-start'>
                              <span>
                                <i class='fa fa-user' aria-hidden='true'></i>
                              </span>
                              <span className='mx-3'>{data.customerName}</span>
                            </div>
                            <div className='d-flex px-3 my-1 justify-content-end'>
                              <span className='mx-2'>
                                <i class='fa fa-phone' aria-hidden='true'></i>
                              </span>
                              <span className='mx-2'>{data.mobileNumber}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {orderDetail && (
            <div
              className='col-lg-8 overflow-scroll'
              style={{ height: "calc(100vh - 147px)" }}
            >
              <div
                className='m-5 px-5 p-4 rounded vh-100'
                style={{ backgroundColor: "#ff8c0021" }}
              >
                <div className='col-12 d-flex justify-content-between my-3'>
                  <div className='col-6 h5'>Order Details</div>
                  <div className='col-6 d-flex justify-content-end pe-4'>
                    <div
                      className='btn text-white'
                      style={{ backgroundColor: "#ff8c00" }}
                    >
                      Print
                    </div>
                  </div>
                </div>
                <div className='col-12 d-flex '>
                  <div className='col-4'>
                    <h6 className='py-2'>Order No : {orderDetail?.code}</h6>
                    <h6 className='py-2'>
                      Phone No : {orderDetail?.mobileNumber}
                    </h6>
                    <h6 className='py-2'>Address : {orderDetail?.address}</h6>
                    <h6 className='py-2'>Zip Code : {orderDetail?.code}</h6>
                    <h6 className='py-2'>
                      Delivery Type : {orderDetail?.deliveryType}
                    </h6>
                  </div>
                  <div className='col-4 text-left'>
                    <h6 className='py-2'>
                      Date :{" "}
                      {new Date(orderDetail?.created_at)
                        .toISOString()
                        .replace(/T/, " ")
                        .replace(/\.\d+Z$/, "")}
                    </h6>
                    <h6 className='py-2'>Name : {orderDetail?.customerName}</h6>
                    <h6 className='py-2'>
                      Store Location : {orderDetail?.storeLocation}
                    </h6>
                    <h6 className='py-2'>
                      Delivery Executive : {orderDetail?.deliveryExecutiveName}
                    </h6>
                  </div>
                  <div className='col-4'>
                    <h6 className='py-2'>Type :</h6>
                  </div>
                </div>
                <div className='col-12 d-flex justify-content-end'>
                  <button
                    className='btn text-white  m-2'
                    style={{ backgroundColor: "#ff8c00" }}
                    data-bs-toggle='modal'
                    data-bs-target='#exampleModal'
                  >
                    Change Delivery Person
                  </button>
                </div>
                <div className='col-12'>
                  <h5>Product Detail :</h5>
                </div>

                <table class='table'>
                  <tbody>
                    <tr>
                      <th scope='row'>Sr No</th>
                      <th>Product </th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Amount</th>
                    </tr>
                    {orderDetail?.orderItems?.map((order, index) => {
                      console.log(order, "order");
                      const keyNames = Object.keys(order?.config);
                      const objectToArray = Object.entries(order?.config).map(
                        ([key, value]) => ({ key, value })
                      );

                      console.log(objectToArray, "keyNames");

                      return (
                        <tr key={index + order?.productName}>
                          <td scope='row'>{index + 1}</td>
                          <td>
                            {order.productName}{" "}
                            {/* {order?.config?.map((item) => {
                              return;
                            })}{" "} */}
                            {objectToArray?.map((item, index) => {
                              console.log(item, "keyNames");
                              if (item?.key === "pizza") {
                                return (
                                  <>
                                    <p>{item.key} :</p>
                                    {/* <span>
                                      {item?.value[0].map((child) => {})}
                                    </span> */}
                                  </>
                                );
                              }
                            })}
                          </td>
                          <td>{order.quantity}</td>
                          <td>$ {order.price}</td>
                          <td>$ {order.amount}</td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Sub Total :</th>
                      <td> $ {orderDetail?.subTotal}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Discount :</th>
                      <td>$ {orderDetail?.discountmount}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Tax :</th>
                      <td>$ {orderDetail?.taxPer}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Delivery Charges:</th>
                      <td>$ {orderDetail?.deliveryCharges}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Grand Total :</th>
                      <td>$ {orderDetail?.grandTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        class='modal fade'
        id='exampleModal'
        tabindex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog modal-dialog-centered'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>Change Delivery Executive</h5>
              <button
                type='button'
                class='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div class='modal-body'>
              <select
                class='form-select form-select-sm'
                aria-label='.form-select-sm example'
                value={updatedDeliveryExecutive?.code}
                onChange={(e) => handleDeliveryExecutiveChange(e.target.value)}
              >
                <option selected value={""}>
                  Choose Delivery Executive
                </option>
                {allDeliveryExecutiveData?.map((executive) => {
                  return (
                    <option value={executive?.code} key={executive?.code}>
                      {executive.firstName} {executive.lastName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                style={{ backgroundColor: "#ff8c00" }}
                class='btn text-white'
                data-bs-dismiss='modal'
                onClick={updateDeliveryExecutive}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position='top-center' />
    </>
  );
}

export default Order;
