import React from "react";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";
import Header from "./components/Header";
import SearchRequests from "./components/screens/SearchRequests";
import SearchUsers from "./components/screens/SearchUsers";
import Company from "./components/screens/Company";
import MyRequests from "./components/screens/MyRequests";
import RequestScreen from "./components/screens/RequestScreen";

  
export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Profile />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signup" element={<Signup />}></Route>
          <Route exact path="/search/requests" element={<SearchRequests />}></Route>
          <Route exact path="/search/users" element={<SearchUsers />}></Route>
          <Route exact path="/profile/company" element={<Company />}></Route>
          <Route exact path="/profile/requests" element={<MyRequests />}></Route>
          <Route exact path="/profile/requests/:id" element={<RequestScreen />}></Route>
        </Routes>
      </Router>
    </>
  );
}
