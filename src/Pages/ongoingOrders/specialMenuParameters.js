export const specialMenuParamsFn = (
  handlePops,
  e,
  pop,
  setDrinksArr,
  drinksArr
) => {
  return {
    handlePops: {
      callback: handlePops,
      parameters: {
        e: e,
        pop: pop,
        setDrinksArr: setDrinksArr,
        drinksArr: drinksArr,
      },
    },
  };
};
