import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function User({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/users/${user.id}/`);
  };

  return (
    <Card
      className="my-3 p-3 rounded"
      onClick={handleClick}
      style={{ cursor: "pointer", backgroundColor: "var(--bs-light)", height: "15vh" }}
    >
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              width: "min(10vh, 10vw)",
              height: "min(10vh, 10vw)",
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
              src={user.image}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            ></img>
          </div>
          <div style={{ flex: 2 }}>
            <Card.Title as="h3" style={{ marginLeft: "1vw" }}>{user.name}</Card.Title>
          </div>
        </div>
    </Card>
  );
}

export default User;
