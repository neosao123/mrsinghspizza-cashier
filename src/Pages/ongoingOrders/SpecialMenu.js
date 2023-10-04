import React, { useEffect, useState } from "react";
import { BiChevronLeftCircle } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import "../../css/specialMenu.css";
import SpecialPizzaSelection from "../../components/order/SpecialPizzaSelection";
import {
  dipsApi,
  getSpecialDetailsApi,
  specialPizzaApi,
  toppingsApi,
} from "../../API/ongoingOrder";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDisplaySpecialForm } from "../../reducer/cartReducer";
import { toast } from "react-toastify";
import { getSpecialDetails } from "./specialMenu/specialMenuCustomApiHandler";
import { handlePops } from "./specialMenuFunctions";
import { specialMenuParamsFn } from "./specialMenuParameters";
import $ from "jquery";

function SpecialMenu({ setPayloadEdit, payloadEdit, specialTabRef }) {
  sessionStorage.setItem("welcome", "Test");

  const [pizzaState, setPizzaState] = useState();
  const [show, setShow] = useState(false);
  const displaySpecialForm = useSelector(
    (state) => state.cart.displaySpecialForm
  );
  const [getSpecialData, setGetSpecialData] = useState();
  const [pizzaSize, setPizzaSize] = useState();
  // For Data
  const [selectedLineEntries, setSelectedLineEntries] = useState();
  const [specialData, setSpecialData] = useState();
  const [crustSelected, setCrustSelected] = useState();
  const [cheeseSelected, setCheeseSelected] = useState();
  const [specialBasesSelected, setSpecialBasesSelected] = useState();
  const [toppingsData, setToppingsData] = useState();
  const [dipsData, setDipsData] = useState();
  const [dipsArr, setDipsArr] = useState([]);
  const [offeredFreeToppings, setOfferedFreeToppings] = useState(0);
  const [sidesArr, setSidesArr] = useState([]);
  const [drinksArr, setDrinksArr] = useState([]);
  const [popsArr, setPopsArr] = useState([]);
  const [comments, setComments] = useState("");
  const [price, setPrice] = useState(0);
  const [additionalToppingsCount, setAdditionalToppingsCount] = useState(0);
  const [noOfFreeDips, setNoOfFreeDips] = useState(0);
  const [noofFreeDrinks, setNoofFreeDrinks] = useState(0);
  const [freeSides, setFreeSides] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [totalPriceOfToppings, setTotalPriceOfToppings] = useState(0);
  const [totalPriceOfDips, setTotalPriceOfDips] = useState(0);
  const [isAllIndiansTps, setIsAllIndiansTps] = useState(false);

  let calcOneTpsArr = [];
  let calcTwoTpsArr = [];
  let calcDipsArr = [];
  let calcToppingsArr = [];
  // let ides = [];
  let noOfFreeToppings = Number(getSpecialData?.noofToppings);
  let noOfAdditionalTps = Number(0);
  const dispatch = useDispatch();
  let cartdata = useSelector((state) => state.cart.cart);

  // handle crust change
  const handleCrustChange = (event, count) => {
    const selectedValue = event.target.value;
    const selectedCrust = getSpecialData?.crust?.find(
      (option) => option.code === selectedValue
    );
    let crustObject = {
      crustCode: selectedCrust?.code,
      crustName: selectedCrust?.crustName,
      price: selectedCrust?.price,
    };
    let arr = [...pizzaState];
    arr[count - 1] = {
      ...arr[count - 1],
      crust: crustObject,
    };
    setPizzaState(arr);
  };

  // handle cheese change
  const handleCheeseChange = (event, i) => {
    const selectedValue = event.target.value;
    const selectedCheese = getSpecialData?.cheese?.find(
      (option) => option.code === selectedValue
    );
    let cheeseObject = {
      cheeseCode: selectedCheese?.code,
      cheeseName: selectedCheese?.cheeseName,
      price: selectedCheese?.price,
    };
    setPizzaState((prevPizzaState) => {
      const newArr = [...prevPizzaState];
      newArr[i - 1] = {
        ...newArr[i - 1],
        cheese: cheeseObject,
      };
      return newArr;
    });
  };

  // handle special base change
  const handleSpecialBasesChange = (event, i) => {
    // debugger;
    const selectedValue = event.target.value;
    const selectedSpecialBase = getSpecialData?.specialbases?.find(
      (option) => option.code === selectedValue
    );
    let specialBaseObject = {
      specialbaseCode: selectedSpecialBase?.code,
      specialbaseName: selectedSpecialBase?.specialbaseName,
      price: selectedSpecialBase?.price,
    };
    let arr = [...pizzaState];
    arr[i - 1] = {
      ...arr[i - 1],
      specialBases: specialBaseObject,
    };
    setPizzaState(arr);
  };

  const handleChangeAllIndianToppings = (e, count) => {
    if (e.target.checked) {
      const allFreeToppings = [...toppingsData?.toppings?.freeToppings].map(
        (item) => {
          let toppingsPlacement = "whole";

          return {
            toppingsCode: item?.toppingsCode,
            toppingsName: item?.toppingsName,
            toppingsPrice: Number(item?.price),
            toppingsPlacement: toppingsPlacement,
          };
        }
      );
      let arr = [...pizzaState];
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1].toppings,
          freeToppings: allFreeToppings,
          isAllIndiansTps: true,
        },
      };

      setPizzaState(arr);
      setIsAllIndiansTps(true);
    } else {
      let arr = [...pizzaState];
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1].toppings,
          freeToppings: [],
        },
      };
      setPizzaState(arr);
      setIsAllIndiansTps(false);
    }
  };

  const handleTwoToppings = (e, count, countAsTwoToppings) => {
    const { checked } = e.target;
    delete countAsTwoToppings.image;
    delete countAsTwoToppings?.isPaid;
    delete countAsTwoToppings?.countAs;

    //console.log(" Count 2 Special Pizza Topping ", countAsTwoToppings);

    let placement = "whole";


    if (checked) {
      let arr = [...pizzaState];
      let ct = count - 1;
      let placement = "whole";
      const placementValue = $("#placement-" + ct + "-" + countAsTwoToppings?.toppingsCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      console.log("Checked 2 Topping Placement ", placement);
      const tempCountAsTwo = [
        ...(arr[count - 1].toppings?.countAsTwoToppings || []),
        {
          toppingsCode: countAsTwoToppings?.toppingsCode,
          toppingsName: countAsTwoToppings?.toppingsName,
          toppingsPrice: Number(countAsTwoToppings?.price),
          toppingsPlacement: placement,
          pizzaIndex: count - 1,
          amount: Number(0.0).toFixed(2),
        },
      ];
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1].toppings,
          countAsTwoToppings: tempCountAsTwo,
        },
      };
      setAllToppings([...allToppings, Number(countAsTwoToppings.countAs)]);
      setPizzaState(arr);
    } else {
      let arr = [...pizzaState];

      let selectedObject = arr[count - 1]?.toppings?.countAsTwoToppings?.find(
        (option) => option.toppingsCode === countAsTwoToppings?.toppingsCode
      );

      console.log(" Count 2 Special Pizza Topping Placement ", selectedObject);

      const index = arr[count - 1]?.toppings?.countAsTwoToppings.findIndex(
        (item) => item.toppingsCode === countAsTwoToppings.toppingsCode
      );
      let updatedAll = allToppings.filter(
        (item) => item.toppingsCode !== countAsTwoToppings.toppingsCode
      );
      setAllToppings(updatedAll);
      if (index !== -1 && arr[count - 1]?.toppings?.countAsTwoToppings) {
        let updatedArr = arr[count - 1]?.toppings?.countAsTwoToppings.filter(
          (item) => item.toppingsCode !== countAsTwoToppings.toppingsCode
        );
        arr[count - 1] = {
          ...arr[count - 1],
          toppings: {
            ...arr[count - 1].toppings,
            countAsTwoToppings: [...updatedArr],
          },
        };
      }
      setPizzaState([...arr]);
    }
  };

  const handleCountAsTwoToppingsPlacementChange = (
    event,
    count,
    toppingsCode
  ) => {
    const selectedValue = event.target.value;
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.countAsTwoToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.countAsTwoToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );

    if (indexOfSelectedObject !== -1) {
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          countAsTwoToppings: [
            ...arr[count - 1]?.toppings?.countAsTwoToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.countAsTwoToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    setPizzaState(arr);
  };

  const handleOneToppings = (e, count, countAsOneToppings) => {
    const { checked } = e.target;
    delete countAsOneToppings.image;
    delete countAsOneToppings?.isPaid;
    delete countAsOneToppings?.countAs;

    console.log(" Count 1 Special Pizza Topping ", countAsOneToppings);
    if (checked) {
      let ct = count - 1;
      let placement = "whole";
      const placementValue = $("#placement-" + ct + "-" + countAsOneToppings?.toppingsCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      console.log("Checked 1 Topping Placement ", placement);

      setPizzaState((prevState) => {
        const newState = [...prevState];
        const pizzaIndex = count - 1;
        newState[pizzaIndex] = {
          ...newState[pizzaIndex],
          toppings: {
            ...newState[pizzaIndex].toppings,
            countAsOneToppings: [
              ...(newState[pizzaIndex].toppings.countAsOneToppings || []),
              {
                toppingsCode: countAsOneToppings?.toppingsCode,
                toppingsName: countAsOneToppings?.toppingsName,
                toppingsPrice: Number(countAsOneToppings?.price),
                toppingsPlacement: placement,
                pizzaIndex: count - 1,
                amount: Number(0.0).toFixed(2),
              },
            ],
          },
        };

        setAllToppings([...allToppings, Number(countAsOneToppings.countAs)]);

        return newState;
      });
    } else {
      setPizzaState((prevState) => {
        const newState = [...prevState];
        const pizzaIndex = count - 1;

        const index = newState[
          pizzaIndex
        ]?.toppings?.countAsOneToppings.findIndex(
          (item) => item.toppingsCode === countAsOneToppings.toppingsCode
        );

        if (index !== -1) {
          const updatedArr = newState[
            pizzaIndex
          ]?.toppings?.countAsOneToppings.filter(
            (item) => item.toppingsCode !== countAsOneToppings.toppingsCode
          );

          newState[pizzaIndex] = {
            ...newState[pizzaIndex],
            toppings: {
              ...newState[pizzaIndex].toppings,
              countAsOneToppings: [...updatedArr],
            },
          };

          setAllToppings((prevAllToppings) =>
            prevAllToppings.filter(
              (item) => item !== Number(countAsOneToppings.countAs)
            )
          );
        }

        return newState;
      });
    }
  };

  const handleFreeToppingsPlacementChange = (event, count, toppingsCode) => {
    const selectedValue = event.target.value;
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.freeToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.freeToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );
    if (indexOfSelectedObject !== -1) {
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          freeToppings: [
            ...arr[count - 1]?.toppings?.freeToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.freeToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    setPizzaState(arr);
  };

  const handleCountAsOneToppingsPlacementChange = (
    event,
    count,
    toppingsCode
  ) => {
    const selectedValue = event.target.value;
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.countAsOneToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.countAsOneToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );
    if (indexOfSelectedObject !== -1) {
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          countAsOneToppings: [
            ...arr[count - 1]?.toppings?.countAsOneToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.countAsOneToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    setPizzaState(arr);
  };

  const handleFreeToppings = (e, count, freeToppings) => {
    const { checked } = e.target;
    delete freeToppings.image;

    console.log(" Free Special Pizza Topping ", freeToppings);
    setPizzaState((prevState) => {
      const newState = [...prevState];
      const pizzaIndex = count - 1;

      if (checked) {

        let ct = count - 1;
        let placement = "whole";
        const placementValue = $("#placement-" + ct + "-" + freeToppings?.toppingsCode).val();
        if (placementValue !== "" && placementValue !== undefined) {
          placement = placementValue;
        }
        console.log("Checked 1 Topping Placement ", placement);

        newState[pizzaIndex] = {
          ...newState[pizzaIndex],
          toppings: {
            ...newState[pizzaIndex].toppings,
            freeToppings: [
              ...(newState[pizzaIndex].toppings.freeToppings || []),
              {
                toppingsCode: freeToppings?.toppingsCode,
                toppingsName: freeToppings?.toppingsName,
                toppingsPrice: Number(freeToppings?.price),
                toppingsPlacement: placement,
              },
            ],
          },
        };
      } else {
        const index = newState[pizzaIndex]?.toppings?.freeToppings?.findIndex(
          (item) => item.toppingsCode === freeToppings.toppingsCode
        );
        if (index !== -1) {
          const updatedArr = newState[
            pizzaIndex
          ]?.toppings?.freeToppings?.filter(
            (item) => item.toppingsCode !== freeToppings.toppingsCode
          );
          newState[pizzaIndex] = {
            ...newState[pizzaIndex],
            toppings: {
              ...newState[pizzaIndex].toppings,
              freeToppings: [...updatedArr],
            },
          };
        }
      }
      return newState;
    });
  };

  useEffect(() => {
    if (
      payloadEdit !== undefined &&
      payloadEdit?.productType === "special_pizza"
    ) {
      console.log(payloadEdit, "edit item on click");
      handleGetSpecial({ code: payloadEdit?.productCode });
      setPizzaState(payloadEdit?.config?.pizza);
      setDrinksArr(payloadEdit?.config?.drinks);
      setDipsArr(payloadEdit?.config?.dips);
      setSidesArr(payloadEdit?.config?.sides);
      setPrice(Number(payloadEdit?.amount));
      setComments(payloadEdit?.comments);
      setPizzaSize(payloadEdit?.pizzaSize);
    }
  }, [payloadEdit]);

  useEffect(() => {
    specialIngredients();
    dispatch(setDisplaySpecialForm(false));
  }, []);

  //Component - Special Pizza Selection
  const elements = [];
  const createEmptyObjects = (count) => {
    const emptyObjectsArray = Array.from({ length: count }, () => ({
      crust: {
        crustCode: getSpecialData?.crust[0].code,
        crustName: getSpecialData?.crust[0].crustName,
        price: getSpecialData?.crust[0].price ?? 0,
      },
      cheese: {
        cheeseCode: getSpecialData?.cheese[0].code,
        cheeseName: getSpecialData?.cheese[0].cheeseName,
        price: getSpecialData?.cheese[0].price ?? 0,
      },
      specialBases: {},
      toppings: {
        countAsTwoToppings: [],
        countAsOneToppings: [],
        freeToppings: [],
        isAllIndiansTps: false,
      },
    }));
    setPizzaState(emptyObjectsArray);
  };

  const handleSides = (e, sides) => {
    let { checked } = e.target;
    delete sides.image;
    if (checked) {
      let obj = {
        sideCode: sides?.code,
        sideName: sides?.sideName,
        sideType: sides?.type,
        lineCode: sides?.lineEntries[0]?.code,
        sidePrice: sides?.lineEntries[0]?.price
          ? sides?.lineEntries[0]?.price
          : 0,
        sideSize: sides?.lineEntries[0]?.size,
        quantity: 1,
        totalPrice: Number(0).toFixed(2),
      };
      setSidesArr([obj]);
    } else {
      let filteredSides = sidesArr?.filter(
        (item) => item.sideCode !== sides.code
      );
      setSidesArr(filteredSides);
    }
  };

  const handleSidelineEntries = (e, sides) => {
    let ind = sidesArr?.findIndex((item) => item.code === sides.code);
    if (ind !== -1) {
      let selectedEntry = sides?.lineEntries?.filter(
        (item) => item.code === e.target.value
      );
      let updatedSide = {
        ...sides,
        lineEntries: selectedEntry,
      };
      let temp = [...sidesArr];
      temp[ind] = updatedSide;
      setSidesArr(temp);
    }
  };

  const handleDips = (e, dips) => {
    let { checked } = e.target;
    delete dips.image;
    if (checked) {
      let obj = {
        dipsCode: dips?.dipsCode,
        dipsName: dips?.dipsName,
        dipsPrice: dips?.price,
        quantity: Number(getSpecialData?.noofDips),
        totalPrice: Number(0.0).toFixed(2),
      };
      //console.log("SPECIAL PIZZA DIPS ********************************", obj);
      setDipsArr([obj]);
    } else {
      let filteredDips = dipsArr?.filter(
        (item) => item.dipsCode !== dips.dipsCode
      );
      let tempDips = dipsArr?.filter((item) => item.dipsCode === dips.dipsCode);
      setDipsArr(filteredDips);
    }
  };

  const handleDipsCount = (e, dips) => {
    let ind = dipsArr?.findIndex((item) => item.dipsCode === dips.dipsCode);
    let tempDips = dipsArr?.find((item) => item.dipsCode === dips.dipsCode);
    if (ind !== -1) {
      let updatedDips = {
        ...dips,
        quantity:
          e.target.value > Number(getSpecialData?.noofDips)
            ? e.target.value
            : Number(getSpecialData?.noofDips),
      };
      let temp = [...dipsArr];
      temp[ind] = updatedDips;
      setDipsArr(temp);
    }
  };

  const handleDrinks = (e, drink) => {
    let { checked } = e.target;
    let drinksObj = {
      drinksCode: drink.code,
      drinksName: drink.softDrinkName,
      //drinksPrice: drink.price ? drink.price : 0,
      drinksPrice: Number(0).toFixed(2),
      quantity: 1,
      totalPrice: Number(0).toFixed(2),
    };
    if (checked) {
      setDrinksArr([drinksObj]);
    } else {
      let filteredDrinks = drinksArr?.filter(
        (item) => item.drinksCode !== drink.code
      );
      setDrinksArr(filteredDrinks);
    }
  };

  for (let i = 1; i <= getSpecialData?.noofPizzas; i++) {
    elements.push(
      <SpecialPizzaSelection
        pizzaState={pizzaState}
        handleFreeToppings={handleFreeToppings}
        handleOneToppings={handleOneToppings}
        handleTwoToppings={handleTwoToppings}
        getSpecialData={getSpecialData}
        count={i}
        toppingsData={toppingsData}
        handleChangeAllIndianToppings={handleChangeAllIndianToppings}
        handleCrustChange={handleCrustChange}
        crustSelected={crustSelected}
        cheeseSelected={cheeseSelected}
        setOfferedFreeToppings={setOfferedFreeToppings}
        offeredFreeToppings={offeredFreeToppings}
        additionalToppingsCount={additionalToppingsCount}
        setAdditionalToppingsCount={setAdditionalToppingsCount}
        specialBasesSelected={specialBasesSelected}
        setCheeseSelected={setCheeseSelected}
        handleSpecialBasesChange={handleSpecialBasesChange}
        handleCheeseChange={handleCheeseChange}
        handleCountAsTwoToppingsPlacementChange={
          handleCountAsTwoToppingsPlacementChange
        }
        handleCountAsOneToppingsPlacementChange={
          handleCountAsOneToppingsPlacementChange
        }
        handleFreeToppingsPlacementChange={handleFreeToppingsPlacementChange}
      />
    );
  }

  // console.log(calcTwoTpsArr, "calcTwoTpsArr")

  const handleAddToCart = () => {
    if (
      payloadEdit !== undefined &&
      payloadEdit?.productType.toLowerCase() === "special_pizza"
    ) {
      //code: getSpecialData.code,

      let arr = [...pizzaState];

      pizzaState?.map((item, index) => {
        if (
          toppingsData?.toppings?.freeToppings.length ===
          item?.toppings?.freeToppings.length
        ) {
          if (arr[index]) {
            arr[index] = {
              ...arr[index],
              toppings: {
                ...arr[index].toppings,
                isAllIndiansTps: true,
              },
            };
          }
        } else {
          if (arr[index]) {
            arr[index] = {
              ...arr[index],
              toppings: {
                ...arr[index].toppings,
                isAllIndiansTps: false,
              },
            };
          }
        }
      });
      //setPizzaState(arr);

      let payloadForEdit = {
        id: payloadEdit?.id,
        productCode: getSpecialData.code,
        productName: getSpecialData?.name,
        productType: "special_pizza",
        config: {
          pizza: arr,
          sides: sidesArr,
          dips: dipsArr,
          // drinks: [drinksArr, popsArr],
          drinks: drinksArr,
        },
        quantity: "1",
        price: "0",
        amount: price,
        comments: comments,
        pizzaSize: pizzaSize === "Large" ? "Large" : "Extra Large",
        pizzaPrice:
          pizzaSize === "Large"
            ? getSpecialData?.largePizzaPrice
            : getSpecialData?.extraLargePizzaPrice,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      let tempPayload = [...cartdata];
      tempPayload[updatedCart] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      setSidesArr([]);
      setDrinksArr([]);
      setDipsArr([]);
      setPopsArr([]);
      setComments("");
      setPayloadEdit();
      setPizzaSize(
        getSpecialData?.largePizzaPrice > 0 ? "Large" : "Extra Large"
      );
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
      toast.success(
        `${payloadForEdit.productName} updated to cart successfully...`
      );
    } else {
      //update pizza array
      if (calcTwoTpsArr?.length > 0) {
        let arr = [...pizzaState];
        calcTwoTpsArr?.map((tpsObj) => {
          arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [];
        });
        calcTwoTpsArr?.map((tpsObj) => {
          arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [
            ...arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings,
            tpsObj,
          ];
        });
      }
      if (calcOneTpsArr?.length > 0) {
        let arr = [...pizzaState];
        calcOneTpsArr?.map((tpsObj) => {
          arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [];
        });
        calcOneTpsArr?.map((tpsObj) => {
          arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [
            ...arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings,
            tpsObj,
          ];
        });
      }

      let arr = [...pizzaState];
      pizzaState?.map((item, index) => {
        if (
          toppingsData?.toppings?.freeToppings?.length ===
          item?.toppings?.freeToppings?.length
        ) {
          if (arr[index]) {
            arr[index].toppings.isAllIndiansTps = true; // Replace 'true' with the desired value
          }
        } else {
          if (arr[index]) {
            arr[index].toppings.isAllIndiansTps = false; // Replace 'true' with the desired value
          }
        }
      });
      setPizzaState(arr);

      // code: getSpecialData.code,
      let payload = {
        id: uuidv4(),
        productCode: getSpecialData.code,
        productType: "special_pizza",
        productName: getSpecialData?.name,
        config: {
          pizza: pizzaState,
          sides: sidesArr,
          dips: dipsArr,
          // drinks: [...drinksArr, ...popsArr],
          drinks: drinksArr, // Changes
        },
        quantity: "1",
        price: "0",
        amount: price,
        comments: comments,
        pizzaSize: pizzaSize === "Large" ? "Large" : "Extra Large",
        pizzaPrice:
          pizzaSize === "Large"
            ? getSpecialData?.largePizzaPrice
            : getSpecialData?.extraLargePizzaPrice,
      };
      dispatch(addToCart([...cartdata, payload]));
      setSidesArr([]);
      setDrinksArr([]);
      setDipsArr([]);
      setPopsArr([]);
      setComments("");
      setPizzaSize(
        getSpecialData?.largePizzaPrice > 0 ? "Large" : "Extra Large"
      );
      setAdditionalToppingsCount(0);
      setOfferedFreeToppings(Number(getSpecialData?.noofToppings));
      setPrice(Number(getSpecialData?.price));
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
      toast.success(` ${payload.productName} added to cart successfully...`);
    }
  };

  // Customize Details
  const handleGetSpecial = (code) => {
    getSpecialDetails(
      { code: code },
      getSpecialDetailsApi,
      setGetSpecialData,
      pizzaSize,
      setPizzaSize
    );
    toppings();
    dips();
    // setShow(true);
    dispatch(setDisplaySpecialForm(true));
  };

  //API - Special Pizza
  const specialIngredients = () => {
    specialPizzaApi()
      .then((res) => {
        setSpecialData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Special Pizza API: ", err);
      });
  };
  //API - Get Special Details

  //API - Toppings Data
  const toppings = () => {
    toppingsApi()
      .then((res) => {
        setToppingsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Toppings API: ", err);
      });
  };

  //API - Dips Data
  const dips = () => {
    dipsApi()
      .then((res) => {
        setDipsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Dips API: ", err);
      });
  };

  // Calculate Price
  const calculatePrice = () => {
    let totalPrice = Number(0);
    let totalOneTpsPrice = Number(0);
    let totalTwoTpsPrice = Number(0);
    totalPrice +=
      pizzaSize === "Large"
        ? Number(getSpecialData?.largePizzaPrice)
        : pizzaSize === "Extra Large"
          ? Number(getSpecialData?.extraLargePizzaPrice)
          : 0;

    let pizzaCartons = [];
    for (let i = 0; i < getSpecialData?.noofPizzas; i++) {
      pizzaCartons.push(i);
    }

    // Iterate through pizzaState
    pizzaState?.forEach((item) => {
      totalPrice += item?.cheese?.price ? Number(item?.cheese?.price) : 0;

      totalPrice += item?.crust?.price ? Number(item?.crust?.price) : 0;

      totalPrice += item?.specialBases?.price
        ? Number(item?.specialBases?.price)
        : 0;

      pizzaCartons.map((pizzaCarton) => {
        if (item?.toppings?.countAsOneToppings?.length > 0) {
          item?.toppings?.countAsOneToppings?.map((items) => {
            if (items.pizzaIndex === pizzaCarton) {
              if (noOfFreeToppings > 0) {
                let tpsObj = {
                  ...items,
                  amount: 0,
                };
                calcOneTpsArr.push(tpsObj);
                noOfFreeToppings--;
                setOfferedFreeToppings((prev) => prev - 1);
              } else {
                calcOneTpsArr.push({
                  ...items,
                  amount: Number(items?.toppingsPrice).toFixed(2),
                });
                noOfAdditionalTps++;
                setAdditionalToppingsCount((prev) => prev + 1);
              }
            }
          });
        }
        if (item?.toppings?.countAsTwoToppings?.length > 0) {
          item?.toppings?.countAsTwoToppings?.map((items) => {
            if (items.pizzaIndex === pizzaCarton) {
              if (noOfFreeToppings > 1) {
                let tpsObj = {
                  ...items,
                  amount: 0,
                };
                calcTwoTpsArr.push(tpsObj);
                setOfferedFreeToppings((prev) => prev - 2);
                noOfFreeToppings -= Number(2);
              } else if (noOfFreeToppings === 1) {
                // let tpsObj = {
                //   ...items,
                //   amount: Number(items?.price).toFixed(2) / 2,
                // };
                calcTwoTpsArr.push({
                  ...items,
                  amount: Number(items?.toppingsPrice).toFixed(2),
                });
                setOfferedFreeToppings((prev) => prev - 1);
                noOfFreeToppings -= Number(1);
                noOfAdditionalTps++;
                setAdditionalToppingsCount((prev) => prev + 1);
              } else {
                calcTwoTpsArr.push({
                  ...items,
                  amount: Number(items?.toppingsPrice).toFixed(2),
                });
                noOfAdditionalTps += Number(2);
                setAdditionalToppingsCount((prev) => prev + 2);
              }
            }
          });
        }
      });
    });

    calcOneTpsArr?.map((tps) => {
      totalOneTpsPrice += Number(tps?.amount);
    });

    calcTwoTpsArr?.map((tps) => {
      totalTwoTpsPrice += Number(tps?.amount);
    });

    totalPrice += totalOneTpsPrice;
    totalPrice += totalTwoTpsPrice;

    // Iterate through dipsArr
    // let totalQtyDips = 0;

    // dipsArr?.forEach((item) => {
    //   totalQtyDips += Number(item?.qty);
    // });

    // if (totalQtyDips >= noOfFreeDips) {
    //   let paidDips = Number(totalQtyDips) - noOfFreeDips;
    //   let priceOfOneDips = dipsArr[0]?.price ? Number(dipsArr[0]?.price) : null;
    //   let paidPrice = paidDips * priceOfOneDips;
    //   totalPrice += paidPrice;
    // }

    // sidesArr?.forEach((item) => { 
    //   let ind = freeSides?.findIndex(
    //     (side) => side.lineEntries[0].code === item?.lineCode
    //   );
    //   // if (ind === -1) {
    //   //   totalPrice += Number(item?.lineEntries[0]?.price)
    //   //     ? Number(item?.lineEntries[0]?.price)
    //   //     : null;
    //   // } 
    //   if (ind === -1) {
    //     totalPrice += Number(item?.totalPrice)
    //       ? Number(item?.totalPrice)
    //       : Number(0);
    //   }
    // });

    // drinksArr?.forEach((drinks, index) => {
    //   if (noofFreeDrinks < index + 1) {
    //     totalPrice += drinks?.drinksPrice ? Number(drinks?.drinksPrice) : 0;
    //   }
    // });

    const formattedPrice = (
      Number(totalPrice) +
      Number(totalPriceOfToppings) +
      Number(totalPriceOfDips)
    ).toFixed(2);
    setPrice(formattedPrice);
  };

  let specialMenuParamsObj = specialMenuParamsFn(
    handlePops,
    {},
    {},
    setDrinksArr,
    drinksArr
  );

  useEffect(() => {
    console.log(calcDipsArr, "calcDipsArr");
  }, []);

  useEffect(() => {
    // calculateDipsPrice();
    setOfferedFreeToppings(noOfFreeToppings);
    setAdditionalToppingsCount(noOfAdditionalTps);
    calculatePrice();
  }, [
    pizzaState,
    sidesArr,
    dipsArr,
    selectedLineEntries,
    pizzaSize,
    drinksArr,
    popsArr,
    calcOneTpsArr,
    calcTwoTpsArr,
    noOfFreeToppings,
  ]);

  useEffect(() => {
    if (getSpecialData) {
      calculatePrice();
      if (pizzaSize === undefined) {
        setPizzaSize(
          Number(getSpecialData?.largePizzaPrice) > 0
            ? "Large"
            : Number(getSpecialData?.extraLargePizzaPrice) > 0
              ? "Extra Large"
              : ""
        );
      }
    }
  }, [getSpecialData]);

  useEffect(() => {
    if (getSpecialData?.noofToppings !== undefined) {
      setOfferedFreeToppings(Number(getSpecialData?.noofToppings));
      setAdditionalToppingsCount(0);
    }
    if (getSpecialData?.noofDips !== undefined) {
      setNoOfFreeDips(Number(getSpecialData?.noofDips));
    }
    if (getSpecialData?.noofDrinks !== undefined) {
      setNoofFreeDrinks(Number(getSpecialData?.noofDrinks));
    }
    if (payloadEdit === undefined) {
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
    }
    if (getSpecialData?.freesides?.length > 0) {
      setFreeSides(getSpecialData?.freesides);
    }
  }, [getSpecialData]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        <div className="w-100">
          {displaySpecialForm ? (
            <>
              {/* Back Button */}
              <button
                type="button"
                className="btn btn-secondary btn-xs mb-1"
                onClick={() => {
                  if (
                    payloadEdit !== undefined &&
                    payloadEdit?.productType === "special_pizza"
                  ) {
                    toast.warn(
                      "You cannot go back until you confirm or edit the selected pizza"
                    );
                    return;
                  } else {
                    setPayloadEdit();
                    setShow(false);
                    setPizzaState([]);
                    dispatch(setDisplaySpecialForm(false));
                  }
                }}
              >
                <BiChevronLeftCircle /> Back
              </button>
              <div className="customizablePizza px-3">
                <div className="d-flex justify-content-between">
                  <h6>
                    {getSpecialData?.name}
                    {getSpecialData?.subtitle !== null && (
                      <span
                        style={{
                          color: "#b1130be4",
                        }}
                        className="ms-1"
                      >
                        ({getSpecialData?.subtitle})
                      </span>
                    )}
                  </h6>
                  <h6 className="mx-2">$ {price}</h6>
                </div>
                <div className="mb-1">
                  <p className="mb-1">
                    Toppings :{" "}
                    <span className="mx-2">
                      {offeredFreeToppings <= 0 ? 0 : offeredFreeToppings} /{" "}
                      {getSpecialData?.noofToppings}
                    </span>
                  </p>

                  <p className="mb-1">
                    Additional Toppings Used :
                    <span className="mx-2">
                      {offeredFreeToppings <= 0 ? additionalToppingsCount : 0}{" "}
                    </span>
                  </p>
                  <p className="mb-1 d-inline">Size : </p>
                  <select
                    className="form-select mx-2 my-2 w-25 d-inline"
                    value={pizzaSize}
                    onChange={(e) => setPizzaSize(e.target.value)}
                  >
                    {Number(getSpecialData?.largePizzaPrice) > 0 && (
                      <option value="Large">Large</option>
                    )}
                    {Number(getSpecialData?.extraLargePizzaPrice) > 0 && (
                      <option value="Extra Large">Extra Large</option>
                    )}
                  </select>
                </div>

                {elements}

                {/* Sides */}
                {getSpecialData?.freesides.length === 0 ? null : (
                  <>
                    <h6 className="text-left mt-1 mb-2">Sides</h6>
                    <div id="sides" className="mb-3">
                      <ul className="list-group">
                        {getSpecialData?.freesides?.map((sidesData) => {
                          const comm = sidesArr.findIndex(
                            (item) => item.sideCode === sidesData.code
                          );
                          return (
                            <>
                              <li
                                className="list-group-item d-flex justify-content-between align-items-center"
                                key={sidesData.code + "sidesData"}
                              >
                                <label className="d-flex align-items-center">
                                  <input
                                    type="radio"
                                    name="sides"
                                    className="mx-3 d-inline-block"
                                    checked={comm !== -1 ? true : false}
                                    onChange={(e) => handleSides(e, sidesData)}
                                  />
                                  {sidesData.sideName}
                                  <span
                                    className={
                                      "badge-" + sidesData.type + " mx-1"
                                    }
                                  >
                                    ( {sidesData.type} )
                                  </span>
                                </label>
                                <div style={{ width: "12rem" }}>
                                  <select
                                    value={
                                      comm !== -1
                                        ? sidesArr[comm]?.lineCode
                                        : ""
                                    }
                                    className="form-select w-100 d-inline-block"
                                    onChange={(e) => {
                                      handleSidelineEntries(e, sidesData);
                                    }}
                                  >
                                    {sidesData?.lineEntries?.map(
                                      (lineEntriesData) => {
                                        return (
                                          <option
                                            key={lineEntriesData.code}
                                            defaultValue={lineEntriesData.code}
                                            value={lineEntriesData.code}
                                          >
                                            <span>
                                              {lineEntriesData.size} -{" "}
                                            </span>
                                            <span className="mb-0 mx-2">
                                              $ {lineEntriesData.price}
                                            </span>
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Dips */}
                {getSpecialData?.noofDips === "0" ? (
                  ""
                ) : (
                  <>
                    <h6 className="text-left mt-1 mb-2">Dips</h6>
                    <div id="dips" className="mb-3">
                      <ul className="list-group">
                        {dipsData?.map((data, index) => {
                          const comm = dipsArr?.findIndex(
                            (item) => item.dipsCode === data.dipsCode
                          );

                          return (
                            <li className="list-group-item" key={data.dipsCode}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <label className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      name="dips"
                                      className="mx-3 d-inline-block"
                                      checked={comm !== -1 ? true : false}
                                      onChange={(e) => handleDips(e, data)}
                                    />
                                    {data.dipsName} - ${data.price}
                                  </label>
                                </div>

                                <input
                                  type="number"
                                  defaultValue={1}
                                  readOnly
                                  min={1}
                                  value={
                                    dipsArr[comm]?.qty
                                      ? dipsArr[comm]?.qty
                                      : getSpecialData?.noofDips !==
                                        undefined ||
                                        getSpecialData?.noofDips !== "0"
                                        ? Number(getSpecialData?.noofDips)
                                        : 1
                                  }
                                  className="form-control mx-2"
                                  style={{ width: "75px" }}
                                // onChange={(e) => handleDipsCount(e, data)}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Drinks */}
                {getSpecialData?.pops && getSpecialData?.bottle && (
                  <>
                    {(getSpecialData?.pops.length > 0 ||
                      getSpecialData.bottle.length > 0) && (
                        <h6 className="text-left mt-1 mb-2">Drinks</h6>
                      )}

                    <div id="drinks" className="mb-3">
                      <ul className="list-group">
                        {getSpecialData?.pops.map((pop) => {
                          const comm = drinksArr?.findIndex(
                            (item) => item.drinksCode === pop.code
                          );

                          return (
                            <li
                              className="list-group-item d-flex justify-content-between align-items-center"
                              key={pop.code}
                            >
                              <label className="d-flex align-items-center">
                                <input
                                  type="radio"
                                  name="drinks"
                                  className="mx-3 d-inline-block"
                                  checked={comm !== -1 ? true : false}
                                  onChange={(e) =>
                                    specialMenuParamsObj.handlePops.callback({
                                      ...specialMenuParamsObj.handlePops
                                        .parameters,
                                      e: e,
                                      pop: pop,
                                    })
                                  }
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className="mb-0 mx-2">$ {pop.price}</p>
                            </li>
                          );
                        })}
                        {getSpecialData?.bottle.map((pop) => {
                          const comm = drinksArr?.findIndex(
                            (item) => item.drinksCode === pop.code
                          );
                          return (
                            <li
                              className="list-group-item d-flex justify-content-between align-items-center"
                              key={pop.code}
                            >
                              <label className="d-flex align-items-center">
                                <input
                                  type="radio"
                                  name="drinks"
                                  className="mx-3 d-inline-block"
                                  checked={comm !== -1 ? true : false}
                                  onChange={(e) => handleDrinks(e, pop)}
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className="mb-0 mx-2">$ {pop.price}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Comments */}
                <h6 className="text-left mt-1 mb-2">Comments</h6>
                <div className="">
                  <textarea
                    className="form-control"
                    rows="4"
                    cols="50"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                {/* Add to Cart Button */}
                <div className="d-flex flex-row justify-content-center align-items-center addToCartDiv mt-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn"
                    onClick={handleAddToCart}
                  >
                    {payloadEdit !== undefined &&
                      payloadEdit?.productType.toLowerCase() === "special_pizza"
                      ? "Edit"
                      : " Add to Cart"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ul
              className="list-group"
              style={{ overflowY: "scroll", height: "30rem" }}
            >
              {specialData?.map((speicalPizza) => {
                return (
                  <li className="list-group-item" key={speicalPizza.code}>
                    <div className="d-flex align-items-start justify-content-between px-1">
                      <div className="d-flex align-align-items-start">
                        <div className="d-flex flex-column">
                          <h6 className="mb-1">
                            {speicalPizza.name}
                            {speicalPizza?.subtitle !== null && (
                              <span
                                style={{
                                  color: "#b1130be4",
                                }}
                                className="ms-1"
                              >
                                ({speicalPizza?.subtitle})
                              </span>
                            )}
                          </h6>
                          <span>{speicalPizza.noofToppings} Toppings</span>
                          <span>{speicalPizza.noofPizzas} Pizzas</span>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <h6>
                          <p className="m-0 mb-1 p-0 text-end">
                            Large{" "}
                            <span className="text-large-pizza-price">
                              ${Number(speicalPizza.largePizzaPrice)}
                            </span>
                          </p>
                          <p className="m-0 p-0">
                            Extra Large{" "}
                            <span className="text-xlarge-pizza-price">
                              ${Number(speicalPizza.extraLargePizzaPrice)}
                            </span>
                          </p>
                        </h6>
                        <button
                          type="button"
                          // ref={
                          //   speicalPizza.name === payloadEdit?.productName
                          //     ? specialTabRef
                          //     : null
                          // }
                          className="btn btn-sm customize py-1 px-2"
                          onClick={() => {
                            handleGetSpecial(speicalPizza?.code);
                            createEmptyObjects(
                              Number(getSpecialData?.noofPizzas)
                            );
                          }}
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default SpecialMenu;
