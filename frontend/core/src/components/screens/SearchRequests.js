import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col } from "react-bootstrap";

function SearchRequests() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    async function fetchrequests() {
      const {data} = await axios.get("/profile/requests");
      setRequests(data);
    }
    fetchrequests();
  }, []);
  return (
    <Container>
      <br />
      <h1>Запросы</h1>
      <Row>
        {requests.map((request)=>(
            <Col key={request.id} sm={12} md = {6} lg={4} xl={3}>
            <h3>{request.name}</h3>
            <h6>{request.text}</h6>
            <p>{request.createdAt}</p>
            <p>{request.author}</p>
            </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SearchRequests;
