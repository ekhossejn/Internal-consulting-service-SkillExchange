import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Skill from "../Skill";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
};

function GetButtonName(isActive) {
  if (isActive) {
    return "Скрыть запрос";
  }
  return "Показать запрос";
}

function MyRequestScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(200);
  const [mainInfo, setMainInfo] = useState({
    requiredSkills: [],
    emails: [],
    image: "",
    name: "",
    text: "",
    createdAt: "",
    isActive: false,
  });

  const ChangeRequestState = async (e) => {
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
  
        const { data } = await axios.post(
          `/api/profile/request/${id}/active/change/`,
          {},
          config
        );
  
        setMainInfo((prevState) => ({
          ...prevState,
          isActive: data.isActive,
        }));
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

        const changeConfig = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
  
        const { data: changeData } = await axios.post(
          `/api/profile/request/${id}/active/change/`,
          {},
          changeConfig
        );
  
        setMainInfo((prevState) => ({
          ...prevState,
          isActive: changeData.isActive,
        }));
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

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const { data: mainData } = await axios.get(
            `/api/profile/request/get/${id}/`,
            config
          );
          setMainInfo(mainData);
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
  
          const mainDataConfig = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const { data: mainData } = await axios.get(
            `/api/profile/request/get/${id}/`,
            mainDataConfig
          );
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
  }, [id, accessToken]);

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }
  }, [error, navigate]);

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
            marginTop: "2vh",
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
                src={mainInfo.authorImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <br />
            <div className="d-grid gap-2">
              <button
                className="btn btn-md btn-primary"
                onClick={(e) => ChangeRequestState(e)}
              >
                {GetButtonName(mainInfo.isActive)}
              </button>
            </div>
            <br />
            <h3 style={{ fontSize: "3vh" }}>Почты откликнувшихся:</h3>
            <div style={{ textAlign: "center" }}>
              {mainInfo.emails.map((email, index) => (
                <h3 key={index}>{email}</h3>
              ))}
            </div>
          </div>
          <div style={{ flex: 2 }}>
            <h1>{mainInfo.name}</h1>
            <h3 style={{ fontSize: "2vh" }}>
              {new Date(mainInfo.createdAt).toLocaleString("ru-RU", options)}
            </h3>
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

export default MyRequestScreen;