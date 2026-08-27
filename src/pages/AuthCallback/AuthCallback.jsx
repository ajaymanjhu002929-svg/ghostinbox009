import React, {
  useEffect,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";


const AuthCallback = () => {

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  useEffect(() => {

    const token =
      searchParams.get("token");

    const redirect =
      searchParams.get("redirect");


    // ------------------------------------------
    // TOKEN CHECK
    // ------------------------------------------

    if (!token) {

      console.error(
        "Google authentication token missing"
      );

      navigate("/auth", {
        replace: true,
      });

      return;
    }


    // ------------------------------------------
    // SAVE TOKEN
    // ------------------------------------------

    localStorage.setItem(
      "token",
      token
    );


    console.log(
      "Google authentication token saved"
    );


    // ------------------------------------------
    // REDIRECT
    // ------------------------------------------

    if (
      redirect ===
      "discover"
    ) {

      navigate(
        "/discover",
        {
          replace: true,
        }
      );

      return;
    }


    navigate(
      "/create-profile",
      {
        replace: true,
      }
    );

  }, [
    navigate,
    searchParams,
  ]);


  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>
        Signing you in...
      </p>
    </main>
  );
};


export default AuthCallback;