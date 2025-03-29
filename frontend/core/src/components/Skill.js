import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function Skill({ skill }) {
  return (
    <div style={{ padding: "0.5rem" }} >
     <button type="button" class="btn btn-primary disabled">{skill.name}</button>
    </div>
  );
}

export default Skill;
