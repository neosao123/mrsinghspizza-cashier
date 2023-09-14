import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../reducer/cartReducer";

const Cart = ({ setPayloadEdit, onProductClick }) => {
  const dispatch = useDispatch();
  const [cartListData, setCartListData] = useState();
  let cartdata = useSelector((state) => state.cart.cart);
  const deleteItemFromCart = (ind) => {
    let tmp = [...cartListData];
    tmp.splice(ind, 1);
    dispatch(addToCart([...tmp]));
    toast.error("Item deleted successfully");
  };
  useEffect(() => {
    setCartListData(cartdata);
  }, [cartdata]);

  return (
    <>
      <div>
        {cartdata?.map((data, index) => {
          return (
            <div key={data.cartCode + index}>
              <div className='d-flex justify-content-between'>
                <h6>{data.productName}</h6>
                <span className='mx-0'>${data.amount}</span>
              </div>
              <div className='d-flex justify-content-between'>
                <div className='d-flex justify-content-left'>
                  {data.productType === "custom_pizza" ||
                  data.productType === "Special_Pizza" ? (
                    <>
                      <h6>Size: </h6>
                      <span className='mx-1'>{data.pizzaSize}</span>
                    </>
                  ) : data.productType === "side" ? (
                    <>
                      <h6>Size: </h6>
                      <span className='mx-1'>{data.config.sidesSize}</span>
                    </>
                  ) : null}
                </div>
                <div className='d-flex justify-content-right mx-0 mb-1'>
                  <h6 className='mx-2'>Quantity : </h6>
                  <span className=''>{data.quantity}</span>
                </div>
              </div>
              {data.productType === "Special_Pizza" ||
              data.productType === "custom_pizza" ? (
                <div className='row d-flex'>
                  <div className='d-flex justify-content-left'>
                    <h6 className='me-1 col-auto'>Toppings : </h6>
                    <span className='mx-1'>
                      {data?.config?.pizza?.map((pizza, index) => {
                        return (
                          <>
                            <p key={"pizza" + index} className='mb-1'>
                              Pizza {index + 1} :{" "}
                              {[
                                ...pizza?.toppings?.countAsOneToppings,
                                ...pizza?.toppings?.countAsTwoToppings,
                                ...pizza?.toppings?.freeToppings,
                              ]
                                .slice(0, 6)
                                .map((pizzaItem) => {
                                  return (
                                    <p
                                      key={pizzaItem.toppingsCode}
                                      className='d-inline-block m-0'
                                    >
                                      {pizzaItem?.toppingsName} ,
                                    </p>
                                  );
                                })}
                            </p>
                          </>
                        );
                      })}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className='d-flex align-items-center'>
                <span
                  className='btn m-0 p-0'
                  onClick={() => deleteItemFromCart(index)}
                  type='button'
                >
                  <i
                    className='fa fa-trash-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#ff5555" }}
                  ></i>
                </span>
                <span
                  className='btn  mx-3'
                  onClick={() => {
                    setPayloadEdit(cartdata[index]);
                    onProductClick(cartdata[index].productType);
                  }}
                >
                  <i
                    className='fa fa-pencil-square-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                  ></i>
                </span>
              </div>
              <hr className='border border-2 my-2 divider'></hr>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cart;
