import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { login } from "../../actions/userActions";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [show, changeshow] = useState("fa fa-eye");
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/profile";
  useEffect(() => {
    if (userInfo) {
      navigate("/profile");
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, pass1));
  };

  const showPassword = () => {
    var x = document.getElementById("pass1");
    if (x.type == "password") {
      x.type = "text";
      changeshow("fa fa-eye");
    } else {
      x.type = "password";
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
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-primary text-light"
                >
                  Вход
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
                    <div className="d-grid gap-2">
                      <Button className="btn btn-md btn-success" type="submit">
                        {" "}
                        Войти{" "}
                      </Button>
                    </div>
                  </Form>
                  <Row className="py-3">
                    <Col>
                      Новый пользователь?
                      <Link to="/signup"> Зарегистироваться</Link>
                    </Col>
                  </Row>
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

export default Login;
