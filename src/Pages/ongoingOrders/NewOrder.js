import React, { useEffect, useRef, useState } from "react";
import "../../css/ongoingOrder.css";
import Nav from "../../layout/Nav";
import SpecialMenu from "./SpecialMenu";

import CreateYourOwn from "../../components/order/CreateYourOwn";
import {
  getCartListApi,
  orderPlaceApi,
  storeLocationApi,
  deliveryExecutiveApi,
  settingsApi,
} from "../../API/ongoingOrder";
import SidesMenu from "./SidesMenu";
import DipsMenu from "./DipsMenu";
import DrinksMenu from "./DrinksMenu";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import {
  allIngredientsApi,
  isZipCodeDelivarable,
  prevOrderDetails,
  sidesApi,
} from "./newOrder/newOrderApi";
import {
  pizzaIngredients,
  sidesIngredient,
} from "./newOrder/newOrderCustomApiHandler";
import Cart from "./cart";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDisplaySpecialForm } from "../../reducer/cartReducer";
import { useDebounce } from "./newOrder/newOrderFunctions";
import NotDeliverableModel from "./newOrder/model";
import { orderDetails } from "../../API/order";
import Print from "../order/Print";
import ReactToPrint from "react-to-print";
import { BiTrash } from "react-icons/bi";

