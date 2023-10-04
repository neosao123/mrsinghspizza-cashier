import React from "react";
import { PizzaDetails, ToppingsList } from "./Order";
import { useSelector } from "react-redux";
import Barcode from "../../assets/Barcode.jpg";
import Logo from "../../assets/logo.png";
import moment from "moment/moment";
import "./print.css";

const sideTypeArr = ["poutine", "subs"];

const Print = ({ orderDetail, printRef }) => {
  return (
    // style={{ fontSize: ".8rem" }}
    <div className="d-none fs-6">
      <div className="col-12 m-1" style={{ width: "273px" }} ref={printRef}>
        <div className="row">
          <div className="d-flex justify-content-center">
            <img
              src={Logo}
              alt="Mr. Singh's Pizza logo"
              width={"30px"}
              height={"30px"}
              className="m-1"
            />
            <div className="d-flex flex-column">
              <h3 className="text-center m-0 ">Mr Singh's Pizza</h3>
              <p className="text-center m-0 p-0">Pure vegetarian</p>
            </div>
          </div>
          <p className="text-center mb-0">
            {orderDetail?.storeAddress ? orderDetail?.storeAddress : ""}
          </p>
          <p className="text-center mb-1">905-500-4000</p>
        </div>
        <div className="row">
          {orderDetail?.created_at !== undefined && (
            <>
              <div className="d-flex justify-content-between">
                <p className="m-0"></p>
                <p className="m-0">#{orderDetail?.orderCode}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="m-0">
                  {" "}
                  Date : {moment(orderDetail?.created_at).format("DD-MM-YYYY")}
                </p>
                <p className="m-0">
                  Time : {moment(orderDetail?.created_at).format("hh:mm A")}
                </p>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <div className="col-6">
                  {orderDetail?.customerName !== "" && (
                    <p className="m-0 fw-bold">{orderDetail?.customerName}</p>
                  )}
                  <p className="m-0 fw-bold">Ph. {orderDetail?.mobileNumber}</p>
                </div>
                <div className="col-6">
                  <p className="m-0 fw-bold text-capitalize text-end">
                    {orderDetail?.deliveryType}
                  </p>
                </div>
              </div>
            </>
          )}
          {orderDetail?.deliveryType === "delivery" && (
            <div className="d-flex">
              <p className="p-0 m-0 col-12">
                Delv addr : {orderDetail?.address}
              </p>
            </div>
          )}
          <div className="d-flex">
            <p
              className={`p-0 m-0 ${orderDetail?.deliveryType === "delivery" ? "col-6" : "col-12"
                }`}
            >
              OrderTakenBy: {orderDetail?.cashierName}
            </p>
            {orderDetail?.deliveryType === "delivery" && (
              <span className="col-6 text-end">
                Delivery Executive : {orderDetail?.deliveryExecutiveName}
              </span>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-2 text-dark" style={{ fontWeight: "600" }}>
            Qty
          </div>
          <div className="col-7 text-dark" style={{ fontWeight: "600" }}>
            Item
          </div>
          <div
            className="col-3 text-dark text-end"
            style={{ fontWeight: "600" }}
          >
            Amount
          </div>
        </div>
        {orderDetail?.orderItems?.map((order, index) => {
          const product_type = order.productType.toLowerCase();
          const orderConfig = order.config;
          const objectToArray = Object.entries(order?.config).map(
            ([key, value]) => ({ key, value })
          );
          // {
          //   console.log(order);
          // }
          return (
            <div className="row" key={index + order?.productName}>
              <div className="col-2">
                <span className="m-0">{order.quantity}</span>
              </div>
              {product_type === "special_pizza" && (
                <div className="col-10">
                  <div className="row g-0 m-0 p-0">
                    <div className="col-9">
                      <div className="">
                        <b>Pizza ({order?.pizzaSize})</b>
                      </div>
                    </div>
                    <div className="col-3 text-end">$ {order.pizzaPrice}</div>
                  </div>
                </div>
              )}
              {product_type === "custom_pizza" ? (
                <div className="col-10">
                  <div className="row g-0 m-0 p-0">
                    <div className="col-9">
                      <div className="">
                        <b>Pizza ({order?.pizzaSize})</b>
                      </div>                       
                    </div>
                    <div className="col-3 text-end">$ {order.amount}</div>
                  </div>
                </div>
              ) : (
                <div className="col-10">
                  <div className="row g-0 m-0 p-0">
                    <div className="col-9">
                      <b style={{ textTransform: "capitalize" }}>
                        {product_type === "side" &&
                          sideTypeArr.includes(orderConfig?.sidesType)
                          ? `(${orderConfig?.sidesType}) `
                          : ""}
                      </b>
                      {product_type === "custom_pizza" ||
                        product_type === "special_pizza" ? (
                        ""
                      ) : (
                        <>
                          <b>{order.productName}</b>
                        </>
                      )}
                    </div>
                    {product_type !== "special_pizza" ? (
                      <div className="col-3 text-end ">$ {order.amount}</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}

              {product_type === "side" && (
                <div className="row pe-0">
                  <div className="col-2 d-flex align-items-end">
                    <span className="p-0 m-0"> </span>
                  </div>
                  <div className="col-10">
                    <div className="col-12 text-capitalize">
                      <div>
                        <div className="row">
                          <div className="col-9 text-capitalize" key={index}>
                            {order?.config?.sidesSize}
                          </div>
                          {product_type !== "side" && (
                            <div className="col-3 text-end pe-0 ">$ { }</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {objectToArray?.map((item, index) => {
                if (item.key === "dips") {
                  return (
                    <>
                      {item?.value[0]?.dipsName !== undefined && (
                        <div className="row pe-0">
                          {item?.value?.map((dips, index) => {
                            return (
                              <>
                                <div className="col-2 d-flex align-items-end">
                                  <span className="p-0 m-0">
                                    {dips.quantity}{" "}
                                  </span>
                                </div>
                                <div className="col-10">
                                  {index === 0 && (
                                    <strong
                                      className="m-0"
                                      style={{ color: "#191919" }}
                                    >
                                      Dips :{" "}
                                    </strong>
                                  )}
                                  <div className="col-12 text-capitalize">
                                    <div>
                                      <div className="row">
                                        <div
                                          className="col-9 text-capitalize"
                                          key={index}
                                        >
                                          {dips.dipsName}
                                        </div>
                                        {product_type !== "special_pizza" && (
                                          <div className="col-3 text-end pe-0 ">
                                            $
                                            {dips.dipsPrice !== undefined
                                              ? dips.dipsPrice
                                              : dips?.price}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                }
                if (item.key === "sides") {
                  return (
                    <>
                      {item.value.length > 0 &&
                        (item.value[0]?.sideName !== undefined ||
                          item.value[0]?.sidesName !== undefined) ? (
                        <div className="row pe-0">
                          {item.value.map((side, index) => {
                            console.log("side array data : ", side)
                            return (
                              <>
                                <div className="col-2 d-flex align-items-end">
                                  <span className="p-0 m-0">
                                    {side.quantity}
                                  </span>
                                </div>
                                <div className="col-10">
                                  {index === 0 && (
                                    <strong
                                      className="m-0"
                                      style={{ color: "#191919" }}
                                    >
                                      Sides :
                                    </strong>
                                  )}
                                  <div className="col-12 text-capitalize">
                                    <div>
                                      <div className="row">
                                        <div
                                          className={`text-capitalize ${product_type !== "special_pizza"
                                            ? "col-9"
                                            : "col-12"
                                            } `}
                                          key={index}
                                        >
                                          <span className="me-1 fw-bold">
                                            {sideTypeArr.includes(
                                              side?.sidesType
                                            )
                                              ? `(${side?.sidesType})`
                                              : ""}
                                            {side?.sideName}
                                          </span>
                                          <span>
                                            {side?.sideSize === undefined
                                              ? `(${side?.lineEntries[0]?.sidesSize})`
                                              : `(${side?.sideSize})`}
                                          </span>
                                        </div>
                                        {product_type !== "special_pizza" && (
                                          <div className="col-3 text-end p-0">
                                            {product_type !== "special_pizza" &&
                                              (side?.sidePrice !== undefined
                                                ? `$ ` + side?.sidePrice
                                                : side?.lineEntries !==
                                                  undefined
                                                  ? `$ ` +
                                                  side?.lineEntries[0]?.price
                                                  : null)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      ) : null}
                    </>
                  );
                }
                if (item?.key === "pizza") {
                  return (
                    <div className="row pe-0">
                      <div className="col-2"></div>
                      <div className="col-10">
                        {/* {(product_type !== "custom_pizza" ||
                          product_type !== "special_pizza") && (
                          <p className="m-0 text-capitalize p-0 fw-bold">
                            {item.key} ({order?.pizzaSize})
                          </p>
                        )} */}
                        <PizzaDetails
                          pizzaData={item}
                          productType={product_type}
                        />
                        {order?.comments !== "" && (
                          <p className="m-0 text-capitalize fst-italic fw-bold">
                            Comment : {order?.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                if (item.key === "drinks") {
                  return (
                    <>
                      {item?.value[0]?.drinksName !== undefined && (
                        <div
                          className="row pe-0"
                          style={{ padding: "0px !important" }}
                        >
                          <div className="col-2"> </div>
                          <div className="col-10">
                            {product_type === "custom_pizza" ||
                              product_type === "special_pizza" ? (
                              <>
                                <strong
                                  className="m-0"
                                  style={{ color: "#191919" }}
                                >
                                  Drinks :{" "}
                                </strong>
                                <div className="col-12 text-capitalize">
                                  {item.value?.map((drink, index) => {
                                    return (
                                      <>
                                        <div
                                          className="p-0"
                                          style={{ padding: "0px !important" }}
                                        >
                                          <div className="row p-0">
                                            <div
                                              className="col-9 text-capitalize"
                                              key={index}
                                            >
                                              {drink.drinksName}
                                            </div>
                                            {product_type !==
                                              "special_pizza" && (
                                                <div className="col-3 text-end pe-0">
                                                  ${drink.drinksPrice}
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </>
                  );
                }
              })}
              <hr />
            </div>
          );
        })}
        <div className="row">
          <div className="col-4 m-0">
            <img
              src={Barcode}
              width={"100px"}
              height={"100px"}
              className="mt-1"
              alt=""
            />
          </div>
          <div className="col-8 text-end pe-1">
            <p className="m-0 p-0">Sub Total : $ {orderDetail?.subTotal}</p>
            <p className="m-0 p-0">Tax : $ {orderDetail?.taxAmount}</p>
            {orderDetail?.deliveryType === "delivery" && (
              <p className="m-0 p-0">
                Delivery Charges:$ {orderDetail?.deliveryCharges}
              </p>
            )}
            {Number(orderDetail?.extraDeliveryCharges) > 0 ? (
              <p className="m-0 p-0">
                Extra Delivery Charges : ${" "}
                {Number(orderDetail?.extraDeliveryCharges)}
              </p>
            ) : null}
            {orderDetail?.discountmount !== "0.00" && (
              <p className="m-0 p-0">
                Discount : $ {Number(orderDetail?.discountmount)}
              </p>
            )}
            <p className="m-0 p-0 fw-bold">
              Grand Total : $ {orderDetail?.grandTotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
