import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Review from "../Review";
import Skill from "../Skill";
import Document from "../Document";

function Profile() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [mainInfo, setMainInfo] = useState({
    skills: [],
    documents: [],
    reviews: [],
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data: mainData } = await axios.get(`/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMainInfo(mainData);
      } catch (error) {
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error]);

  return (
    <Container>
      <br />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div
          style={{
            display: "flex",
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
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "300px",
                  height: "300px",
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
                <h2>{mainInfo.name}</h2>
                <h2 style={{ marginLeft: "100px" }}>{mainInfo.rating_sum}</h2>
              </div>
            </div>
            <Card
              className="my-3 p-3 rounded"
              style={{ backgroundColor: "var(--bs-light)", width: "95%" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {mainInfo.skills.map((skill) => (
                  <Skill key={skill.id} skill={skill} />
                ))}
              </div>
            </Card>
            {mainInfo.documents.map((document) => (
              <Col key={document.id} sm={12} md={6} lg={4} xl={3}>
                <Document document={document} />
              </Col>
            ))}
          </div>
          <div
            style={{
              flex: 1,
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
          </div>
        </div>
      )}
    </Container>
  );
}

export default Profile;
