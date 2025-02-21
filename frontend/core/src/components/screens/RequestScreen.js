import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

function RequestScreen() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    return;
  }, []);

  return (
    <Container>
      <br />
      <h1>Запрос</h1>
    </Container>
  );
}

export default RequestScreen