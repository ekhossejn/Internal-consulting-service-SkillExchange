import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

function MyRequests() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    return;
  }, []);

  return (
    <Container>
      <br />
      <h1>Мои запросы</h1>
      <div className="d-grid gap-2">
      <button class="btn btn-lg btn-primary" onClick={() => navigate("/profile/requests/create")}>Создать запрос</button>
      </div>
    </Container>
  );
}

export default MyRequests;
