import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../API/auth/login";
import { useFormik } from "formik";
import bgImage from "../../assets/bg-img.jpg";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { user, setUser, setToken } from "../../reducer/userReducer";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";

// Validation Functions
const getCharacterValidationError = (str) => {
  return `Your password must have at least 1 ${str} character`;
};


const ValidateSchema = Yup.object({
  userName: Yup.string().required("Username is required").matches(/^[a-zA-Z0-9\s]+$/, "Invalid characters in user-name").min(4, "Username should be 4 characters minimum").max(20, "Maximum characters reached"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must have at least 6 characters")
});

function Login() {
  const [loginObj, setLoginObj] = new useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const userData = useSelector((state) => state.user.userData);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await loginApi(values)
        .then(async (res) => {
          // Store res in LocalStorage 
          let data = res.data;
          if (data.token && data.data) {
            let parseToken = res.data.token;
            localStorage.setItem("token", parseToken);
            localStorage.setItem("cashierCode", res.data.data.code);
            const payload = {
              code: data.data.code,
              userName: data.data.userName,
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              mobileNumber: data.data.mobileNumber,
              email: data.data.email,
              isActive: data.data.isActive,
              firebaseId: data.data.firebaseId,
              profilePhoto: data.data.profilePhoto,
            }
            dispatch(setUser(payload));
            dispatch(setToken(res.data.token));
            setTimeout(() => {
              navigate("/ongoing-orders");
            }, 800);
          } else {
            setLoading(false);
            toast.error(data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error From LoginApi: ", err);
        });
    } catch (err) {
      setLoading(false);
      console.log("Exception From LoginApi", err);
      setLoading(false);
    }
  };

  // Use Formik
  const formik = useFormik({
    initialValues: loginObj,
    validateOnBlur: true,
    validationSchema: ValidateSchema,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (userData) {
      navigate("/ongoing-orders");
    }
  }, [userData, navigate]);

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center align-content-center vh-100"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="p-4"
          style={{
            backgroundColor: "#f7f7f7",
            borderRadius: "1%",
            width: "25%",
            zIndex: "100",
          }}
        >
          <div className="w-100 h-25 d-flex justify-content-center">
            <img
              src={logo}
              width="15%"
              height="15%"
              alt=""
              className="mb-2"
            ></img>
          </div>
          <h5 className="mb-4 text-center">Login</h5>
          <form onSubmit={formik.handleSubmit}>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="userName"
              className="form-control"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-danger mt-2">{formik.errors.userName}</div>
            ) : null}
            <label className="form-label mt-2">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger mt-2">{formik.errors.password}</div>
            ) : null}
            <div className="d-flex justify-content-end w-100">
              <Link to="/forget-password" className="my-2">
                Forget Password
              </Link>
            </div>
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                className="btn px-4 mt-1 w-100 text-center btn-rounded"
                style={{ backgroundColor: "#ff8c00", color: "#f4f4f4" }}
                disabled={loading}
              >
                <strong>{loading ? "Please wait..." : "Login"}</strong>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer hideProgressBar={true} position="top-center"/>
    </>
  );
}

export default Login;
