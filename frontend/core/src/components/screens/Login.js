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

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [message, setMessage] = useState("");
  const [show, changeshow] = useState("fa fa-eye");
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [userInfo, setUserInfo] = useState();
  const location = useLocation(false);
  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    document.body.style.backgroundColor = "rgba(55, 141, 252, 0.7) ";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
    if (userInfo) {
      navigate("/profile");
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
        "/api/token/",
        {
          email: email,
          password: pass1,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);
    } catch (error) {
      if (error.response.data.detail == "No active account found with the given credentials") {
        setError(
          "Подтверждённого аккаунта с такими данными не существует. Может, Вы забыли подвердить регистрацию на почте?"
        );
      } else {
        setError(
          "Не удалось войти, попробуйте позднее."
        );
     }
    } finally {
      setLoading(false);
    }
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
        {loading ? (
          <Loader />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              style={{
                marginTop: "15vh",
                minHeight: "60vh",
                maxHeight: "80vh",
                width: "30vw",
                borderRadius: "20px",
                overflow: "auto",
                borderRadius: "20px",
                padding: "0 20px",
                border: "1px solid transparent",
              }}
            >
              <Card.Header as="h1" className="text-center border-0">
                <br/>
                Вход
              </Card.Header>
              <Card.Body style={{ justifyContent: "center" }}>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Почта</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.ru"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{height: "6vh"}}
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
                        style={{height: "6vh"}}
                      />
                    </InputGroup>
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      className="btn btn-md btn-success"
                      type="submit"
                      style={{
                        color: "var(--bs-light)",
                        backgroundColor: "rgba(55, 141, 252, 0.7)",
                      }}
                    >
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
                {error && <Message variant="danger">{error}</Message>}
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}

export default Login;
