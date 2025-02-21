import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";

function SearchRequests() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/search/requests/get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRequests(data);
      } catch (error) {
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error]);

  return (
    <Container>
      <br />
      <h1>Запросы</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {requests.map((request) => (
            <Col key={request.id} sm={12} md={6} lg={4} xl={3}>
              <Request request={request} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchRequests;
