import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Rating from "./Rating";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

function Review({ review }) {
  return (
    <Card
      className="my-3 p-3 rounded"
      style={{ width: "100%", backgroundColor: "var(--bs-light)",             maxHeight: "20vh",
        height: "20vh",
        overflow: "auto",}}
    >
      <Card.Header style={{ borderBottom: "none" }}>
        <h3>{review.reviewer_name}</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Rating value={review.rating} color="var(--bs-warning)" />
          <span style={{ marginLeft: "8px" }}>
            {new Date(review.createdAt).toLocaleString("ru-RU", options)}
          </span>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ fontSize: "2vh" }}>{review.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Review;
