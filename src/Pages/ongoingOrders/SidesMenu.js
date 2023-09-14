import React, { useEffect, useState } from "react";
import { sidesApi } from "../../API/ongoingOrder";
import $ from "jquery";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducer/cartReducer";

function SidesMenu({ discount, taxPer, payloadEdit, setPayloadEdit }) {
  const [sidesData, setSidesData] = useState();
  const [quantity, setQuantity] = useState(1);
  const [sidesArr, setSidesArr] = useState([]);
  const [comments, setComments] = useState("");
  let cartdata = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    sides();
  }, []);

  // handle Quantity
  const handleQuantity = (e, side) => {
    const inputValue = e.target.value;
    let index = sidesArr?.findIndex((item) => item.sideCode === side.sideCode);
    if (index !== -1) {
      let arr = [...sidesArr];
      arr[index].qty = e.target.value < 0 ? 1 : e.target.value;
      setSidesArr(arr);
    } else {
      setSidesArr([
        ...sidesArr,
        { ...side, qty: e.target.value < 0 ? 1 : e.target.value },
      ]);
    }
  };
  const handleSidesLineChange = (e, data) => {
    let index = sidesArr?.findIndex((item) => item.sideCode === data.sideCode);
    let selectedSideLine = sidesArr[index]?.combination?.filter(
      (item) => item.lineCode === e.target.value
    );
    let obj = sidesData.find((item) => item.sideCode === data.sideCode);
    if (index !== -1) {
      let arr = [...sidesArr];

      arr[index].combination = obj.combination.filter(
        (item) => item.lineCode === e.target.value
      );
      setSidesArr(arr);
    } else {
      let selectedSideLine = data?.combination?.filter(
        (item) => item.lineCode === e.target.value
      );
      setSidesArr([{ ...data, combination: selectedSideLine }]);
    }
  };

  // Onclick handle Add To Cart & API - Add To Cart
  const handleAddToCart = async (e, sideCode, Obj) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    let lineCode = $("#combination-" + sideCode)
      .find(":selected")
      .attr("data-key");

    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }

    const selectedSideForNewItem = sidesArr?.filter(
      (sides) => sides.sideCode === sideCode
    );
    const selectedCombination = selectedSideForNewItem[0]?.combination?.filter(
      (data) => data.lineCode === lineCode
    );
    const selectedCombinationObj = Obj?.combination?.filter(
      (data) => data.lineCode === lineCode
    );
    let price =
      selectedCombination !== undefined
        ? selectedCombination[0]?.price
        : selectedCombinationObj[0]?.price;
    let totalAmount = 0;
    totalAmount =
      Number(price) *
      (selectedSideForNewItem[0]?.qty !== undefined
        ? Number(selectedSideForNewItem[0]?.qty)
        : 1);

    if (selectedSideForNewItem.length === 0) {
      const payload = {
        id: uuidv4(),
        customerCode: customerCode ? customerCode : "#NA",
        productCode: Obj.sideCode,
        productName: Obj?.sideName,
        productType: "side",
        config: {
          lineCode: selectedCombinationObj[0].lineCode,
          sidesSize: selectedCombinationObj[0].size,
        },
        quantity: 1,
        price: selectedCombinationObj[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);
      setSidesArr([]);
      dispatch(addToCart([...cartdata, payload]));
      toast.success(`${Obj.sideName} ` + "Added Successfully");
      return;
    }

    setSidesArr([
      ...sidesArr,
      {
        ...selectedSideForNewItem,
        qty: 1,
      },
    ]);

    const selectedSide = sidesArr?.filter(
      (sides) => sides.sideCode === sideCode
    );

    if (payloadEdit !== undefined && payloadEdit.productType === "side") {
      const payloadForEdit = {
        id: payloadEdit?.id,
        customerCode: customerCode ? customerCode : "#NA",
        productCode: selectedSide[0].sideCode,
        productName: selectedSide[0].sideName,
        productType: "side",
        config: {
          lineCode: selectedSide[0].combination[0].lineCode,
          sidesSize: selectedSide[0].combination[0].size,
        },
        quantity: selectedSide[0].qty,
        price: selectedSide[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      let tempPayload = [...cartdata];
      tempPayload[updatedCart] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      setPayloadEdit();
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);
      setSidesArr([]);

      setQuantity(1);
    } else {
      const payload = {
        id: uuidv4(),
        customerCode: customerCode ? customerCode : "#NA",
        productCode: selectedSideForNewItem[0]?.sideCode,
        productName: selectedSideForNewItem[0]?.sideName,
        productType: "side",
        config: {
          lineCode: selectedCombination[0]?.lineCode,
          sidesSize: selectedCombination[0]?.size,
        },
        quantity: selectedSideForNewItem[0]?.qty
          ? selectedSideForNewItem[0]?.qty
          : 1,
        price: selectedCombination[0]?.price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);
      setSidesArr([]);
      dispatch(addToCart([...cartdata, payload]));
      toast.success(
        `${selectedSideForNewItem[0]?.sideName} ` + "Added Successfully"
      );
    }
  };
  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "side") {
      setSidesArr([
        ...sidesArr,
        {
          sideCode: payloadEdit?.productCode,
          sideName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
          combination: [payloadEdit?.config],
        },
      ]);
    }
  }, [payloadEdit]);

  //API - Sides
  const sides = () => {
    sidesApi()
      .then((res) => {
        setSidesData(
          res.data.data?.map((item) => {
            return {
              ...item,
              qty: 1,
            };
          })
        );
      })
      .catch((err) => {
        console.log("ERROR From SidesMenu API: ", err);
      });
  };

  return (
    <>
      <ul
        className='list-group'
        style={{ overflowY: "scroll", height: "30rem" }}
      >
        {sidesData?.map((data, index) => {
          let comm = sidesArr?.findIndex(
            (item) => item.sideCode === data.sideCode
          );
          let obj = sidesArr?.find((item) => item.sideCode === data.sideCode);

          return (
            <li className='list-group-item' key={data.sideCode}>
              <div className='d-flex justify-content-between align-items-end py-2 px-1'>
                <div className='d-flex justify-content-center w-auto'>
                  {/* <img
                    className='rounded'
                    src={data.image === "" ? `${specialImg1}` : data.image}
                    width='50px'
                    height='50px'
                    alt=''
                  ></img> */}
                </div>
                <div className='d-flex justify-content-center flex-column py-1 w-100'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='mb-2'>
                      {data.sideName}{" "}
                      <span className={"badge-" + data.type}>
                        ({data.type})
                      </span>
                    </h6>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <select
                      className='form-select'
                      style={{ width: "35%" }}
                      id={"combination-" + data.sideCode}
                      onChange={(e) => {
                        handleSidesLineChange(e, data);
                      }}
                      value={
                        comm !== -1
                          ? sidesArr[comm]?.combination[0]?.lineCode
                          : null
                      }
                    >
                      {data?.combination?.map((combinationData) => {
                        return (
                          <>
                            <option
                              key={combinationData.lineCode}
                              data-key={combinationData.lineCode}
                              data-price={combinationData.price}
                              value={combinationData.lineCode}
                            >
                              {combinationData.size} - $ {combinationData.price}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    <input
                      type='number'
                      className='form-control'
                      style={{ width: "20%" }}
                      onChange={(e) => handleQuantity(e, data)}
                      step={1}
                      min={1}
                      value={obj !== undefined ? obj.qty : data.qty}
                      max={100}
                      defaultValue={1}
                    />
                    <button
                      type='button'
                      className='btn btn-sm customize py-1 px-2'
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data.sideCode, data)}
                    >
                      {payloadEdit !== undefined &&
                      payloadEdit.productType === "side" &&
                      obj !== undefined
                        ? "Edit"
                        : "Add To Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default SidesMenu;
