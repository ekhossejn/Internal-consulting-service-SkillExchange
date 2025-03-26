import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Rating from "./Rating";

function Review({ review }) {
  return (
    <Card className="my-3 p-3 rounded" style={{ width: "100%", backgroundColor: "var(--bs-light)"}}>
      <Card.Header style={{ borderBottom: "none" }}>         <Rating value={review.rating} color="var(--bs-warning)" />
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ fontSize: "2.5vh" }}>{review.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Review;
