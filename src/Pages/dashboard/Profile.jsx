import React, { useEffect, useState } from 'react'
import Nav from '../../layout/Nav';
import { useDispatch, useSelector } from "react-redux";
import { user, setUser, setToken } from "../../reducer/userReducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateProfile } from "../../API/profile";
import { ToastContainer, toast } from 'react-toastify';
import defaultPhoto from "../../assets/user.png";

const profileSchema = Yup.object({
    firstName: Yup.string().required("First name is required").matches(/^[a-zA-Z\s]*$/, "Invalid characters in first name").min(3, "Name should be 3 characters minimum").max(30, "Maximum characters reached"),
    lastName: Yup.string().required("Last name is required").matches(/^[a-zA-Z\s]+$/, "Invalid characters in last name").min(3, "Name should be 3 characters minimum").max(30, "Maximum characters reached"),
    mobileNumber: Yup.number().required("Password is required").min(10, "Invalid phone number"),
    email: Yup.string().email("Email is required"),
    userName: Yup.string().required("Username is required").matches(/^[a-zA-Z0-9\s]+$/, "Invalid characters in user-name").min(4, "Username should be 4 characters minimum").max(20, "Maximum characters reached"),
});

const Profile = () => {

    const dispatch = useDispatch();

    let userData = useSelector((state) => state.user.userData);

    const [profileObj, setProfileObj] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        userName: ""
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const onSubmit = async (values) => {
        // console.log(values)
        const formData = new FormData();
        formData.append("cashierCode", userData?.code);
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("mobile", values.mobileNumber);
        formData.append("userEmail", values.email);
        formData.append("username", values.userName);
        if (selectedFile) {
            formData.append('profilePhoto', selectedFile);
        }
        
        try {
            setLoading(true);
            const result = await updateProfile(formData);

            if (result.data) {
                document.getElementById("profilePhoto").value = null;
                setSelectedFile(null)
                setPreviewUrl(null);

                console.log("api-response", result);
                const data = result.data;
                const payload = {
                    code: data.code,
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobileNumber: data.mobileNumber,
                    email: data.email,
                    isActive: data.isActive,
                    firebaseId: data.firebaseId,
                    profilePhoto: data.profilePhoto,
                }

                dispatch(setUser(payload));

                setTimeout(() => {
                    toast.success(result.message);
                    setLoading(false);
                }, 500);
            } else {
                toast.error(result.message);
            }

        } catch (err) {
            toast.error(err.message);
            setLoading(false);
            console.log("Exception From RegisterApi", err);
        }
    };

    const formik = useFormik({
        initialValues: profileObj,
        validateOnBlur: true,
        validationSchema: profileSchema,
        enableReinitialize: true,
        onSubmit,
    });

    useEffect(() => {
        setProfileObj({
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            mobileNumber: userData?.mobileNumber,
            email: userData?.email,
            userName: userData?.userName
        })
    }, [userData]);

    return (
        <div>
            <Nav />
            <div className="container-fluid profile-container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 mt-5">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title my-1" style={{ fontSize: "1.0rem" }}>Update Profile</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label htmlFor='userName'>User Name</label>
                                            <input
                                                type="text"
                                                id="userName"
                                                name='userName'
                                                className='form-control'
                                                value={formik.values.userName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.userName && formik.errors.userName ? (
                                                <div className="text-danger">{formik.errors.userName}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-sm-6 mb-3">
                                            <label htmlFor='firstName'>First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name='firstName'
                                                className='form-control'
                                                value={formik.values.firstName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.firstName && formik.errors.firstName ? (
                                                <div className="text-danger">{formik.errors.firstName}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-12 col-sm-6 mb-3">
                                            <label htmlFor='lastName'>Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name='lastName'
                                                className='form-control'
                                                value={formik.values.lastName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.lastName && formik.errors.lastName ? (
                                                <div className="text-danger">{formik.errors.lastName}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label htmlFor='mobileNumber'>Phone Number</label>
                                            <input
                                                type="number"
                                                id="mobileNumber"
                                                name='mobileNumber'
                                                className='form-control'
                                                value={formik.values.mobileNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                                                <div className="text-danger">{formik.errors.mobileNumber}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label htmlFor='email'>Email</label>
                                            <input
                                                type="text"
                                                id="email"
                                                name='email'
                                                className='form-control'
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="text-danger">{formik.errors.email}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-sm-6 mb-3">
                                            <label htmlFor='firstName'>Profile Picture</label>
                                            <input type="file" id="profilePhoto" name='profilePhoto' className='form-control' onChange={handleFileChange} />
                                        </div>
                                        <div className="col-12">
                                            {previewUrl ? <img src={previewUrl} className='profile-picture' alt="Profile Preview" /> : <img src={userData?.profilePhoto ? userData?.profilePhoto : defaultPhoto} className='profile-picture' alt={userData?.userName} />}
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
            </div>
            <ToastContainer />
        </div>
    )
}

export default Profile