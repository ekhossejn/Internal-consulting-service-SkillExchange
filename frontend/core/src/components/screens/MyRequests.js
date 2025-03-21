import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import { Row, Col } from "react-bootstrap";
import MyRequest from "../MyRequest";

function MyRequests() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/profile/requests/get/`, {
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
      <h1>Мои запросы</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="d-grid gap-2">
          <button
            class="btn btn-lg btn-primary"
            onClick={() => navigate("/profile/requests/create")}
          >
            Создать запрос
          </button>
          <Row>
          {requests.map((request) => (
            <Col key={request.id} sm={12} md={6} lg={4} xl={3}>
              <MyRequest myRequest={request} />
            </Col>
          ))}
        </Row>
        </div>
      )}
    </Container>
  );
}

export default MyRequests;
