import React, { useEffect, useState } from 'react'
import Nav from '../../layout/Nav';
import { useDispatch, useSelector } from "react-redux";
import { user, setUser, setToken } from "../../reducer/userReducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePassword } from "../../API/profile";
import { ToastContainer, toast } from 'react-toastify';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/

const passwordSchema = Yup.object({
  password: Yup.string().required("Password is required").matches(passwordRules, { message: "Please create a stronger password" }).min(6, "Password should be 6 characters minimum").max(20, "Maximum characters reached"),
  confirmPassword: Yup.string().required("Confirm Password is required").matches(passwordRules, { message: "Please create a stronger password" }).min(6, "Password should be 6 characters minimum").max(20, "Maximum characters reached").oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const PasswordChange = () => {

  const dispatch = useDispatch();

  let userData = useSelector((state) => state.user.userData);

  const [passwordObj, setpasswordObj] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);


  const onSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("cashierCode", userData?.code);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);
    try {
      setLoading(true);
      const result = await changePassword(formData);
      if (result) {
        toast.success(result.message);
      }
      setTimeout(() => {
        resetForm();
        setLoading(false);
      }, 500);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
      console.log("Exception From RegisterApi", err);
    }
  };

  const formik = useFormik({
    initialValues: passwordObj,
    validateOnBlur: true,
    validationSchema: passwordSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <div>
      <Nav />
      <div className="container-fluid profile-container">
        <div className="row">
          <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 mt-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title my-1" style={{ fontSize: "1.0rem" }}>Change Password</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor='password'>Password</label>
                      <input
                        type="password"
                        id="password"
                        name='password'
                        className='form-control'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                      ) : null}
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor='confirmPassword'>Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name='confirmPassword'
                        className='form-control'
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className="text-danger">{formik.errors.confirmPassword}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type='submit' className='button-primary' disabled={loading}>{loading ? "Updating..." : "Submit"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div >
      <ToastContainer />
    </div >
  )
}

export default PasswordChange;