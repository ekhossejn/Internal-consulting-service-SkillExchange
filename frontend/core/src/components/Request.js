import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function Request({ request }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/requests/${request.id}/`);
  };

  return (
      <Card
        className="my-3 p-3 rounded"
        onClick={handleClick}
        style={{ cursor: "pointer", backgroundColor: "var(--bs-light)", maxHeight: "20vh", height: "20vh", overflow: "auto"}}
      >
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                width: "10vh",
                height: "10vh",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid var(--secondary-color)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={request.image}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                }}
              ></img>
            </div>
            <div style={{ width: "60%", marginLeft: "2vw"}}>
              <Card.Title as="h2" style={{fontSize: "22px" }}>{request.name}</Card.Title>
              <h3 style={{fontSize: "14px"}}>{new Date(request.createdAt).toLocaleString('ru-RU', options)}</h3>
            </div>
          </div>
          <h3 style={{fontSize: "17px", marginTop: "1.5vh"}}>{request.text}</h3>
      </Card>
    );
}

export default Request;
