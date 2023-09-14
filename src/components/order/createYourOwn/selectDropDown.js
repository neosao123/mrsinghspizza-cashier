import React, { useEffect } from "react";

export const SelectDropDownCrust = ({
  crustSelected,
  handleCrustChange,
  allIngredients,
}) => {
  useEffect(() => {}, [crustSelected]);
  return (
    <>
      <select
        className='form-select'
        id='crust'
        defaultValue={""}
        value={crustSelected?.crustCode}
        onChange={handleCrustChange}
        required
      >
        <option value={""}>--- choose any one ---</option>
        {allIngredients?.crust?.map((crustData, index) => {
          return (
            <option
              selected={crustData.crustName === "Regular"}
              key={"crustDropDown" + index}
              value={crustData?.crustCode}
            >
              {crustData.crustName} - $ {crustData.price}
            </option>
          );
        })}
      </select>
    </>
  );
};

export const SelectDropDownCheese = ({
  cheeseSelected,
  handleCheeseChange,
  allIngredients,
}) => {
  return (
    <select
      className='form-select'
      id='crust'
      defaultValue={""}
      value={cheeseSelected?.cheeseCode}
      onChange={handleCheeseChange}
      required
    >
      <option value={""}>--- choose any one ---</option>

      {allIngredients?.cheese?.map((item, index) => {
        return (
          <option
            selected={item.cheeseName === "Mozzarella"}
            key={"crustDropDown" + index}
            value={item?.cheeseCode}
          >
            {item.cheeseName} - $ {item.price}
          </option>
        );
      })}
    </select>
  );
};

export const SelectDropDownSpecialBases = ({
  allIngredients,
  handleSpecialBasesChange,
  specialBasesSelected,
}) => {
  return (
    <select
      className='form-select'
      id='specialbase'
      onChange={handleSpecialBasesChange}
      defaultValue={""}
      value={specialBasesSelected?.specialbaseCode}
      required
    >
      <option value={""} selected={specialBasesSelected ? false : true}>
        --- choose any one ---
      </option>

      {allIngredients?.specialbases?.map((specialbasesData) => {
        return (
          <>
            <option
              key={specialbasesData.specialbaseCode}
              data-price={specialbasesData.price}
              value={specialbasesData?.specialbaseCode}
            >
              {specialbasesData.specialbaseName} - ${specialbasesData.price}
            </option>
          </>
        );
      })}
    </select>
  );
};
