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
  const [shownUsers, setShownUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `/search/users/get/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(data);
        setShownUsers(data);
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

  useEffect(() => {
    let sortedUsers = [...users];
    if (sortOrder === "from_higher") {
      sortedUsers.sort(
        (a, b) =>
          b.rating - a.rating
      );
    } else if (sortOrder === "from_lower") {
      sortedUsers.sort(
        (a, b) =>
          a.rating - b.rating
      );
    }
    setShownUsers(sortedUsers);
  }, [sortOrder, users]);

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2vh"
            }}
          >
            <h1>Люди</h1>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-select"
              style={{ width: "30vw" }}
            >
              <option value="">-</option>
              <option value="from_higher">Сначала высокий рейтинг</option>
              <option value="from_lower">Сначала низкий рейтинг</option>
            </select>
          </div>
          {shownUsers.map((user) => (
            <Col key={user.id} sm={12} md={6} lg={4} xl={3}>
              <User user={user} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchUsers;
