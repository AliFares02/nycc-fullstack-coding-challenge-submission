import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { token, loading, logout } = useAuth();

  if (loading) {
    return null;
  }
  return (
    <header>
      <h1>NYCC District Complaints Dashboard</h1>
      {token ? (
        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
      ) : null}
    </header>
  );
}

export default Header;
