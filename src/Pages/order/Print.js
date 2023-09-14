import React from "react";
import { PizzaDetails, ToppingsList } from "./Order";
import { useSelector } from "react-redux";
import Barcode from "../../assets/Barcode.jpg";
import Logo from "../../assets/logo.png";

const Print = ({ orderDetail, printRef }) => {
  return (
    <div className="d-non">
      <div className="col-12 m-1" style={{ width: "273px" }} ref={printRef}>
        <div className="row">
          <div className="d-flex justify-content-center">
            <img
              src={Logo}
              alt="Mr. Singh's Pizza logo"
              width={"30px"}
              height={"30px"}
              className="m-1"
            ></img>
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
                  Date :{" "}
                  {
                    new Date(orderDetail?.created_at)
                      .toISOString()
                      .replace(/T/, " ")
                      .replace(/\.\d+Z$/, "")
                      .split(" ")[0]
                  }
                </p>
                <p className="m-0">
                  Time :{" "}
                  {
                    new Date(orderDetail?.created_at)
                      .toISOString()
                      .replace(/T/, " ")
                      .replace(/\.\d+Z$/, "")
                      .split(" ")[1]
                  }
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="m-0">
                  {orderDetail?.customerName} - Ph. {orderDetail?.mobileNumber}
                </p>
                <p className="m-0 fw-bold text-capitalize">
                  {orderDetail?.deliveryType}
                </p>
              </div>
            </>
          )}
          <div className="d-flex">
            <p className="p-0 m-0 col-6">
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
          const objectToArray = Object.entries(order?.config).map(
            ([key, value]) => ({ key, value })
          );
          return (
            <div className="row" key={index + order?.productName}>
              <div className="col-2">
                <span className="m-0">{order.quantity}</span>
              </div>
              {product_type === "custom_pizza" ? (
                <div className="col-10">
                  <div className="row g-0 m-0 p-0">
                    <div className="col-9">Pizza {order?.pizzaSize}</div>
                    <div className="col-3 text-end">$ {order.amount}</div>
                  </div>
                </div>
              ) : (
                <div className="col-10">
                  <div className="row g-0 m-0 p-0">
                    <div className="col-9">
                      {product_type === "custom_pizza" ? "" : order.productName}
                    </div>
                    <div className="col-3 text-end ">
                      ${" "}
                      {product_type !== "special_pizza"
                        ? order.amount
                        : order.pizzaPrice}
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
                                  <span className="p-0 m-0">{dips.qty} </span>
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
                      item.value[0]?.sideName !== undefined ? (
                        <div className="row pe-0">
                          <div className="col-2"></div>
                          <div className="col-10">
                            <strong
                              className="m-0"
                              style={{ color: "#191919" }}
                            >
                              Sides :{" "}
                            </strong>
                            {item.value.map((side, index) => {
                              return (
                                <div className="col-12 pe-0">
                                  <div className="row pe-0">
                                    <div
                                      className="col-9 text-capitalize"
                                      key={index}
                                    >
                                      {side?.sideName !== undefined
                                        ? side?.sideName
                                        : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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
                        {product_type !== "custom_pizza" && (
                          <p className="m-0 text-capitalize p-0">
                            {item.key} ({order?.pizzaSize})
                          </p>
                        )}
                        <PizzaDetails
                          pizzaData={item}
                          productType={product_type}
                        />
                        {order?.comments !== "" && (
                          <p className="m-0 text-capitalize fst-italic">
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
            {Number(orderDetail?.extraDeliveryCharges) > 0 ? (
              <p className="m-0 p-0">
                Extra Delivery Charges : ${" "}
                {Number(orderDetail?.extraDeliveryCharges)}
              </p>
            ) : null}
            {orderDetail?.deliveryType === "delivery" && (
              <p className="m-0 p-0">
                Delivery Charges:$ {orderDetail?.deliveryCharges}
              </p>
            )}
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
