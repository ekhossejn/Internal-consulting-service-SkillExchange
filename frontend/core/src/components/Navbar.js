import React from 'react'

function Navbar() {
  return (
    <>
    
    <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
  <div className="container-fluid">
    <a class="navbar-brand" href="#">Мои запросы</a>
    <div className="collapse navbar-collapse" id="navbarColor03">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <a className="nav-link active" href="#">Профиль и настройки
            <span className="visually-hidden">(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Моя организация</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Поиск запросов</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Поиск людей</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Выйти</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

    </>
  )
}

export default Navbar
