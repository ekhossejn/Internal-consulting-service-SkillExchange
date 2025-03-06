import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Skill from "../Skill";

function RequestScreen({ params }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [mainInfo, setMainInfo] = useState({
    requiredSkills: [],
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data: mainData } = await axios.get(
          `/search/request/get/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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
            gap: "100px",
          }}
        >
          <div>
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
                flex: 1,
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
            <br />
            <div className="d-grid gap-2">
              <Button className="btn btn-md btn-success" type="submit">
                {" "}
                Откликнуться{" "}
              </Button>
            </div>
          </div>
          <div style={{ flex: 2 }}>
            <h2>{mainInfo.name}</h2>
            <h2>{mainInfo.createdAt}</h2>
            <Card
              className="my-3 p-3 rounded"
              style={{ backgroundColor: "var(--bs-light)" }}
            >
              {mainInfo.requiredSkills.map((skill) => (
                <Col key={skill.id} sm={12} md={6} lg={4} xl={3}>
                  <Skill skill={skill} />
                </Col>
              ))}
            </Card>
            <h3>{mainInfo.text}</h3>
          </div>
        </div>
      )}
    </Container>
  );
}

export default RequestScreen;
