import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function Skill({ skill }) {
  return (
    <div className="my-3 p-3 rounded" >
     <button type="button" class="btn btn-primary disabled">{skill.name}</button>
    </div>
  );
}

export default Skill;
