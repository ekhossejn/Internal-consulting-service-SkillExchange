import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

function SearchUsers() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    return;
  }, []);

  return (
    <Container>
      <br />
      <h1>Люди</h1>
    </Container>
  );
}

export default SearchUsers
