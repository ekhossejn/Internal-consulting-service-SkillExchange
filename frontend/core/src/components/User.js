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
      style={{ cursor: "pointer", backgroundColor: "var(--bs-light)", maxHeight: "20vh", overflow: "auto"}}
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
              src={user.image}
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
            <Card.Title as="h2" style={{fontSize: "22px" }}>{user.name}</Card.Title>
            <h3 style={{fontSize: "17px"}}>{user.rating}</h3>
          </div>
        </div>
    </Card>
  );
}

export default User;
