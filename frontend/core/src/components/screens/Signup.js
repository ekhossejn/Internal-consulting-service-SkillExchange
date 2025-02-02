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
import { signup } from "../../actions/userActions";


function Signup() {
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [show, changeshow] = useState("fa fa-eye");
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search?location.search.split("=")[1] : "/profile"

  const userSignup = useSelector((state) => state.userSignup);
  const {error, loading, userInfo} = userSignup;

  useEffect(()=>{
    if (userInfo) {
      setMessage(userInfo.details)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPass1("")
      setPass2("")
    }
  }, [userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault();

    if (pass1 != pass2) {
      setMessage("Неверный повторный пароль. Повторите попытку.");
      navigate("/signup");
    } else if (pass1.length < 5) {
      setMessage("Пароль слишком короткий. Повторите попытку.");
      navigate("/signup");
    } else {
      dispatch(signup(first_name, last_name, email, pass1))
      setMessage("Регистрация успешна")
      navigate("/login")
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
            <Card>
              <Card.Header
                as="h3"
                className="text-center bg-primary text-light"
              >
                Регистрация
              </Card.Header>
              <Card.Body>
                {message && <Message variant="danger">{message}</Message>}
                {loading && <Loader/>}
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="first_name">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Иван"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="last_name">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Сидоров"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
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
                  <small>Пароль должен иметь размер не меньше 5.</small>
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
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
