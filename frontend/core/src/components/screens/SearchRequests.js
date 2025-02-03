import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { listRequests } from "../../actions/requestActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";

function SearchRequests() {
  const dispatch = useDispatch();
  const requestsList = useSelector((state) => state.requestsList);
  const { error, loading, requests } = requestsList;

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    dispatch(listRequests(accessToken));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error, navigate]);

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
