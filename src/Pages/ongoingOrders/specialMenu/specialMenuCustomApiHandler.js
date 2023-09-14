export const getSpecialDetails = (
  data,
  getSpecialDetailsApi,
  setGetSpecialData,
  setPizzaSize,
  calculatePrice
) => {
  getSpecialDetailsApi(data)
    .then((res) => {
      setGetSpecialData(res.data.data);
      setPizzaSize(
        Number(res.data.data?.largePizzaPrice) > 0
          ? "Large"
          : Number(res.data.data?.extraLargePizzaPrice) > 0
          ? "Extra Large"
          : ""
      );
    })
    .catch((err) => {
      console.log("ERROR From Dips API: ", err);
    });
};

export const getSpecialDataCall = () => {};
