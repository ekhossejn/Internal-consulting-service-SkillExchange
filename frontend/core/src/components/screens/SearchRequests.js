import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";


function SearchRequests() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    async function fetchrequests() {
      const { data } = await axios.get("/profile/requests/", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setRequests(data);
    }
    fetchrequests();
  }, []);
  return (
    <Container>
      <br />
      <h1>Запросы</h1>
      <Row>
        {requests.map((request) => (
          <Col key={request.id} sm={12} md={6} lg={4} xl={3}>
            <Request request={requests} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SearchRequests;
