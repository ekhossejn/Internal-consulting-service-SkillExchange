import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [show, changeshow] = useState("fa fa-eye");
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [userInfo, setUserInfo] = useState();


  useEffect(() => {
    if (error) {
      setMessage(error);
    }
    if (userInfo) {
      navigate("/login");
    }
  }, [error, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/register/",
        {
          email: email,
          password: pass1,
        },
        config
      );

      setUserInfo(data);
    } catch (error) {
      setError(
        "Не удалось зарегистрироваться, попробуйте позже."
      );
    } finally {
      setLoading(false);
    }
  };

  const showPassword = () => {
    var x = document.getElementById("pass1");
    var z = document.getElementById("pass2");
    if (x.type == "password" && z.type == "password") {
      x.type = "text";
      z.type = "text";
      changeshow("fa fa-eye");
    } else {
      x.type = "password";
      z.type = "password";
      changeshow("fa fa-eye-slash");
    }
  };

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            {loading ? (
              <Loader />
            ) : (
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-primary text-light"
                >
                  Регистрация
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Почта</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="name@example.ru"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {" "}
                        <span>
                          <i className={show}></i>
                        </span>{" "}
                        Пароль
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Checkbox onClick={showPassword} />{" "}
                        <Form.Control
                          type="password"
                          placeholder="!5uper5afePa55w0rd!"
                          id="pass1"
                          value={pass1}
                          onChange={(e) => setPass1(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                    <small>
                      Пароль должен содержать минимум 8 символов, хотя бы одну
                      букву и одну цифру.
                    </small>
                    <br />
                    <br />
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {" "}
                        <span>
                          <i className={show}></i>
                        </span>{" "}
                        Повторите пароль
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Checkbox onClick={showPassword} />{" "}
                        <Form.Control
                          type="password"
                          placeholder="То же что и выше"
                          id="pass2"
                          value={pass2}
                          onChange={(e) => setPass2(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                    <br />
                    <div className="d-grid gap-2">
                      <Button className="btn btn-md btn-success" type="submit">
                        {" "}
                        Зарегистироваться{" "}
                      </Button>
                    </div>
                  </Form>
                  <Row className="py-3">
                    <Col>
                      Уже зарегистрирован?
                      <Link to="/login"> Войти</Link>
                    </Col>
                  </Row>
                  {error && <Message variant="danger">{error}</Message>}
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={4}></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
