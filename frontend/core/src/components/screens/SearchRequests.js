import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Request from "../Request";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";
import Select from "react-select";

function SearchRequests() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [requests, setRequests] = useState([]);
  const [shownRequests, setShownRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inputRating, setInputRating] = useState();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputSkills, setInputSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState(200);
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;

  const handleChange = (selectedOptions) => {
    setInputSkills(
      selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    );
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        try {
          if (selectedSkills.length == 0) {
            const { data } = await axios.post(
              `/search/requests/get/`,
              { filter_rating: ratingFilter },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setRequests(data);
            setShownRequests(data);
          } else {
            const { data } = await axios.post(
              `/search/requests/get/`,
              { filter_rating: ratingFilter, filter_skills: selectedSkills },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setRequests(data);
            setShownRequests(data);
          }
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
  
          if (selectedSkills.length == 0) {
            const { data } = await axios.post(
              `/search/requests/get/`,
              { filter_rating: ratingFilter },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setRequests(data);
            setShownRequests(data);
          } else {
            const { data } = await axios.post(
              `/search/requests/get/`,
              { filter_rating: ratingFilter, filter_skills: selectedSkills },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setRequests(data);
            setShownRequests(data);
          }
        }
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось загрузить страницу, попробуйте позже.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [ratingFilter, selectedSkills]);

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }
  }, [error]);

  useEffect(() => {
    let sortedRequests = [...requests];
    if (sortOrder === "newer") {
      sortedRequests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === "older") {
      sortedRequests.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    setShownRequests(sortedRequests);
  }, [sortOrder, requests]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        try {
          const { data } = await axios.get(`/search/skills/get/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setSkills(data);
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
  
          const { data: skillData } = await axios.get(`/search/skills/get/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setSkills(skillData);
        }
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось загрузить страницу, попробуйте позже.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <div
            style={{
              display: "flex",
              marginTop: "2vh",
              justifyContent: "space-between",
            }}
          >
            <h1>Запросы</h1>
            <div style={{ display: "flex", gap: "1vw" }}>
              <input
                className="form-control"
                type="text"
                inputMode="decimal"
                value={inputRating ?? ""}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value === "") {
                    setInputRating("");
                    return;
                  }
                  if (value.match(/^\d*[.,]?\d{0,2}$/)) {
                    const numericValue = parseFloat(value);
                    if (numericValue >= 0 && numericValue <= 5) {
                      setInputRating(value);
                    }
                  }
                }}
                onBlur={() => {
                  if (inputRating === "" || inputRating === undefined) {
                    setRatingFilter(0);
                  } else {
                    setRatingFilter(parseFloat(inputRating));
                  }
                }}
                placeholder="Рейтинг не меньше..."
                style={{ appearance: "none", MozAppearance: "textfield" }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }

                  if (e.key === "Enter") {
                    if (inputRating === "" || inputRating === undefined) {
                      setRatingFilter(0);
                    } else {
                      setRatingFilter(parseFloat(inputRating));
                    }
                  }
                }}
              />
              <Select
                options={skills.map((skill) => ({
                  value: skill.id,
                  label: skill.name,
                }))}
                isMulti
                placeholder="Необходимые скиллы..."
                value={skills
                  .filter((skill) => inputSkills.includes(skill.id))
                  .map((s) => ({ value: s.id, label: s.name }))}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedSkills(inputSkills);
                  }
                }}
                className="skill-selector"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: "30vw",
                    height: "6vh",
                    backgroundColor: "var(--bs-light)",
                    maxHeight: "6vh",
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
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="form-select"
                style={{ width: "20vw" }}
              >
                <option value="">-</option>
                <option value="newer">Сначала новые</option>
                <option value="older">Сначала старые</option>
                <option value="higher">Сначала высокий рейтинг автора</option>
                <option value="lower">Сначала низкий рейтинг автора </option>
              </select>
            </div>
          </div>
          {shownRequests.map((request) => (
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
