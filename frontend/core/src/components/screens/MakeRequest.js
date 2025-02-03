import React, { useState, useEffect } from "react";
import axios from "axios";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { make } from "../../actions/requestActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";

function MakeRequest() {
  const dispatch = useDispatch();
  const makeRequest = useSelector((state) => state.requestMake);
  const { error, loading, makeInfo } = makeRequest;

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const skills = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  const makeHandler = (e) => {
    dispatch(make(accessToken, name, text, skills));
  };


  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error, navigate]);

  return (
    <>
      <Container className="mt-3">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
        
      ) : (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <Card>
              <Card.Header
                as="h3"
                className="text-center bg-primary text-light"
              >
                Создание запроса
              </Card.Header>
              <Card.Body>
                <Form onSubmit={makeHandler}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Название запроса</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="text">
                    <Form.Label>Текст запроса</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <br />
                  <div className="d-grid gap-2">
                    <Button className="btn btn-md btn-success" type="submit">
                      {" "}
                      Создать{" "}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}></Col>
        </Row>
      )}
      </Container>
    </>
  );
}

export default MakeRequest;
