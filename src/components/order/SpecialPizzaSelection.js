import React from "react";
import { Link } from "react-router-dom";

function SpecialPizzaSelection({
  getSpecialData,
  count,
  toppingsData,
  handleCrustChange,
  pizzaState,
  handleCheeseChange,
  handleOneToppings,
  handleSpecialBasesChange,
  handleFreeToppingsPlacementChange,
  handleFreeToppings,
  handleTwoToppings,
  handleCountAsTwoToppingsPlacementChange,
  handleCountAsOneToppingsPlacementChange,
  handleChangeAllIndianToppings,
}) {
  return (
    <>
      <div className="jumbotron">
        <h6 className="text-center">Pizza {count}</h6>
        <div className="row my-2">
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Crust</label>
            <select
              className="form-select"
              value={pizzaState[count - 1]?.crust?.crustCode}
              onChange={(e) => {
                handleCrustChange(e, count);
              }}
            >
              {getSpecialData?.crust?.map((data) => {
                return (
                  <>
                    <option key={data?.code} value={data?.code}>
                      {data?.crustName}- $ {data?.price}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Cheese</label>
            <select
              className="form-select"
              value={pizzaState[count - 1]?.cheese?.cheeseCode}
              onChange={(e) => {
                handleCheeseChange(e, count);
              }}
            >
              {getSpecialData?.cheese?.map((data) => {
                return (
                  <>
                    <option key={data?.code} value={data?.code}>
                      {data.cheeseName}- $ {data.price}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Special Bases</label>
            <select
              className="form-select"
              defaultValue={""}
              value={pizzaState[count - 1]?.specialBases?.specialbaseCode}
              onChange={(e) => {
                handleSpecialBasesChange(e, count);
              }}
            >
              <option value={""}>---choose special base---</option>
              {getSpecialData?.specialbases?.map((data) => {
                return (
                  <>
                    <option key={data.code} value={data.code}>
                      {data.specialbaseName} - $ {data.price}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="col-sm-12 mt-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                checked={
                  pizzaState[count - 1]?.toppings?.freeToppings?.length ===
                  toppingsData?.toppings?.freeToppings?.length
                    ? true
                    : false
                }
                id={`allIndianTps-${count}`}
                onChange={(e) => {
                  handleChangeAllIndianToppings(e, count);
                }}
              />
              <label class="form-check-label" for={`allIndianTps-${count}`}>
                All Indian Style
              </label>
            </div>
          </div>
          {/*  */}
          <div className="mb-3">
            {/* Tabs Headings */}
            <ul className="nav nav-tabs mt-2" role="tablist">
              <li className="nav-item">
                {/* concatenated_string = f"to='#toppings-count-{i}-tab-special'" */}
                <Link
                  className="nav-link active py-2 px-4"
                  data-bs-toggle="tab"
                  to={`#toppings-count-2-tab-special${count}`}
                >
                  Toppings (2)
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link py-2 px-4"
                  data-bs-toggle="tab"
                  to={`#toppings-count-1-tab-special${count}`}
                  // to='#toppings-count-1-tab-special'
                >
                  Toppings (1)
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link py-2 px-4"
                  data-bs-toggle="tab"
                  to={`#toppings-free-tab-special${count}`}
                  // to='#toppings-free-tab-special'
                >
                  Indian Style (Free)
                </Link>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content m-0 p-0 w-100">
              {/* Count 2 Toppings */}
              <div
                id={`toppings-count-2-tab-special${count}`}
                className="container tab-pane active m-0 p-0 topping-list"
              >
                {toppingsData?.toppings?.countAsTwo?.map(
                  (countAsTwoToppings, index) => {
                    const comm = pizzaState[
                      count - 1
                    ]?.toppings?.countAsTwoToppings?.findIndex(
                      (item) =>
                        item.toppingsCode === countAsTwoToppings.toppingsCode
                    );
                    return (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={countAsTwoToppings.toppingsCode}
                      >
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id={`${countAsTwoToppings.toppingsCode}-${index}`}
                            checked={comm !== -1 ? true : false}
                            onChange={(e) =>
                              handleTwoToppings(e, count, countAsTwoToppings)
                            }
                          />
                          <label
                            class="form-check-label"
                            for={`${countAsTwoToppings.toppingsCode}-${index}`}
                          >
                            {countAsTwoToppings.toppingsName}
                          </label>
                        </div>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ width: "12rem" }}
                        >
                          <p
                            className="mx-2 mb-0 text-end"
                            style={{ width: "35%" }}
                          >
                            $ {countAsTwoToppings.price}
                          </p>
                          <select
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                            value={
                              pizzaState[count - 1]?.toppings
                                ?.countAsTwoToppings[comm]?.toppingsPlacement
                            }
                            id={`placement-${count - 1}-${
                              countAsTwoToppings.toppingsCode
                            }`}
                            onChange={(e) => {
                              handleCountAsTwoToppingsPlacementChange(
                                e,
                                count,
                                countAsTwoToppings.toppingsCode
                              );
                            }}
                          >
                            <option
                              value="whole"
                              selected={
                                pizzaState[count - 1]?.toppings
                                  ?.countAsTwoToppings?.length === 0
                                  ? true
                                  : false
                              }
                            >
                              Whole
                            </option>
                            <option value="lefthalf">Left Half</option>
                            <option value="righthalf">Right Half</option>
                            <option value="1/4">1/4</option>
                          </select>
                        </div>
                      </li>
                    );
                  }
                )}
              </div>
              {/* Count 1 Toppings */}
              <div
                id={`toppings-count-1-tab-special${count}`}
                className="container tab-pane m-0 p-0 topping-list"
              >
                {toppingsData?.toppings?.countAsOne?.map(
                  (countAsOneToppings, index) => {
                    const comm = pizzaState[
                      count - 1
                    ]?.toppings?.countAsOneToppings?.findIndex(
                      (item) =>
                        item.toppingsCode === countAsOneToppings.toppingsCode
                    );
                    return (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={countAsOneToppings.toppingsCode}
                      >
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id={`${countAsOneToppings.toppingsCode}-${index}`}
                            checked={comm !== -1 ? true : false}
                            onChange={(e) =>
                              handleOneToppings(e, count, countAsOneToppings)
                            }
                          />
                          <label
                            class="form-check-label"
                            for={`${countAsOneToppings.toppingsCode}-${index}`}
                          >
                            {countAsOneToppings.toppingsName}
                          </label>
                        </div>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ width: "12rem" }}
                        >
                          <p
                            className="mx-2 mb-0 text-end"
                            style={{ width: "35%" }}
                          >
                            $ {countAsOneToppings.price}
                          </p>
                          <select
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                            value={
                              pizzaState[count - 1]?.toppings
                                ?.countAsOneToppings[comm]?.toppingsPlacement
                            }
                            id={`placement-${count - 1}-${
                              countAsOneToppings.toppingsCode
                            }`}
                            onChange={(e) => {
                              handleCountAsOneToppingsPlacementChange(
                                e,
                                count,
                                countAsOneToppings.toppingsCode
                              );
                            }}
                          >
                            <option
                              value="whole"
                              selected={
                                pizzaState[count - 1]?.toppings
                                  ?.countAsOneToppings?.length === 0
                                  ? true
                                  : false
                              }
                            >
                              Whole
                            </option>
                            <option value="lefthalf">Left Half</option>
                            <option value="righthalf">Right Half</option>
                            <option value="1/4">1/4</option>
                          </select>
                        </div>
                      </li>
                    );
                  }
                )}
              </div>
              {/* Free Toppings */}
              <div
                id={`toppings-free-tab-special${count}`}
                className="container tab-pane m-0 p-0 topping-list"
              >
                {toppingsData?.toppings?.freeToppings?.map(
                  (freeToppings, index) => {
                    const comm = pizzaState[
                      count - 1
                    ]?.toppings?.freeToppings?.findIndex(
                      (item) => item.toppingsCode === freeToppings.toppingsCode
                    );
                    return (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={freeToppings.toppingsCode}
                      >
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id={`${freeToppings.toppingsCode}-${index}`}
                            checked={comm !== -1 ? true : false}
                            onChange={(e) =>
                              handleFreeToppings(e, count, freeToppings)
                            }
                          />
                          <label
                            class="form-check-label"
                            for={`${freeToppings.toppingsCode}-${index}`}
                          >
                            {freeToppings.toppingsName}
                          </label>
                        </div>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ width: "12rem" }}
                        >
                          <p
                            className="mx-2 mb-0 text-end"
                            style={{ width: "35%" }}
                          >
                            $ {freeToppings?.price}
                          </p>

                          <select
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                            value={
                              pizzaState[count - 1]?.toppings?.freeToppings[
                                index
                              ]?.toppingsPlacement
                            }
                            id={`placement-${count - 1}-${
                              freeToppings.toppingsCode
                            }`}
                            onChange={(e) => {
                              handleFreeToppingsPlacementChange(
                                e,
                                count,
                                freeToppings.toppingsCode
                              );
                            }}
                          >
                            <option
                              value="whole"
                              selected={
                                pizzaState[count - 1]?.toppings?.freeToppings
                                  ?.length === 0
                                  ? true
                                  : false
                              }
                            >
                              Whole
                            </option>
                            <option value="lefthalf">Left Half</option>
                            <option value="righthalf">Right Half</option>
                            <option value="1/4">1/4</option>
                          </select>
                        </div>
                      </li>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecialPizzaSelection;
