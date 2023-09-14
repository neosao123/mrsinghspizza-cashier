export const addToCartAndResetQty = (
  dispatch,
  addToCart,
  arr,
  toast,
  setDipsArr,
  setDipsData,
  dipsData,
  selectedDips,
  msg
) => {
  dispatch(addToCart([...arr]));
  toast.success(`${selectedDips[0].dipsName} ` + msg);
  let temp = dipsData.map((item) => {
    return {
      ...item,
      qty: 1,
    };
  });
  setDipsData(temp);
  setDipsArr([]);
};
