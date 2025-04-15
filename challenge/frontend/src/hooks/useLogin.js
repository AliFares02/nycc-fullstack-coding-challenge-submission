import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async ({ username, password }) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.non_field_errors &&
          errorData.non_field_errors.length > 0
        ) {
          throw new Error(errorData.non_field_errors[0]);
        } else {
          throw new Error("Error occured trying to log in");
        }
      }
      const data = await response.json();

      const token = login(data.token);
      setError(null);
      setLoading(false);
      return token;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return { loginUser, loading, error };
};

export default useLogin;
