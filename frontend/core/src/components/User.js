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
      style={{ cursor: "pointer", backgroundColor: "var(--bs-light)", height: "15vh"}}
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
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--secondary-color)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
            <Card.Title as="h3" style={{ marginLeft: "2vw" }}>{user.name}</Card.Title>
          </div>
        </div>
    </Card>
  );
}

export default User;
