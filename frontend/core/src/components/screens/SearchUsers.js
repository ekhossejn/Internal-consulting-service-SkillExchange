import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import Loader from "../Loader";
import Message from "../Message";
import User from "../User";
import Select from "react-select";
import { Row, Col } from "react-bootstrap";

function SearchUsers() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState([]);
  const [shownUsers, setShownUsers] = useState([]);
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
              `/api/search/users/get/`,
              { filter_rating: ratingFilter },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setUsers(data);
            setShownUsers(data);
          } else {
            const { data } = await axios.post(
              `/api/search/users/get/`,
              { filter_rating: ratingFilter, filter_skills: selectedSkills },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setUsers(data);
            setShownUsers(data);
          }
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
  
          if (selectedSkills.length == 0) {
            const { data } = await axios.post(
              `/api/search/users/get/`,
              { filter_rating: ratingFilter },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setUsers(data);
            setShownUsers(data);
          } else {
            const { data } = await axios.post(
              `/api/search/users/get/`,
              { filter_rating: ratingFilter, filter_skills: selectedSkills },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setUsers(data);
            setShownUsers(data);
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
    const fetchRequests = async () => {
      setLoading(true);
      try {
        try {
          const { data } = await axios.get(`/api/search/skills/get/`, {
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
            "/api/token/refresh/",
            {
              refresh: refreshToken,
            },
            config
          );
          userInfo.Access = data;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          setAccessToken(data);
  
          const { data: skillData } = await axios.get(`/api/search/skills/get/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setSkills(skillData );
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

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }
  }, [error]);

  useEffect(() => {
    let sortedUsers = [...users];
    if (sortOrder === "from_higher") {
      sortedUsers.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "from_lower") {
      sortedUsers.sort((a, b) => a.rating - b.rating);
    }
    setShownUsers(sortedUsers);
  }, [sortOrder, users]);

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
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2vh",
            }}
          >
            <h1>Люди</h1>
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
                style={{ width: "30vw" }}
              >
                <option value="">-</option>
                <option value="from_higher">Сначала высокий рейтинг</option>
                <option value="from_lower">Сначала низкий рейтинг</option>
              </select>
            </div>
          </div>
          {shownUsers.map((user) => (
            <Col key={user.id} sm={12} md={6} lg={4} xl={3}>
              <User user={user} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchUsers;
