export const addToCartAndResetQty = (
  dispatch,
  addToCart,
  arr,
  toast,
  setDrinksArr,
  setSoftDrinksData,
  softDrinksData,
  selectedDrink,
  msg
) => {
  dispatch(addToCart([...arr]));
  toast.success(`${selectedDrink[0]?.softDrinksName} ` + msg);

  let temp = softDrinksData.map((item) => {
    return {
      ...item,
      qty: 1,
    };
  });
  console.log(temp, "temp");
  setSoftDrinksData(temp);
  setDrinksArr([]);
};
