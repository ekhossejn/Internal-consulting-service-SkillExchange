import React, { useState, useEffect } from "react";
import axios from "axios";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";
import Select from "react-select";
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
  const [makeInfo, setMakeInfo] = useState({});
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [skills, setSkills] = useState([]);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;

  const handleChange = (selectedOptions) => {
    setSkills(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
  };

  useEffect(() => {
    const fetchAllSkills = async () => {
      setLoading(true);
      try {
        try {
          const {data:  skillData } = await axios.get(`/search/skills/get/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAllSkills(skillData);
        } catch (error) {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "api/token/refresh/",
            {
              refresh: refreshToken,
            },
            config
          );
          userInfo.Access = data;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          setAccessToken(data);
          const {data:  skillData } = await axios.get(`/search/skills/get/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAllSkills(skillData);
        }
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

    if (makeInfo && Object.keys(makeInfo).length > 0) {
      navigate("/profile/requests");
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
          `/profile/request/create/`,
          {
            name: name,
            text: text,
            requiredSkills: skills,
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
          "api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);
        const configToken = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const {data:  sendData } = await axios.put(
          `/profile/request/create/`,
          {
            name: name,
            text: text,
            requiredSkills: skills,
          },
          configToken
        );

        setMakeInfo(sendData);
      }
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card style={{ width: "40vw" }}>
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
                      style={{ width: "35vw" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Необходимые скиллы</Form.Label>
                    <Select
                      options={allSkills.map((skill) => ({
                        value: skill.id,
                        label: skill.name,
                      }))}
                      isMulti
                      placeholder="Выберите скиллы..."
                      value={allSkills
                        .filter((skill) => skills.includes(skill.id))
                        .map((s) => ({ value: s.id, label: s.name }))}
                      onChange={handleChange}
                      className="skill-selector"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          width: "35vw",
                          minHeight: "6vh",
                          backgroundColor: "var(--bs-light)",
                          maxHeight: "20vw",
                          overflow: "auto",
                        }),
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "var(--bs-secondary)",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: "var(--bs-body)",
                        }),
                      }}
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
                      style={{ width: "35vw" }}
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
          </div>
        )}
      </Container>
    </>
  );
}

export default MakeRequest;
