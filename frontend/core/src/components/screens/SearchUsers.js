import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import Loader from "../Loader";
import Message from "../Message";
import User from "../User";
import { Row, Col } from "react-bootstrap";

function SearchUsers() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/search/users/get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(data);
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
      <h1>Люди</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {users.map((user) => (
            <Col key={user.id} sm={12} md={6} lg={4} xl={3}>
              <User user={user} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchUsers
