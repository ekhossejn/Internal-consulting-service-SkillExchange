import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

function Header() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate("/login")
  };

  return (
    <Navbar className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
      <div className="container-fluid">
        <Nav.Link as={Link} to="/profile/requests" className="navbar-brand">
          Мои запросы
        </Nav.Link>
        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Nav.Link as={Link} to="/profile" className="nav-link active">
                Профиль и настройки
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link as={Link} to="/profile/company" className="nav-link">
                Моя организация
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link as={Link} to="/search/requests" className="nav-link">
                Поиск запросов
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link as={Link} to="/search/users" className="nav-link">
                Поиск людей
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link className="nav-link" onClick={logoutHandler}>
                Выйти
              </Nav.Link>
            </li>
          </ul>
        </div>
      </div>
    </Navbar>
  );
}

export default Header;
