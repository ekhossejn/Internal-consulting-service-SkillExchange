import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Review from "../Review";
import Skill from "../Skill";
import Document from "../Document";

function UserScreen({ params }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState(200);
  const [mainInfo, setMainInfo] = useState({
    skills: [],
    documents: [],
    reviews: [],
  });
  const [emailVisible, setEmailVisible] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        try {
          const { data: mainData } = await axios.get(`/search/user/get/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMainInfo(mainData);
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
  
          const { data: mainData } = await axios.get(`/search/user/get/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMainInfo(mainData);
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

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div
          style={{
            display: "flex",
            marginTop: "2vh",
          }}
        >
          <div
            style={{
              flex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "3vw",
              }}
            >
              <div
                style={{
                  width: "min(30vh, 30vw)",
                  height: "min(30vh, 30vw)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid var(--secondary-color)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={mainInfo.image}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                ></img>
              </div>
              <div>
                <h1>{mainInfo.name}</h1>
                <svg
                  width="10vh"
                  height="10vh"
                  viewBox="0 0 24 24"
                  fill="var(--bs-yellow)"
                  stroke="var(--bs-yellow)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block"}}
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 
                17 14.14 18.18 21.02 
                12 17.77 5.82 21.02 
                7 14.14 2 9.27 
                8.91 8.26 12 2"
                    fill="none"
                  />
                  <text
                    x="12"
                    y="15"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#485785"
                    stroke="#485785"
                    strokeWidth="0.1"
                  >
                    {mainInfo.rating}
                  </text>
                </svg>
                <div className="d-grid gap-2" style={{marginTop: "2vh"}}>
                  {emailVisible ? (
                    <p className="text-success">{mainInfo.email}</p>
                  ) : (
                    <Button
                      className="btn btn-md btn-success"
                      onClick={() => setEmailVisible(true)}
                    >
                      Увидеть почту
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <h3 style={{marginTop: "2vh"}}>Скиллы</h3>
            <Card
              className="my-3 p-3 rounded"
              style={{
                backgroundColor: "var(--bs-light)",
                width: "90%",
                minHeight: "8vh"
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {mainInfo.skills.map((skill) => (
                  <Skill key={skill.id} skill={skill} />
                ))}
              </div>
            </Card>
            <h3 style={{marginTop: "2vh"}}>Документы</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2vh",
                width: "90%",
                marginTop: "2vh"
              }}
            >
              {mainInfo.documents.map((document) => (
                <div
                  key={document.id}
                  style={{ flex: "0 0 150px", maxWidth: "200px" }}
                >
                  <Document document={document} />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            {mainInfo.reviews.map((review) => (
              <Col
                key={review.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                style={{ width: "100%" }}
              >
                <Review review={review} />
              </Col>
            ))}
            <button
              class="btn btn-lg btn-primary"
              style={{ width: "100%" }}
              onClick={() => navigate(`/search/users/${id}/comment/`)}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default UserScreen;
