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
  const [message, setMessage] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [makeInfo, setMakeInfo] = useState();
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const skills = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    if (error) {
      if (error === "Given token not valid for any token type") {
        navigate("/login");
      }
      setMessage(error);
    }

    if (makeInfo) {
      navigate(`/search/users/${id}/`);
    }
  }, [error, makeInfo]);

  const makeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const { data } = await axios.put(
        `/search/user/${id}/review/create/`,
        {
          text: text,
          rating: rating
        },
        config
      );

      setMakeInfo(data);
    } catch (error) {
      setError(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
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
                        onChange={(e) => setText(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Оценка</Form.Label>
                      <Form.Select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                      >
                        <option value=""></option>
                        {[...Array(5).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </Form.Select>
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

export default MakeReview;