function NewOrder() {
  const [allIngredients, setAllIngredients] = useState();
  const [sidesData, setSidesData] = useState();
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [storesLocationData, setStoreLocationData] = useState();
  const [storesCode, setStoresCode] = useState();
  const [discount, setDiscount] = useState(0);
  const [taxPer, setTaxPer] = useState(0);
  const [cartListData, setCartListData] = useState();
  const [deliverExectiveList, setDeliverExectiveList] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [cartCode, setCartCode] = useState();
  const [cartLineCode, setCartLineCode] = useState();
  const [settingsData, setSettingsData] = useState();
  const [isOrderSubmittedSuccessfully, setIsOrderSubmittedSuccessfully] =
    useState(false);
  const [prevOrderLoading, setPrevOrderLoading] = useState(false);
  const [prevOrders, setPrevOrders] = useState([]);
  const [orderData, setOrderData] = useState();
  const [ispostalcodeAvailable, setIspostalcodeAvailable] = useState(true);
  const [extraDeliveryCharges, setExtraDeliveryCharges] = useState(0);
  const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;
  const createYourOwnRef = useRef(null);
  const specialTabRef = useRef(null);
  const dipsRef = useRef(null);
  const dispatch = useDispatch();
  const sidesRef = useRef(null);
  const drinksRef = useRef(null);
  const printRef2 = useRef();
  const btnRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = (productType) => {
    const prType = productType;
    switch (prType) {
      case "custom_pizza":
        createYourOwnRef.current.click();
        break;
      case "side":
        sidesRef.current.click();
        break;
      case "dips":
        dipsRef.current.click();
        break;
      case "drinks":
        drinksRef.current.click();
        break;
      case "special_pizza":
        specialTabRef.current.click();
        dispatch(setDisplaySpecialForm(true));
        break;
      default:
        break;
    }
  };
  let cartdata = useSelector((state) => state.cart.cart);
  let totalPrice = 0;
  cartdata.forEach((item) => {
    totalPrice += Number(item.amount);
  });

  const delivery_charges =
    cartdata.length !== 0 && deliveryType !== "pickup"
      ? settingsData?.filter(
        (item) => item.settingName === "Delivery Charges"
      )[0].settingValue
      : 0;

  const discountedTotalPrice = totalPrice - (discount ? discount : 0);
  const taxAmount = (discountedTotalPrice * taxPer) / 100;
  const grandTotal =
    discountedTotalPrice +
    taxAmount +
    Number(delivery_charges) +
    Number(extraDeliveryCharges);

  const initialValues = {
    phoneno: "",
    category: "pickup",
    customername: "",
    address: "",
    stores: "",
    postalcode: "",
    deliveryExecutive: "",
  };

  //API - Store Location
  const storeLocation = async () => {
    await storeLocationApi()
      .then((res) => {
        setStoreLocationData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Store Location API : ", err);
      });
  };
  //deliver executive
  useEffect(() => {
    if (storesLocationData !== undefined) {
      deliveryExecutive(storesLocationData[0]?.code);
    }
  }, [storesLocationData]);
  useEffect(() => {
    if (isOrderSubmittedSuccessfully) {
      btnRef.current.click();
      setIsOrderSubmittedSuccessfully(false);
    }
  }, [isOrderSubmittedSuccessfully]);

  const deliveryExecutive = async (payload) => {
    await deliveryExecutiveApi(payload).then((res) => {
      setDeliverExectiveList(res.data.data);
    });
  };

  // handle Stores Location --> Store Code
  const handleStores = (e) => {
    let storesCode = $("#storesID").find(":selected").attr("data-key");
    setStoresCode(storesCode);
  };

  //API - Get Cart List
  const getCartList = async () => {
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cashierCode = localStorage.getItem("cashierCode");
    if (cart !== null && cart !== undefined) {
      let cartCode = cart.cartCode;
      let payload = {
        cartCode: cartCode,
        cashierCode: cashierCode,
      };
      await getCartListApi(payload)
        .then((res) => {
          setCartListData(res.data.data);
        })
        .catch((err) => {
          console.log("Error From Get Cart List API: ", err);
        });
    }
  };
  const settings = async () => {
    await settingsApi()
      .then((res) => setSettingsData(res.data.data))
      .catch((err) => {
        console.log("Error From Settings API: ", err);
      });
  };
  const canadianPostalCode = Yup.string().test(
    "is-canadian-postal-code",
    "Invalid Canadian Postal Code",
    (value) => {
      if (!value) return true;
      const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
      return postalCodeRegex.test(value);
    }
  );

  const validateSchema = Yup.object({
    phoneno: Yup.string()
      .required("Phone number is required")
      .matches(
        canadianPhoneNumberRegExp,
        "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
      ),
    customername:
      deliveryType === "pickup"
        ? null
        : Yup.string()
          .required("Customer Name is Required.")
          .matches(
            /^[A-Za-z\s]+$/,
            "Customer Name must contain only letters and spaces"
          ),
    address:
      deliveryType === "pickup"
        ? null
        : Yup.string().required("Address is Required"),
    postalcode:
      deliveryType === "pickup"
        ? null
        : canadianPostalCode.required("Postal Code is Required"),

    stores: Yup.string().required("Store Location is Required."),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validateOnBlur: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let cart = JSON.parse(localStorage.getItem("CartData"));
        let cashierCode = localStorage.getItem("cashierCode");

        // Call the order placing API here
        const payload = {
          cashierCode: cashierCode,
          customerName: values.customername,
          mobileNumber: values.phoneno,
          address: values.address,
          zipCode: values.postalcode,
          deliveryType: deliveryType,
          storeLocation: values.stores,
          deliveryExecutive: values.deliveryExecutive,
          products: cartdata,
          subTotal: totalPrice,
          discountAmount: discount,
          taxPer: taxPer,
          taxAmount: ((discountedTotalPrice * taxPer) / 100).toFixed(2),
          deliveryCharges:
            cartdata.length !== 0 && deliveryType !== "pickup"
              ? settingsData?.filter(
                (item) => item.settingName === "Delivery Charges"
              )[0].settingValue
              : 0,
          extraDeliveryCharges: extraDeliveryCharges ? extraDeliveryCharges : 0,
          grandTotal: grandTotal,
        };
        const response = await orderPlaceApi(payload);
        if (response.status === 200) {
          resetForm();
          dispatch(addToCart([]));
          setDiscount(0);
          setPrevOrders([]);
          setExtraDeliveryCharges(0);
          orderDetails({ orderCode: response.data.orderCode }).then((data) => {
            setOrderDetail(data.data.data);
            setIsOrderSubmittedSuccessfully(true);
          });
          toast.success(response.data.message);
        } else {
          toast.error("Failed to place the order");
        }
      } catch (error) {
        if (cartdata?.length === 0 || cartdata == undefined) {
          toast.error("Add something to cart");
        } else {
          toast.error("Error placing the order:" + error);
        }
      }
    },
  });
  const debouncedInputValue = useDebounce(formik.values.postalcode, 2000);
  const debouncedInputValueForphoneNumber = useDebounce(
    formik.values.phoneno,
    2000
  );
  const fetchpostalcodeIsDeliverable = async (postalcode) => {
    setIsLoading(true);
    await isZipCodeDelivarable(postalcode)
      .then((res) => {
        setIspostalcodeAvailable(res.data.deliverable);
        res.data.deliverable ? setIsOpen(false) : setIsOpen(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };
  const fetchPrevOrder = async (phoneno) => {
    setPrevOrderLoading(true);
    await prevOrderDetails(phoneno)
      .then((res) => {
        setPrevOrders(res.data.data);
        console.log(res.data.data, "res.data.data");
        setPrevOrderLoading(false);
      })
      .catch((err) => {
        setPrevOrderLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    if (formik.values.postalcode.length > 0) {
      fetchpostalcodeIsDeliverable(formik.values.postalcode);
    }
  }, [debouncedInputValue]);
  useEffect(() => {
    if (formik.values.phoneno.length > 9) {
      fetchPrevOrder(formik.values.phoneno);
    }
  }, [debouncedInputValueForphoneNumber]);

  useEffect(() => {
    setTaxPer(
      settingsData?.filter((item) => item.settingName === "Tax Percentage")[0]
        .settingValue
    );
  }, [settingsData]);

  const handleRadiobtn = (e) => {
    setDeliveryType(e.target.value);
  };
  useEffect(() => {
    formik.resetForm();
  }, [deliveryType]);

  const [payloadEdit, setPayloadEdit] = useState();
  useEffect(() => {
    pizzaIngredients(allIngredientsApi, setAllIngredients);
    sidesIngredient(sidesApi, setSidesData);
    storeLocation();
    getCartList();
    settings();
  }, []);

  return (
    <>
      <Nav />
      <div className='container-fluid orderContainer'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row gx-4 orderContainer '>
            {/* Section 1 */}
            <div className='col-lg-2 sectionOne'>
              <label className='form-label mt-2 mb-1'>
                Phone <small className='text-danger'>*</small>{" "}
              </label>
              <IntlTelInput
                containerClassName='intl-tel-input mt-2 w-100'
                type='tel'
                name='phoneno'
                inputClassName='form-control'
                // type='number'
                placeholder='(XXX) XXX-XXXX'
                value={formik.values.phoneno.replace(/\D/g, "")}
                onBlur={formik.handleBlur}
                defaultCountry='CA'
                onlyCountries={["CA"]}
                preferredCountries={["CA"]}
                onPhoneNumberChange={(
                  status,
                  value,
                  countryData,
                  number,
                  id
                ) => {
                  if (value.length <= 10) {
                    formik.setFieldValue("phoneno", value);
                  }
                }}
              />
              {formik.touched.phoneno && formik.errors.phoneno ? (
                <div className='text-danger'>{formik.errors.phoneno}</div>
              ) : null}
              <div className='my-3 m-0 p-0 d-flex justify-content-between'>
                <label className='radio d-flex align-items-center my-1 w-50'>
                  <input
                    className='mx-2'
                    type='radio'
                    checked={deliveryType === "pickup" ? true : false}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleRadiobtn(e);
                    }}
                    name='category'
                    value='pickup'
                  />
                  Pickup
                </label>
                <label className='radio d-flex align-items-center my-1 mx-2 w-50'>
                  <input
                    className='mx-2'
                    type='radio'
                    name='category'
                    checked={deliveryType === "delivery" ? true : false}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleRadiobtn(e);
                    }}
                    value='delivery'
                  />
                  Delivery
                </label>
              </div>
              <label className='form-label'>
                Customer Name{" "}
                {deliveryType === "delivery" && (
                  <small className='text-danger'>*</small>
                )}
              </label>
              <input
                className='form-control'
                type='text'
                name='customername'
                id='customername'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customername}
              />
              {formik.touched.customername && formik.errors.customername ? (
                <div className='text-danger my-1'>
                  {formik.errors.customername}
                </div>
              ) : null}
              <label className='form-label mt-2 mb-1'>
                Address{" "}
                {deliveryType === "delivery" && (
                  <small className='text-danger'>*</small>
                )}
              </label>
              <textarea
                className='form-control'
                rows='4'
                cols='50'
                name='address'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className='text-danger my-1'>{formik.errors.address}</div>
              ) : null}
              {deliveryType === "pickup" ? null : (
                <>
                  <label className='form-label mt-2 mb-1'>
                    Postal Code{" "}
                    {deliveryType === "delivery" && (
                      <small className='text-danger'>*</small>
                    )}
                  </label>
                  <input
                    className='form-control'
                    name='postalcode'
                    id='postalcode'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.postalcode}
                  />
                  <div
                    className={
                      isLoading
                        ? "spinner-border spinner-border-sm d-flex mt-1"
                        : "d-none"
                    }
                    role='status'
                  >
                    {/* <span className='visually-hidden'>
                      Checking availability...
                    </span> */}
                  </div>
                  {formik.touched.postalcode && formik.errors.postalcode ? (
                    <div className='text-danger my-1'>
                      {formik.errors.postalcode}
                    </div>
                  ) : null}
                </>
              )}
              <NotDeliverableModel
                extraDeliveryCharges={extraDeliveryCharges}
                setExtraDeliveryCharges={setExtraDeliveryCharges}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
              <label className='form-label mt-2 mb-1'>
                Store Location <small className='text-danger'>*</small>
              </label>
              <select
                className='form-select'
                id='storesID'
                name='stores'
                defaultValue={formik.values.stores ?? "STR_1"}
                value={formik.values.stores ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value=''>Choose Stores Location</option>
                {storesLocationData?.map((stores) => {
                  return (
                    <option
                      key={stores.code}
                      data-key={stores.code}
                      value={stores.code}
                    >
                      {stores.storeLocation}
                    </option>
                  );
                })}
              </select>

              {formik.touched.stores && formik.errors.stores ? (
                <div className='text-danger my-1'>{formik.errors.stores}</div>
              ) : null}

              {/* delivery executive  */}
              {deliveryType === "delivery" && (
                <>
                  <label className='form-label mt-2 mb-1'>
                    Delivery Executive
                  </label>
                  <select
                    className='form-select'
                    id='storesID'
                    name='deliveryExecutive'
                    defaultValue={formik.values.deliveryExecutive ?? "STR_1"}
                    value={formik.values.deliveryExecutive ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value=''>Choose Delivery Executive</option>
                    {deliverExectiveList?.map((person) => {
                      return (
                        <option
                          key={person.code}
                          data-key={person.code}
                          value={person.code}
                        >
                          {person.firstName} {person.lastName}
                        </option>
                      );
                    })}
                  </select>

                  {formik.touched.deliveryExecutive &&
                    formik.errors.deliveryExecutive ? (
                    <div className='text-danger my-1'>
                      {formik.errors.deliveryExecutive}
                    </div>
                  ) : null}
                </>
              )}

              <h6 className='my-3'>Previous Order</h6>
              <div>
                <table className='table text-center border-none'>
                  <thead>
                    <tr>
                      <th scope='col'>Date</th>
                      <th scope='col'>Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prevOrderLoading ? (
                      <tr>
                        <td scope='col' colspan='2'>
                          <div
                            className={"spinner-border  mt-1"}
                            role='status'
                          />
                        </td>
                      </tr>
                    ) : prevOrders?.length > 0 ? (
                      prevOrders?.map((order) => {
                        return (
                          <tr
                            key={order?.code}
                            className='bg-white text-dark '
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              dispatch(addToCart(order?.orderItems));
                            }}
                          >
                            <td scope='col' className='px-0'>
                              {order?.created_at?.split(" ")[0]}
                            </td>
                            <td scope='col' className='px-0'>
                              {order?.code}
                            </td>
                          </tr>
                        );
                      })
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2 */}
            <div className='col-lg-6 my-1 sectionTwo'>
              {/* Tabs Headings */}
              <ul
                className='nav nav-tabs nav-fill psTabsUl mt-2 mb-3'
                role='tablist'
              >
                <li className='nav-item'>
                  <Link
                    ref={createYourOwnRef}
                    className='nav-link active py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#createByOwn'
                  >
                    Create Your Own
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={specialTabRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#special'
                  >
                    Special
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={sidesRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#sidesMenu'
                  >
                    Sides
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={dipsRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#dipsMenu'
                  >
                    Dips
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={drinksRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#drinksMenu'
                  >
                    Drinks
                  </Link>
                </li>
              </ul>
              {/* Tab Content */}
              <div className='tab-content m-0 p-0 w-100'>
                {/* Create Your Own */}
                <div
                  id='createByOwn'
                  className='container tab-pane active m-0 p-0 '
                >
                  <CreateYourOwn
                    allIngredients={allIngredients}
                    sidesData={sidesData}
                    discount={discount}
                    taxPer={taxPer}
                    getCartList={getCartList}
                    isEdit={isEdit}
                    cartListData={cartListData}
                    cartCode={cartCode}
                    cartLineCode={cartLineCode}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    setAllIngredients={setAllIngredients}
                    setOrderData={setOrderData}
                  />
                </div>

                {/* SpecialMenu */}
                <div id='special' className='container tab-pane m-0 p-0'>
                  <SpecialMenu
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    specialTabRef={specialTabRef}
                  />
                </div>

                {/* All SIdes */}
                <div id='sidesMenu' className='container tab-pane m-0 p-0'>
                  <SidesMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>

                {/* All Dips */}
                <div
                  id='dipsMenu'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  <DipsMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>

                {/* All Drinks */}
                <div id='drinksMenu' className='container tab-pane m-0 p-0'>
                  <DrinksMenu
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div
              className='col-lg-4 mt-1 '
              style={{ backgroundColor: "#ff8c008as !important" }}
            >
              <div className='d-flex pt-2'>
                <div className='col-6 '>
                  <h6 className='text-end fs-5 fw-bold'>Cart</h6>
                </div>
                <div className='col-6'>
                  {cartdata?.length > 0 && (
                    <div className='d-flex justify-content-end'>
                      <button
                        className='btn btn-danger btn-xs ms-5 '
                        onClick={() => dispatch(addToCart([]))}
                      >
                        <BiTrash /> Clear cart
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart */}
              <div className='d-flex flex-column cart'>
                <div
                  className='p-3 rounded mb-3 overflow-auto'
                  style={{
                    minHeight: "calc(100% - 45%)",
                    backgroundColor: "#ff8c0026",
                  }}
                >
                  <Cart
                    onProductClick={handleProductClick}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>
                {/* Order Submit */}
                <div className=''>
                  <form>
                    {/* Price / Sub Total */}
                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center OrderAmount'>
                      <label className='form-label w-25'>Price</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          step='0.01'
                          readOnly
                          value={Number(totalPrice).toFixed(2)}
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Discount */}
                    <div className='d-flex flex-wrap my-2 my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Discount</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          step='1'
                          max={totalPrice.toFixed(2)}
                          value={discount}
                          onChange={(e) => {
                            let inputValue = Number(e.target.value);
                            if (inputValue <= 0) {
                              inputValue = "";
                            } else if (inputValue > totalPrice) {
                              inputValue = totalPrice;
                            }
                            setDiscount(inputValue);
                          }}
                        ></input>

                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Percentage */}
                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Tax</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            {cartdata.length !== 0
                              ? settingsData?.filter(
                                (item) =>
                                  item.settingName === "Tax Percentage"
                              )[0].settingValue
                              : 0}{" "}
                            %
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          readOnly
                          placeholder='0.00'
                          min='0'
                          step='1'
                          defaultValue={0}
                          value={
                            cartdata.length !== 0
                              ? ((discountedTotalPrice * taxPer) / 100).toFixed(
                                2
                              )
                              : 0
                          }
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total / Total Price */}
                    {deliveryType === "delivery" ? (
                      <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                        <label className='form-label w-25'>
                          Delivery Charges
                        </label>
                        <div className='input-group w-75'>
                          <div className='input-group-prepend'>
                            <span className='input-group-text inputGroupTxt px-2'>
                              $
                            </span>
                          </div>
                          <input
                            className='form-control w-25 text-end'
                            type='number'
                            placeholder='0.00'
                            min='0'
                            step='0.01'
                            value={
                              cartdata.length === 0 || deliveryType == "pickup"
                                ? 0
                                : settingsData?.filter(
                                  (item) =>
                                    item.settingName === "Delivery Charges"
                                )[0].settingValue
                            }
                            readOnly
                          ></input>
                          <div className='input-group-append'>
                            <span className='input-group-text inputGroupTxt'>
                              CAD
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {deliveryType === "delivery" && !ispostalcodeAvailable ? (
                      <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                        <label className='form-label w-25'>
                          Extra Delivery Charges
                        </label>
                        <div className='input-group w-75'>
                          <div className='input-group-prepend'>
                            <span className='input-group-text inputGroupTxt px-2'>
                              $
                            </span>
                          </div>
                          <input
                            className='form-control w-25 text-end'
                            type='number'
                            placeholder='0.00'
                            min='0'
                            step='1'
                            value={extraDeliveryCharges}
                            onChange={(e) =>
                              setExtraDeliveryCharges(
                                e.target.value < 0 ? 0 : e.target.value
                              )
                            }
                          ></input>
                          <div className='input-group-append'>
                            <span className='input-group-text inputGroupTxt'>
                              CAD
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Total Price</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          min='0'
                          step='0.01'
                          value={Number(grandTotal).toFixed(2)}
                          readOnly
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Order */}

                    <div className='d-flex flex-row justify-content-end align-items-center'>
                      <button
                        type='button'
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        className='submitOrderbtn btn btn-sm mb-4 px-4 py-2'
                      >
                        {formik.isSubmitting
                          ? "Please wait..."
                          : "Submit Order"}
                      </button>
                      <div className='d-none'>
                        <ReactToPrint
                          trigger={() => (
                            <button
                              ref={btnRef}
                              type='button'
                              disabled={formik.isSubmitting}
                              className='submitOrderbtn btn btn-sm mx-3 my-3 px-4 py-2'
                            >
                              {formik.isSubmitting ? "Please wait..." : "Print"}
                            </button>
                          )}
                          content={() => printRef2?.current}
                          onBeforePrint={() => { }}
                        ></ReactToPrint>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Print printRef={printRef2} orderDetail={orderDetail} />
      <ToastContainer position='top-center' />
    </>
  );
}

export default NewOrder;
