import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;
  const [documents, setDocuments] = useState([]);



  return (
    <Container>
      <br />
      <h1>Мой профиль</h1>
    </Container>
  )
}

export default Profile;
