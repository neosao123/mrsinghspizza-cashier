import React, { useEffect, useState } from "react";
import { softDrinksApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducer/cartReducer";
import { v4 as uuidv4 } from "uuid";
import { addToCartAndResetQty } from "./drinksMenuFunctions/drinksMenuFunction";

function DrinksMenu({ discount, taxPer, setPayloadEdit, payloadEdit }) {
  const [softDrinksData, setSoftDrinksData] = useState();
  const [drinksArr, setDrinksArr] = useState([]);
  const [quantity, setQuantity] = useState(1);
  let cartdata = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    drinks();
  }, []);

  // handle Quantity
  const handleQuantity = (e, data) => {
    const inputValue = e.target.value;
    if (parseInt(inputValue) < 1) {
      e.target.value = 1;
    } else if (parseInt(inputValue) > 100) {
      e.target.value = 100;
    } else {
      setQuantity(inputValue);
    }
    let itemToUpdate = drinksArr?.findIndex(
      (item) => item.softdrinkCode === data.softdrinkCode
    );

    if (itemToUpdate !== -1) {
      let arr = [...drinksArr];
      arr[itemToUpdate] = {
        ...data,
        qty: inputValue < 0 ? 1 : inputValue,
      };
      setDrinksArr(arr);
    } else {
      setDrinksArr([
        ...drinksArr,
        {
          ...data,
          qty: inputValue < 0 ? 1 : inputValue,
        },
      ]);
    }
  };
  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "drinks") {
      setDrinksArr([
        ...drinksArr,
        {
          softdrinkCode: payloadEdit?.productCode,
          softDrinksName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
        },
      ]);
    }
  }, [payloadEdit]);

  // API - SoftDrinks
  const drinks = () => {
    softDrinksApi()
      .then((res) => {
        setSoftDrinksData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From SoftDrinksMenu API: ", err);
      });
  };

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, drink) => {
    e.preventDefault();
    const selectedDrinks = drinksArr?.filter(
      (drinks) => drinks.softdrinkCode === drink.softdrinkCode
    );
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedDrinks[0]?.price;
    let totalAmount = 0;
    totalAmount =
      Number(price) *
      (selectedDrinks[0]?.qty !== undefined
        ? Number(selectedDrinks[0]?.qty)
        : 1);

    if (drinksArr.length === 0) {
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: drink?.softdrinkCode,
        productName: drink?.softDrinksName,
        productType: "drinks",
        quantity: 1,
        config: {
          drinks: [
            {
              drinksCode: drink?.softdrinkCode,
              drinksName: drink?.softDrinksName,
              drinksPrice: drink?.price,
            },
          ],
        },
        price: drink?.price,
        amount: drink?.price,
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };

      addToCartAndResetQty(
        dispatch,
        addToCart,
        [...cartdata, payload],
        toast,
        setDrinksArr,
        setSoftDrinksData,
        softDrinksData,
        [drink],
        "Added Successfully"
      );
      return;
    }

    if (payloadEdit !== undefined && payloadEdit.productType === "drinks") {
      const payloadForEdit = {
        id: payloadEdit?.id,
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDrinks[0].softdrinkCode,
        productName: selectedDrinks[0].softDrinksName,
        productType: "drinks",
        config: {
          drinks: drinksArr,
        },
        quantity: selectedDrinks[0].qty ? selectedDrinks[0].qty : 1,
        price: selectedDrinks[0].price,
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
      toast.success(
        `${selectedDrinks[0].softDrinksName} ` + "Updated Successfully"
      );

      setPayloadEdit();
      let temp = softDrinksData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSoftDrinksData(temp);
      setDrinksArr([]);
    } else {
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDrinks[0]?.softdrinkCode,
        productName: selectedDrinks[0]?.softDrinksName,
        productType: "drinks",
        config: {
          drinks: drinksArr,
        },
        quantity: selectedDrinks[0]?.qty ? selectedDrinks[0]?.qty : 1,
        price: selectedDrinks[0]?.price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };
      addToCartAndResetQty(
        dispatch,
        addToCart,
        [...cartdata, payload],
        toast,
        setDrinksArr,
        setSoftDrinksData,
        softDrinksData,
        [drink],
        "Added Successfully"
      );
    }
  };

  return (
    <>
      <ul className='list-group'>
        {softDrinksData?.map((data) => {
          let obj = drinksArr?.find(
            (item) => item.softdrinkCode === data.softdrinkCode
          );
          return (
            <li className='list-group-item' key={data.softdrinkCode}>
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
                    <h6 className='mb-2'>{data.softDrinksName}</h6>
                    <h6 className='mb-2'>$ {data.price}</h6>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <input
                      type='number'
                      defaultValue={1}
                      min={0}
                      value={obj !== undefined ? obj.qty : data.qty}
                      className='form-control'
                      style={{ width: "20%" }}
                      onChange={(e) => {
                        handleQuantity(e, data);
                      }}
                    />
                    <button
                      type='button'
                      className='btn btn-sm customize py-1 px-2'
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data)}
                    >
                      {payloadEdit !== undefined &&
                      payloadEdit.productType === "drinks" &&
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

export default DrinksMenu;
