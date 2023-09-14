import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/nav.css";
import logo from "../assets/logo.png";
import profileImg from "../assets/user.png";
import arrowKey from "../assets/arrow-key.png";
import { useDispatch, useSelector } from "react-redux";
import { user, setUser, setToken } from "../reducer/userReducer";


function Nav() {
  //redux-dispatch
  const dispatch = useDispatch();
  //navigator
  const navigate = useNavigate();
  //states
  const [loginUserData, setLoginUserData] = useState(null);

  let userData = useSelector((state) => state.user.userData);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cashierCode");
    dispatch(setUser(null));
    dispatch(setToken(""));
    navigate("/");
  };

  //navigate to profile update page
  const handleProfileUdpate = () => {
    navigate("/profile-update");
  }

  // navigate to password update page
  const handlePasswordChange = () => {
    navigate("/password-change");
  }

  useEffect(() => {
    setLoginUserData(userData);
  }, [userData]);

  return (
    <>
      <div className="position-sticky top-0 bg-white header">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-2 py-1 mx-2">
          <div style={{ width: "8%" }}>
            <img
              src={logo}
              width="40%"
              height="40%"
              alt=""
              className="mx-2"
            ></img>
          </div>

          <div className="">
            <span className="mb-0 brandName">
              <strong>Mr Singh's Pizza <small className="text-secondary">(Cashier)</small></strong>
            </span>
          </div>

          <div className="d-flex justify-content-around align-items-center align-content-center">
            <button
              className="bell-button me-3"
              type="button"
              id="notify"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-bell-o" aria-hidden="true"></i>
              <span className="notify-count">2</span>
            </button>
            <div
              className="dropdown-menu dropdown-menu-right notify-menu mt-2 m-0 p-0"
              aria-labelledby="notify"
            >
              <div className="d-flex py-2 px-4 flex-column notify-header text-white">
                <h6 className="mb-1">2 New</h6>
                <span>Notification</span>
              </div>
              <div className="dropdown-item border-bottom p-2 px-4" href="#">
                <div className="">
                  <span className="d-inline-block mb-1">Order No :</span>
                  <span className="mx-2">98876767</span>
                </div>
                <div>
                  <span className="d-inline-block mb-1">Price : </span>
                  <span className="mx-2">$12.92</span>
                </div>
              </div>
              <div className="dropdown-item border-bottom p-2 px-4" href="#">
                <div className="">
                  <span className="d-inline-block mb-1">Order No :</span>
                  <span className="mx-2">98876767</span>
                </div>
                <div>
                  <span className="d-inline-block mb-1">Price : </span>
                  <span className="mx-2">$12.92</span>
                </div>
              </div>
              <div
                className="d-flex py-2 px-5 justify-content-center"
                style={{ cursor: "pointer" }}
              >
                <span className="">
                  Check all notifications
                  <img className="mx-2" src={arrowKey} width="10px" />
                </span>
              </div>
            </div>
            {/* Profile Update */}
            <button className="profile-button" type="button" id="profile" data-bs-toggle="dropdown" aria-expanded="false">
              <img
                src={loginUserData?.profilePhoto !== "" ? loginUserData?.profilePhoto : profileImg}
                alt={loginUserData?.firstName + " " + loginUserData?.lastName}
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </button>
            <div
              className="dropdown-menu dropdown-menu-right mt-2 p-0 profile-menu"
              aria-labelledby="profile-update"
            >
              <div className="d-flex justify-content-left align-items-center p-3 profileDiv text-white">
                <img
                  src={loginUserData?.profilePhoto !== "" ? loginUserData?.profilePhoto : profileImg}
                  alt={loginUserData?.firstName + " " + loginUserData?.lastName}
                  style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                  className="me-1"
                />
                <div className="d-flex justify-content-center flex-column align-items-left">
                  <h6>{loginUserData?.firstName + " " + loginUserData?.lastName}</h6>
                  <p className="mb-0">{loginUserData?.email}</p>
                </div>
              </div>
              <div className="dropdown-item py-2" onClick={handleProfileUdpate}>
                <i className="fa fa-user me-2 text-secondary" aria-hidden="true"></i>
                <span className="">Profile Update</span>
              </div>
              <div className="dropdown-item py-2" onClick={handlePasswordChange}>
                <i className="fa fa-lock me-2 text-secondary" aria-hidden="true"></i>
                <span className="">Password Change</span>
              </div>
              <div className="dropdown-item py-2" onClick={handleLogout}>
                <i className="fa fa-sign-out me-2 text-secondary" aria-hidden="true"></i>
                <span className="">Logout</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="bg-secondary text-secondary mb-1 m-0 p-0 "></hr>

        {/* Tabs */}

        <div className="mx-4">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink
                to="/ongoing-orders"
                className="nav-link"
                activeclassname="active"
              >
                <strong className="nav-text">New Order</strong>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                to="/orders"
                className="nav-link"
                activeclassname="active"
              >
                <strong className="nav-text">Orders</strong>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/invoices"
                className="nav-link"
                activeclassname="active"
              >
                <strong className="nav-text">Invoices</strong>
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                to="/reports"
                className="nav-link"
                activeclassname="active"
              >
                <strong className="nav-text">Reports</strong>
              </NavLink>
            </li> */}
          </ul>
        </div>

        <hr className="bg-secondary text-secondary mt-1 m-0 p-0"></hr>
      </div>
    </>
  );
}

export default Nav;
