import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Skill from "../Skill";

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short'
};

function RequestScreen({ params }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState(200);
  const [mainInfo, setMainInfo] = useState({
    requiredSkills: [],
  });

  const Respond = async (e) => {
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
  
        const {data: email} = await axios.get(
          `/profile/email/get/`,
          config
        );
  
        if (mainInfo.emails.includes(email)) {
          setError("Вы уже откликались на этот запрос")
        } else {
  
          const { data } = await axios.post(
            `/search/request/respond/${id}/`,
            {},
            config
          );
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

        const checkConfig = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
  
        const {data: email} = await axios.get(
          `/profile/email/get/`,
          checkConfig
        );
  
        if (mainInfo.emails.includes(email)) {
          setError("Вы уже откликались на этот запрос")
        } else {
  
          const { data } = await axios.post(
            `/search/request/respond/${id}/`,
            {},
            checkConfig
          );
        }
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

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
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
  
          const { data: mainData } = await axios.get(
            `/search/request/get/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setMainInfo(mainData);
        }
      } catch (error) {
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (error && error != "Вы уже откликались на этот запрос") {
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
            gap: "100px",
            marginTop: "2vh"
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
              <button className="btn btn-md btn-primary" onClick={(e) => Respond(e)}>
                Откликнуться
              </button>
            </div>
          </div>
          <div style={{ flex: 2 }}>
            <h1>{mainInfo.name}</h1>
            <h3 style={{ fontSize: '2vh'}}>{new Date(mainInfo.createdAt).toLocaleString('ru-RU', options)
            }</h3>
            <Card
              className="my-3 p-3 rounded"
              style={{ backgroundColor: "var(--bs-light)", minHeight: "8vh" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "vw", rowGap: "vh" }}>
                {mainInfo.requiredSkills.map((skill) => (
                  <Skill key={skill.id} skill={skill} />
                ))}
              </div>
            </Card>
            <h3>{mainInfo.text}</h3>
          </div>
        </div>
      )}
    </Container>
  );
}

export default RequestScreen;
