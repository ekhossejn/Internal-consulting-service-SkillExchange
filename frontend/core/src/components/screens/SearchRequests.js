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
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inputRating, setInputRating] = useState();

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `/search/requests/get/`,
          { filter_rating: ratingFilter },
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
  }, [ratingFilter]);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error]);

  useEffect(() => {
    let sortedRequests = [...requests];
    if (sortOrder === "newer") {
      sortedRequests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === "older") {
      sortedRequests.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    setShownRequests(sortedRequests);
  }, [sortOrder, requests]);

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
              marginTop: "2vh",
              justifyContent: "space-between"
            }}
          >
            <h1>Запросы</h1>
            <div style={{ display: "flex", gap: "1vw" }}>
              <input
                className="form-control"
                type="text"
                inputMode="decimal"
                value={inputRating ?? ""}
                onChange={(e) => {
                  let value = e.target.value;
                  if (
                    value === "" ||
                    (value.match(/^\d+(\.\d{0,2})?$/) && parseFloat(value) <= 5)
                  ) {
                    setInputRating(value);
                  }
                }}
                onBlur={() => {
                  if (inputRating === "" || inputRating === undefined) {
                    setRatingFilter(0);
                  } else {
                    setRatingFilter(parseFloat(inputRating));
                  }
                }}
                placeholder="Рейтинг не меньше..."
                style={{ appearance: "none", MozAppearance: "textfield" }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="form-select"
                style={{ width: "20vw" }}
              >
                <option value="">-</option>
                <option value="newer">Сначала новые</option>
                <option value="older">Сначала старые</option>
                <option value="higher">Сначала высокий рейтинг автора</option>
                <option value="lower">Сначала низкий рейтинг автора </option>
              </select>
            </div>
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
