export const removeCountAsOneItemOnUncheck = (
  pizzaState,
  count,
  setPizzaState,
  countAsOneToppings
) => {
  let arr = [...pizzaState];
  const index = arr[count - 1].toppings?.countAsOneToppings.findIndex(
    (item) => item.toppingsCode == countAsOneToppings.toppingsCode
  );
  if (index !== -1) {
    let updatedArr = arr[count - 1]?.toppings?.countAsOneToppings.filter(
      (item) => item.toppingsCode !== countAsOneToppings.toppingsCode
    );
    arr[count - 1] = {
      ...arr[count - 1],
      toppings: {
        ...arr[count - 1].toppings,
        countAsOneToppings: updatedArr,
      },
    };
  }
  setPizzaState(arr);
};

export const removeCountAsTwoItemOnUncheck = (
  pizzaState,
  count,
  countAsTwoToppings,
  setPizzaState,
  setTotalPriceOfToppings
) => {
  let arr = [...pizzaState];

  const index = arr[count - 1]?.toppings?.countAsTwoToppings.findIndex(
    (item) => item.toppingsCode === countAsTwoToppings.toppingsCode
  );

  if (index !== -1 && arr[count - 1]?.toppings?.countAsTwoToppings) {
    setTotalPriceOfToppings((prev) => prev - Number(countAsTwoToppings.price));
    let updatedArr = arr[count - 1]?.toppings?.countAsTwoToppings.filter(
      (item) => item.toppingsCode !== countAsTwoToppings.toppingsCode
    );
    console.log(updatedArr, "updatedArr");
    arr[count - 1] = {
      ...arr[count - 1],
      toppings: {
        ...arr[count - 1].toppings,
        countAsTwoToppings: updatedArr,
      },
    };
  }
  setPizzaState(arr);
};
