import * as Yup from "yup";
const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

export const validateSchema = () => {
  return Yup.object({
    phoneno: Yup.string()
      .required("Phone number is required")
      .matches(
        canadianPhoneNumberRegExp,
        "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
      ),
    customername: Yup.string().required("Customer Name is Required."),
    address: Yup.string().required("Address is Required"),
    pincode: Yup.string().required("Pincode is Required"),
    stores: Yup.string().required("Store Location is Required."),
  });
};
