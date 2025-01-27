import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";

function Profile() {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    async function fetchdocuments() {
      const {data} = await axios.get("/profile/documents");
      setDocuments(data);
    }
    fetchdocuments();
  }, []);
  return (
    <Container>
      <br />
      <h1>Мой профиль</h1>
      <Row>
        {documents.map((document)=>(
            <Col key={document.id} sm={12} md = {6} lg={4} xl={3}>
              <Card classname="my-3 p-3 rounded">
              <img src={document.image} alt="" />
              </Card>
              <br/>
            </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Profile;
