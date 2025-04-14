import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <input
          id="username"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? "Loading..." : "Log in"}</button>
        {error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default Login;
