import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingLayout from "./LoadingLayout";
import { useSelector } from "react-redux";

function AuthLayout({ children }) {
  const [ok, setOk] = useState(false);

  const navigate = useNavigate();

  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (userData) {
      setOk(true);
    } else {
      setOk(false);
      navigate("/");
    }
  }, [userData, navigate]);

  return <>{children}</>;
}

export default AuthLayout;
