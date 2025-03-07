import React, { useState, useEffect } from "react";
import axios from "axios";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [makeInfo, setMakeInfo] = useState();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [skills, setSkills] = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;

  useEffect(() => {
    const fetchAllSkills = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/search/skills/get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAllSkills(data);
      } catch (error) {
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSkills();
  }, []);

  useEffect(() => {
    if (error) {
      if (error === "Given token not valid for any token type") {
        navigate("/login");
      }
      setMessage(error);
    }

    if (makeInfo) {
      navigate("/profile/requests");
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
        `/profile/request/create/`,
        {
          name: name,
          text: text,
          requiredSkills: skills,
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
                    <Form.Group className="mb-3">
                      <Form.Label>Необходимые скиллы</Form.Label>
                      <Form.Select
                        multiple
                        value={skills}
                        onChange={(e) =>
                          setSkills(
                            [...e.target.selectedOptions].map(
                              (option) => option.value
                            )
                          )
                        }
                        required
                      >
                        {allSkills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => setSkills([])}
                    >
                      Очистить выбор
                    </Button>
                    <br />
                    <br />
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
