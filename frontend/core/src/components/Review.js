import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function Review({ review }) {
  return (
    <Card className="my-3 p-3 rounded" style={{ width: "100%" }}>
      <Card.Body>
        <Card.Title as="h3">{review.text}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default Review;
