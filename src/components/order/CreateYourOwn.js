import React, { useEffect, useState } from "react";
import { addToCartApi } from "../../API/ongoingOrder";
import $ from "jquery";
import { Link } from "react-router-dom";
import { number } from "yup";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";
import EditCartProduct from "./EditCartProduct";
import {
  SelectDropDownCheese,
  SelectDropDownCrust,
  SelectDropDownSpecialBases,
} from "./createYourOwn/selectDropDown";
import {} from "./createYourOwn/selectDropDown";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../reducer/cartReducer";

function CreateYourOwn({
  allIngredients,
  sidesData,
  discount,
  taxPer,
  getCartList,
  isEdit,
  cartLineCode,
  cartCode,
  payloadEdit,
  setOrderData,
  setPayloadEdit,
  setCartListData,
  setAllIngredients,
}) {
  const [dips, setDips] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [pizzaSize, setPizzaSize] = useState("Large");
  const [comments, setComments] = useState("");
  const [countTwoToppingsArr, setCountTwoToppingsArr] = useState([]);
  const [countOneToppingsArr, setCountOneToppingsArr] = useState([]);
  const [freeToppingsArr, setFreeToppingsArr] = useState([]);
  const [sidesArr, setSideArr] = useState([]);
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [allCheckBoxes, setAllCheckBoxes] = useState([]);
  // react
  useEffect(() => {
    console.log(freeToppingsArr, "freeToppingsArr use");
  }, []);
  const [sizesOfPizza, setSizesOfPizza] = useState(["Large", "Extra Large"]);
  const [sizesOfPizzaSelected, setSizesOfPizzaSelected] = useState(
    sizesOfPizza[0]
  );
  const [crustSelected, setCrustSelected] = useState();
  const [cheeseSelected, setCheeseSelected] = useState();
  const [specialBasesSelected, setSpecialBasesSelected] = useState();
  const dispatch = useDispatch();
  //react

  // Calculate Price
  const calculatePrice = () => {
    let calculatePrice = 0;
    let crust_price = crustSelected?.price ? crustSelected?.price : 0;
    let cheese_price = cheeseSelected?.price ? cheeseSelected?.price : 0;
    let specialbase_price = specialBasesSelected?.price
      ? specialBasesSelected?.price
      : 0;
    let totalSidesPrice = Number(0);
    let totalTwoToppings = Number(0);
    let totalOneToppings = Number(0);
    let totalFreeToppings = Number(0);
    let totalDips = Number(0);
    let totalDrinks = Number(0);

    countTwoToppingsArr.map(
      (two) => (totalTwoToppings += Number(two.toppingsPrice))
    );
    console.log("countTwoToppingsArr : ", countTwoToppingsArr);
    console.log("totalTwoToppings :", totalTwoToppings);
    countOneToppingsArr.map(
      (one) => (totalOneToppings += Number(one.toppingsPrice))
    );
    freeToppingsArr.map((free) => (totalFreeToppings += 0));
    console.log("sidesArray inside calculated function :", sidesArr);
    sidesArr.map((side) => (totalSidesPrice += Number(side.sidesPrice)));
    dips.map((dips) => (totalDips += Number(dips.dipsPrice)));
    drinks.map((drinks) => (totalDrinks += Number(drinks.drinksPrice)));

    calculatePrice += Number(crust_price);
    calculatePrice += Number(cheese_price);
    calculatePrice += Number(specialbase_price);
    calculatePrice += totalSidesPrice;
    calculatePrice += totalTwoToppings;
    calculatePrice += totalOneToppings;
    calculatePrice += totalFreeToppings;
    calculatePrice += totalDips;
    calculatePrice += totalDrinks;

    console.log("calculatePrice after : ", calculatePrice);
    setPrice(calculatePrice.toFixed(2));
  };
  let cartdata = useSelector((state) => state.cart.cart);

  // Onclick Add To Cart Button
  const handleAddToCart = async (e) => {
    console.log(payloadEdit, "opps");
    e.preventDefault();
    // const lsCartCode = localStorage.getItem("cartCode");
    // const cashierCode = localStorage.getItem("cashierCode");

    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "custom_pizza"
    ) {
      const payloadForEdit = {
        productCode: "#NA",
        productName: "Custom Pizza",
        productType: "custom_pizza",
        config: {
          pizza: [
            {
              crust: crustSelected,
              cheese: cheeseSelected,
              specialBases: specialBasesSelected,
              toppings: {
                countAsTwoToppings: countTwoToppingsArr,
                countAsOneToppings: countOneToppingsArr,
                freeToppings: freeToppingsArr,
              },
            },
          ],
          sides: sidesArr,
          dips: dips,
          drinks: drinks,
        },
        quantity: "1",
        price: price,
        amount: price,
        comments: comments,
        pizzaSize: pizzaSize,
        discountAmount: discount,
        taxPer: taxPer,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      console.log();
      let tempPayload = [...cartdata];
      tempPayload[updatedCart] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      setPayloadEdit();
      setCrustSelected();
      setCheeseSelected();
      // setSpecialBasesSelected({});
      setSpecialBasesSelected();
      setDips([]);
      setDrinks([]);
      setSideArr([]);
      setCountTwoToppingsArr([]);
      setCountOneToppingsArr([]);
      setFreeToppingsArr([]);
      setPrice(0);

      uncheckAllCheckboxes();

      toast.success(`Custom Pizza edited Successfully...`);
    } else {
      if (
        crustSelected &&
        cheeseSelected &&
        specialBasesSelected !== undefined
      ) {
        console.log(crustSelected, "crustSelectedcrustSelected");
        const payload = {
          id: uuidv4(),
          productCode: "#NA",
          productName: "Custom Pizza",
          productType: "custom_pizza",
          config: {
            pizza: [
              {
                crust: crustSelected,
                cheese: cheeseSelected,
                specialBases: specialBasesSelected,
                toppings: {
                  countAsTwoToppings: countTwoToppingsArr,
                  countAsOneToppings: countOneToppingsArr,
                  freeToppings: freeToppingsArr,
                },
              },
            ],
            sides: sidesArr,
            dips: dips,
            drinks: drinks,
          },
          quantity: "1",
          price: price,
          amount: price,
          comments: comments,
          pizzaSize: pizzaSize,
          discountAmount: discount,
          taxPer: taxPer,
        };
        console.log(payload, "payload142");
        dispatch(addToCart([...cartdata, payload]));
        toast.success(`Custom Pizza Added Successfully...`);
        setCrustSelected();
        setCheeseSelected();
        // setSpecialBasesSelected({});
        setSpecialBasesSelected();
        setDips([]);
        setDrinks([]);
        setSideArr([]);
        setCountTwoToppingsArr([]);
        setCountOneToppingsArr([]);
        setFreeToppingsArr([]);
        setPrice(0);

        uncheckAllCheckboxes();
      } else {
        toast.error("Add something ..");
      }
    }

    // await addToCartApi(payload)
    //   .then((res) => {
    //     const resData = res.data.data;
    //     localStorage.setItem("CartData", JSON.stringify(res.data.data));
    //     localStorage.setItem("cartCode", resData.cartCode);
    //     //clear fields from create your own

    //     //reset all states
    //     setCrust({});
    //     setCheese({});
    //     setSpecialBases({});
    //     setDips([]);
    //     setDrinks([]);
    //     setSideArr([]);
    //     setCountTwoToppingsArr([]);
    //     setCountOneToppingsArr([]);
    //     setFreeToppingsArr([]);
    //     setPrice(0);

    //     uncheckAllCheckboxes();

    //     getCartList();
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 400 || err.response.status === 500) {
    //       toast.error(err.response.data.message);
    //     }
    //   });
    // console.log(payload, "payload 55");

    //reset all states
  };

  useEffect(() => {
    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "custom_pizza"
    ) {
      console.log(payloadEdit, "payloadEdit");
      setPrice(payloadEdit?.amount);
      setSizesOfPizzaSelected(payloadEdit?.pizzaSize);
      setCrustSelected(payloadEdit?.config?.pizza[0]?.crust);
      setCheeseSelected(payloadEdit?.config?.pizza[0]?.cheese);
      setSpecialBasesSelected(payloadEdit?.config?.pizza[0]?.specialBases);
      setCountTwoToppingsArr(
        payloadEdit?.config?.pizza[0]?.toppings?.countAsTwoToppings
      );
      setCountOneToppingsArr(
        payloadEdit?.config?.pizza[0]?.toppings?.countAsOneToppings
      );
      setFreeToppingsArr(payloadEdit?.config?.pizza[0]?.toppings?.freeToppings);
      setSideArr(payloadEdit?.config?.sides);
      setDips(payloadEdit?.config?.dips);
      setDrinks(payloadEdit?.config?.drinks);
    }
  }, [payloadEdit]);
  // handle Two Toppings
  const handleTwoToppings = (e, index, toppingCode) => {
    const { checked } = e.target;
    console.log(checked, "toppings");
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.countAsTwo.filter(
        (topping) => topping.toppingsCode === toppingCode
      );
      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].price
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setCountTwoToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
      console.log("countTwoToppingsArr", countTwoToppingsArr);
    } else {
      setCountTwoToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
    }

    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
  };
  // handle Two Toppings Placement
  const handleCountTwoPlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = countTwoToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    console.log("placement : ", countTwoToppingsArr);

    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
    console.log("placement : ", filteredToppings);
  };

  // handle One Toppings
  const handleOneToppings = (e, toppingCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.countAsOne.filter(
        (topping) => topping.toppingsCode === toppingCode
      );

      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].price
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setCountOneToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
      console.log(countOneToppingsArr, "count one toppings");
    } else {
      setCountOneToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
      console.log(countOneToppingsArr, "count one toppings");
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
  };
  // handle One Toppings Placement
  const handleCountOnePlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = countOneToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
  };

  // handle Free Toppings
  const handleFreeToppings = (e, toppingCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.freeToppings.filter(
        (topping) => topping.toppingsCode === toppingCode
      );

      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].toppingsCode
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setFreeToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
    } else {
      setFreeToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
  };
  // handle Free Toppings Placement
  const handleFreePlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = freeToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
  };

  // handle Sides
  const handleSides = (e, sideCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectSides = sidesData?.filter(
        (sides) => sides.sideCode === sideCode
      );
      let lineCode = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-key");
      let size = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-size");
      let price = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-price");
      const sidesObj = {
        sideCode: selectSides[0].sideCode,
        sidesName: selectSides[0].sideName,
        sidesType: selectSides[0].type,
        lineCode: lineCode,
        sidesPrice: price ? price : "0",
        sidesSize: size,
      };
      setSideArr((prevSides) => [...prevSides, sidesObj]);
      console.log("sidesArr checked : ", sidesArr);
    } else {
      setSideArr((prevSides) =>
        prevSides.filter((sidesObj) => sidesObj.sideCode !== sideCode)
      );
      console.log("sidesArr unchecked : ", sidesArr);
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === sideCode ? { ...checkbox, checked } : checkbox
      )
    );
  };
  // handle Sides Placement
  const handleSidePlacementChange = (e, sideCode) => {
    const lineCode = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-key");
    let size = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-size");
    let price = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-price");
    const filteredSides = sidesArr.filter(
      (sides) => sides.sideCode === sideCode
    );
    if (filteredSides.length > 0) {
      let filteredSide = filteredSides[0];
      filteredSide.lineCode = lineCode;
      filteredSide.sidesPrice = price;
      filteredSide.sidesSize = size;
    }
    setCount((prevCount) => prevCount + 1);
  };

  const handleDips = (e, code) => {
    const { checked } = e.target;

    if (checked) {
      const selectedDips = allIngredients?.dips.filter(
        (dips) => dips.dipsCode === code
      );
      console.log("selectedDips : ", selectedDips);
      if (selectedDips.length > 0) {
        let dipsObj = {
          dipsCode: selectedDips[0].dipsCode,
          dipsName: selectedDips[0].dipsName,
          dipsPrice: selectedDips[0].price ? selectedDips[0].price : "0",
        };
        setDips([...dips, dipsObj]);
      }
    } else {
      const newDips = dips.filter((newDips) => newDips.dipsCode !== code);
      setDips(newDips);
    }

    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === code ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // handle Drinks
  const handleDrinks = (e, code) => {
    const { checked } = e.target;
    const selectedDrinks = allIngredients?.softdrinks.filter(
      (drinks) => drinks.softdrinkCode === code
    );
    if (selectedDrinks.length > 0) {
      let drinksObj = {
        softdrinkCode: selectedDrinks[0].softdrinkCode,
        drinksName: selectedDrinks[0].softDrinksName,
        drinksPrice: selectedDrinks[0].price ? selectedDrinks[0].price : "0",
      };
      if (e.target.checked === true) {
        setDrinks([...drinks, drinksObj]);
      } else {
        const newDrinks = drinks.filter(
          (updatedDrinks) =>
            updatedDrinks.softdrinkCode !== drinksObj.softdrinkCode
        );
        setDrinks(newDrinks);
      }
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === code ? { ...checkbox, checked } : checkbox
      )
    );
  };

  const uncheckAllCheckboxes = () => {
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) => ({ ...checkbox, checked: false }))
    );
  };

  useEffect(() => {
    let ckbx = [];

    allIngredients?.toppings?.countAsTwo?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.toppings?.countAsOne?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.toppings?.freeToppings?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.dips?.map((d) => {
      ckbx.push({ id: d.dipsCode, checked: false });
    });

    sidesData?.map((d) => {
      ckbx.push({ id: d.sideCode, checked: false });
    });

    allIngredients?.softdrinks?.map((d) => {
      ckbx.push({ id: d.softdrinkCode, checked: false });
    });

    setAllCheckBoxes(ckbx);
  }, [allIngredients, sidesData]);

  useEffect(() => {
    calculatePrice();
  }, [
    sidesArr,
    countTwoToppingsArr,
    countOneToppingsArr,
    freeToppingsArr,
    dips,
    drinks,
    crustSelected,
    specialBasesSelected,
    cheeseSelected,
    sidesArr,
    count,
    sizesOfPizzaSelected,
    freeToppingsArr,
  ]);

  // --------------using react only

  const handleSizeOfPizza = (e) => {
    setSizesOfPizzaSelected(e.target.value);
  };

  const handleCrustChange = (event) => {
    const selectedValue = event.target.value;
    const selectedObject = allIngredients?.crust?.find(
      (option) => option.crustCode === selectedValue
    );
    console.log("selected Object ", selectedObject);
    setCrustSelected(selectedObject);
  };
  const handleCheeseChange = (event) => {
    const selectedValue = event.target.value;
    const selectedObject = allIngredients?.cheese?.find(
      (option) => option.cheeseCode === selectedValue
    );
    console.log("selected Object cheese", selectedObject);
    setCheeseSelected(selectedObject);
  };
  const handleSpecialBasesChange = (event) => {
    const selectedValue = event.target.value;
    const selectedObject = allIngredients?.specialbases?.find(
      (option) => option.specialbaseCode === selectedValue
    );
    console.log("selected Object special selected ", selectedObject);
    setSpecialBasesSelected(selectedObject);
  };
  // all indian toppings
  const handleChangeAllIndianToppins = (e) => {
    console.log(allIngredients?.toppings?.freeToppings, "allinf");
    console.log(allCheckBoxes, "allinf");
    if (e.target.checked) {
      const tempAllBoxes = [...allIngredients?.toppings?.freeToppings].map(
        (item) => {
          let placement = "whole";
          const placementValue = $("#placement-" + item.toppingCode).val();
          if (placementValue !== "" && placementValue !== undefined) {
            placement = placementValue;
          }
          return {
            toppingsPrice: item.price,
            toppingsName: item.toppingsName,
            toppingsCode: item.toppingsCode,
            toppingsPlacement: placement,
          };
        }
      );
      console.log(tempAllBoxes, "tempAllBoxes");
      setFreeToppingsArr(tempAllBoxes);
    } else {
      setFreeToppingsArr([]);
    }
  };

  useEffect(() => {
    console.log("key ", allIngredients?.specialbases[0]);
    setCrustSelected();
    setCheeseSelected();
    // setSpecialBasesSelected({});
    setSpecialBasesSelected();
  }, [allIngredients]);

  return (
    <>
      {isEdit === true ? (
        <>
          <EditCartProduct
            allIngredients={allIngredients}
            sidesData={sidesData}
            discount={discount}
            taxPer={taxPer}
            getCartList={getCartList}
            cartLineCode={cartLineCode}
            cartCode={cartCode}
          />
        </>
      ) : (
        <>
          <h6 className='text-center'>
            {payloadEdit !== undefined &&
            payloadEdit.productType === "custom_pizza"
              ? "Edit Pizza"
              : "Pizza Selection"}
          </h6>
          <div className='d-flex justify-content-between'>
            <div className='d-flex justify-content-center align-items-center'>
              <span>Size: </span>
              <select
                className='form-select mx-2'
                value={sizesOfPizzaSelected}
                onChange={handleSizeOfPizza}
              >
                {sizesOfPizza?.map((size, index) => {
                  return (
                    <option value={size} key={"sizesSelect" + index}>
                      {size}
                    </option>
                  );
                })}
              </select>
            </div>
            <h6 className=''>
              <span className='mx-2'>$ {price}</span>
            </h6>
          </div>
          <div className='row my-2'>
            {/* Crust, Cheese, SpecialBases */}
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Crust</label>

              <SelectDropDownCrust
                crustSelected={crustSelected}
                handleCrustChange={handleCrustChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Cheese</label>

              <SelectDropDownCheese
                cheeseSelected={cheeseSelected}
                handleCheeseChange={handleCheeseChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Special Bases</label>
              <SelectDropDownSpecialBases
                specialBasesSelected={specialBasesSelected}
                handleSpecialBasesChange={handleSpecialBasesChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4 d-flex align-items-center mt-2'>
              <input
                className='my-2 form-check-input'
                type='checkbox'
                value=''
                checked={freeToppingsArr?.length === 0 ? false : true}
                id='allIndianTps'
                onChange={handleChangeAllIndianToppins}
              />
              <label className='m-2' htmlFor='allIndianTps'>
                All Indians Toppings
              </label>
            </div>
            {/* Tabs */}
            <div className='mt-1 mb-3'>
              {/* Tabs Headings */}
              <ul className='nav nav-tabs mt-2' role='tablist'>
                <li className='nav-item'>
                  <Link
                    className='nav-link active py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-count-2-tab'
                  >
                    Toppings (2)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-count-1-tab'
                  >
                    Toppings (1)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-free-tab'
                  >
                    Indian Toppings (Free)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#sides'
                  >
                    Sides
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#dips'
                  >
                    Dips
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#drinks'
                  >
                    Drinks
                  </Link>
                </li>
              </ul>

              {/* Tab Content */}
              <div className='tab-content m-0 p-0 w-100'>
                {/* Count 2 Toppings */}
                <div
                  id='toppings-count-2-tab'
                  className='container tab-pane active m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.countAsTwo?.map(
                    (countAsTwoToppings, index) => {
                      const toppingCode = countAsTwoToppings.toppingsCode;
                      const comm = countTwoToppingsArr.findIndex(
                        (item) =>
                          item.toppingsCode === countAsTwoToppings.toppingsCode
                      );

                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={countAsTwoToppings.toppingsCode}
                          >
                            <label className=''>
                              <input
                                type='checkbox'
                                className='mx-3 d-inline-block'
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleTwoToppings(e, index, toppingCode)
                                }
                              />
                              {countAsTwoToppings.toppingsName}
                            </label>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ {countAsTwoToppings.price}
                              </p>
                              <select
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                id={"placement-" + toppingCode}
                                value={
                                  countTwoToppingsArr[index]?.toppingsPlacement
                                }
                                onChange={(e) => {
                                  const selectedPlacement = e.target.value;
                                  const updatedTopping = {
                                    ...countTwoToppingsArr[index],
                                    toppingsPlacement: selectedPlacement,
                                  };
                                  const updatedArray = [...countTwoToppingsArr];
                                  updatedArray[index] = updatedTopping;
                                  setCountTwoToppingsArr(updatedArray);
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    countTwoToppingsArr.length === 0
                                      ? true
                                      : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                              </select>
                            </div>
                          </li>
                        </>
                      );
                    }
                  )}
                </div>
                {/* Count 1 Toppings */}
                <div
                  id='toppings-count-1-tab'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.countAsOne?.map(
                    (countAsOneToppings, index) => {
                      const toppingCode = countAsOneToppings.toppingsCode;
                      const comm = countOneToppingsArr.findIndex(
                        (item) =>
                          item.toppingsCode === countAsOneToppings.toppingsCode
                      );

                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={toppingCode}
                          >
                            <label className=''>
                              <input
                                type='checkbox'
                                className='mx-3 d-inline-block toppingsChk'
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleOneToppings(e, toppingCode)
                                }
                              />
                              {countAsOneToppings.toppingsName}
                            </label>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ {countAsOneToppings.price}
                              </p>
                              <select
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                id={"placement-" + toppingCode}
                                value={
                                  countOneToppingsArr[index]?.toppingsPlacement
                                }
                                onChange={(e) => {
                                  const selectedPlacement = e.target.value;
                                  const updatedTopping = {
                                    ...countOneToppingsArr[index],
                                    toppingsPlacement: selectedPlacement,
                                  };
                                  const updatedArray = [...countOneToppingsArr];
                                  updatedArray[index] = updatedTopping;
                                  setCountOneToppingsArr(updatedArray);
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    countOneToppingsArr.length === 0
                                      ? true
                                      : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                              </select>
                            </div>
                          </li>
                        </>
                      );
                    }
                  )}
                </div>
                {/* Free Toppings */}
                <div
                  id='toppings-free-tab'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.freeToppings?.map(
                    (freeToppings, index) => {
                      console.log(freeToppings, "freeToppings");
                      const toppingCode = freeToppings.toppingsCode;
                      const comm = freeToppingsArr.findIndex(
                        (item) =>
                          item.toppingsCode === freeToppings.toppingsCode
                      );

                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={toppingCode}
                          >
                            <label className='d-flex align-items-center'>
                              <input
                                type='checkbox'
                                className='mx-3 d-inline-block toppingsChk'
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleFreeToppings(e, toppingCode)
                                }
                              />
                              {freeToppings.toppingsName}
                            </label>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ 0
                              </p>
                              <select
                                data-topping-area={toppingCode}
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                value={
                                  freeToppingsArr[index]?.toppingsPlacement
                                }
                                id={"placement-" + toppingCode}
                                onChange={(e) => {
                                  const selectedPlacement = e.target.value;
                                  const updatedTopping = {
                                    ...freeToppingsArr[index],
                                    toppingsPlacement: selectedPlacement,
                                  };
                                  const updatedArray = [...freeToppingsArr];
                                  updatedArray[index] = updatedTopping;
                                  setFreeToppingsArr(updatedArray);
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    freeToppingsArr?.length === 0 ? true : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                              </select>
                            </div>
                          </li>
                        </>
                      );
                    }
                  )}
                </div>

                {/* Sides */}
                <div
                  id='sides'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {sidesData?.map((sidesData) => {
                    const sideCode = sidesData.sideCode;
                    console.log(sidesData, "sidesflag map");
                    console.log(sidesArr, "sidesflag arr");
                    const comm = sidesArr.findIndex(
                      (item) => item.sideCode === sidesData.sideCode
                    );
                    console.log(comm, "sidesflag");
                    return (
                      <>
                        <li
                          className='list-group-item d-flex justify-content-between align-items-center'
                          key={sidesData.sideCode}
                        >
                          <label className='d-flex align-items-center'>
                            <input
                              type='checkbox'
                              className='mx-3 d-inline-block sidesChk'
                              checked={comm !== -1 ? true : false}
                              onChange={(e) => {
                                handleSides(e, sideCode);
                              }}
                            />
                            {sidesData.sideName}
                          </label>
                          <div style={{ width: "12rem" }}>
                            <select
                              className='form-select w-100 d-inline-block'
                              id={"placement-" + sideCode}
                              onChange={(e) => {
                                handleSidePlacementChange(e, sideCode);
                              }}
                            >
                              {sidesData.combination.map((combination) => {
                                return (
                                  <option
                                    key={combination.lineCode}
                                    data-key={combination.lineCode}
                                    data-price={combination.price}
                                    data-size={combination.size}
                                    value={combination.lineCode}
                                  >
                                    {combination.size} - $ {combination.price}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </li>
                      </>
                    );
                  })}
                </div>

                {/* Dips */}
                <div
                  id='dips'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.dips?.map((dipsData) => {
                    const dipCode = dipsData.dipsCode;
                    const comm = dips.findIndex(
                      (item) => item.dipsCode === dipsData.dipsCode
                    );
                    return (
                      <li
                        className='list-group-item d-flex justify-content-between align-items-center'
                        key={dipCode}
                      >
                        <label className='d-flex align-items-center'>
                          <input
                            type='checkbox'
                            className='mx-3 d-inline-block dipsChk'
                            checked={comm !== -1 ? true : false}
                            onChange={(e) => {
                              handleDips(e, dipCode);
                            }}
                          />
                          {dipsData.dipsName}
                        </label>
                        <p className='mb-0 mx-2'>$ {dipsData.price}</p>
                      </li>
                    );
                  })}
                </div>

                {/* Drinks */}
                <div
                  id='drinks'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.softdrinks?.map((drinksData) => {
                    const softdrinkCode = drinksData.softdrinkCode;
                    console.log(drinksData, "drinks data");
                    console.log(drinks, "drinks arr");
                    const comm = drinks.findIndex(
                      (item) => item.softdrinkCode === drinksData.softdrinkCode
                    );
                    return (
                      <li
                        className='list-group-item d-flex justify-content-between align-items-center'
                        key={softdrinkCode}
                      >
                        <label className='d-flex align-items-center'>
                          <input
                            type='checkbox'
                            className='mx-3 d-inline-block drinksChk'
                            checked={comm !== -1 ? true : false}
                            onChange={(e) => handleDrinks(e, softdrinkCode)}
                          />
                          {drinksData.softDrinksName}
                        </label>
                        <p className='mb-0 mx-2'>$ {drinksData.price}</p>
                      </li>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Comments */}
            <h6 className='text-left mt-1'>Comments</h6>
            <div className=''>
              <textarea
                className='form-control'
                rows='2'
                cols='50'
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          {/* Add to Cart Button */}
          <div className='d-flex flex-row justify-content-center align-items-center addToCartDiv position-sticky bottom-0 mb-3 '>
            <button
              type='button'
              className='btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn'
              onClick={handleAddToCart}
            >
              {payloadEdit !== undefined &&
              payloadEdit.productType === "custom_pizza"
                ? "Edit order"
                : "Add to Cart"}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default CreateYourOwn;
