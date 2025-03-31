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
  const [deleteInfo, setDeleteInfo] = useState();
  const [status, setStatus] = useState(200);

  const Delete = async (e, id) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const { data } = await axios.post(
        `/profile/request/delete/${id}/`,
        {},
        config
      );

      setDeleteInfo(data);
      window.location.reload();
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось войти, попробуйте позднее.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        if (error.response.status != 401) {
          setError("Не удалось войти, попробуйте позднее.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }
  }, [error]);

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="d-grid gap-2" style= {{marginTop: "2vh"}}>
          <h1>Мои запросы</h1>
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
              <button class="btn btn-sm btn-primary" onClick={(e) => Delete(e, request.id)}>Удалить</button>
            </Col>
          ))}
        </Row>
        </div>
      )}
    </Container>
  );
}

export default MyRequests;
