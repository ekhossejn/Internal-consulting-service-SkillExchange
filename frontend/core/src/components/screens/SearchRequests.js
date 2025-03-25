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
  const [shownRequests, setShownRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `/search/requests/get/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRequests(data);
        setShownRequests(data);
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
    let sortedRequests = [...requests];
    if (sortOrder === "from_higher") {
      sortedRequests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === "from_lower") {
      sortedRequests.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    setShownRequests(sortedRequests);
  }, [sortOrder, requests]);

  return (
    <Container>
      <br />
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
            }}
          >
            <h1>Запросы</h1>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-select"
              style={{ width: "30vw" }}
            >
              <option value="">-</option>
              <option value="from_higher">Сначала новые</option>
              <option value="from_lower">Сначала старые</option>
            </select>
          </div>

          {shownRequests.map((request) => (
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
