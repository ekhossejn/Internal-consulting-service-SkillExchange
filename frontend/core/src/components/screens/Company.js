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
        setError(error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisationInfo();
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error]);

  return (
    <Container>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>{mainInfo.name}</h1>
        <h1>{mainInfo.domain}</h1>
        <h1>{mainInfo.description}</h1>
      </div>
    </Container>
  );
}

export default Company;
