import React, { useState, useEffect } from "react";
import axios from "axios";
import Request from "../Request";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
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

function MakeReview({ params }) {
  const { id } = useParams();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [makeInfo, setMakeInfo] = useState({});
  const [text, setText] = useState("");
  const [textError, setTextError] = useState(
    "Текст отзыва должен быть не пустым"
  );
  const [rating, setRating] = useState("");
  const [ratingError, setRatingError] = useState("Выберите оценку");
  const skills = useState([]);
  const [status, setStatus] = useState(200);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }

    if (makeInfo && Object.keys(makeInfo).length > 0) {
      navigate(`/search/users/${id}/`);
    }
  }, [error, makeInfo]);

  const makeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const { data: sendData } = await axios.put(
          `/api/search/user/${id}/review/create/`,
          {
            text: text,
            rating: rating,
          },
          config
        );

        setMakeInfo(sendData);
      } catch (error) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);
        const sendConfig = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const { data: sendData } = await axios.put(
          `/api/search/user/${id}/review/create/`,
          {
            text: text,
            rating: rating,
          },
          sendConfig
        );

        setMakeInfo(sendData);
      }
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось создать отзыв, попробуйте позже.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                <Card.Body>
                  <Form onSubmit={makeHandler}>
                    <Form.Group className="mb-3" controlId="text">
                      <Form.Label>Текст отзыва</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        value={text}
                        onChange={(e) => {
                          const input = e.target.value;
                          setText(input);

                          if (input.length == 0) {
                            setTextError("Текст должен быть не пустым");
                          } else if (input.length > 10) {
                            setTextError("Максимум 100 символов");
                          } else {
                            setTextError("");
                          }
                        }}
                        isInvalid={!!textError}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {textError}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Оценка</Form.Label>
                      <Form.Select
                        value={rating}
                        isInvalid={!!ratingError}
                        onChange={(e) => {
                          const input = e.target.value;
                          setRating(input)
                          if (input == "") {
                            setRatingError("Выберите оценку")
                          } else {
                            setRatingError("")
                          }
                        }}
                        required
                      >
                        <option value=""></option>
                        {[...Array(5).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {ratingError}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <br />
                    <div className="d-grid gap-2">
                      <Button
                        className="btn btn-md ${(!!textError || !!ratinError) ? 'btn-disabled' : 'btn-success'}"
                        type="submit"
                        disabled={!!textError || !!ratingError}
                      >
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

export default MakeReview;
