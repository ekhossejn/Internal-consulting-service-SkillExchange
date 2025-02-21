import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

function Company() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    return;
  }, []);

  return (
    <Container>
      <br />
      <h1>Об организации</h1>
    </Container>
  );
}

export default Company
