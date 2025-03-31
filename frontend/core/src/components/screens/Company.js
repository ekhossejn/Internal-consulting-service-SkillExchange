import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";

function Company() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo?.access;
  const [mainInfo, setMainInfo] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState(200);

  useEffect(() => {
    const fetchOrganisationInfo = async () => {
      setLoading(true);
      try {
        const { data: mainData } = await axios.get(`/profile/company/get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMainInfo(mainData);
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось войти, попробуйте позднее.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisationInfo();
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30vh"
          }}
        >
          <h1>{mainInfo.name}</h1>
          <h3>{mainInfo.domain}</h3>
          <h3>{mainInfo.description}</h3>
        </div>
      )}
    </Container>
  );
}

export default Company;
