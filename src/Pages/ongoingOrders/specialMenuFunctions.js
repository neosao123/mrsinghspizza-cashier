export const handlePops = ({ e, pop, setDrinksArr, drinksArr }) => {
  let { checked } = e.target;
  let drinksObj = {
    drinksCode: pop.code,
    drinksName: pop.softDrinkName,
    drinksPrice: pop.price ? pop.price : "0",
  };
  if (checked) {
    setDrinksArr([drinksObj]);
  } else {
    let filteredPops = drinksArr?.filter(
      (item) => item.drinksCode !== pop.code
    );
    setDrinksArr(filteredPops);
  }
};
