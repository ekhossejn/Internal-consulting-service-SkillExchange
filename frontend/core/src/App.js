import React from "react";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";
import Header from "./components/Header";
import SearchRequests from "./components/screens/SearchRequests";
import SearchUsers from "./components/screens/SearchUsers";
import Company from "./components/screens/Company";
import MyRequests from "./components/screens/MyRequests";
import RequestScreen from "./components/screens/RequestScreen";
import MakeRequest from "./components/screens/MakeRequest";
import MyRequestScreen from "./components/screens/MyRequestScreen";
import UserScreen from "./components/screens/UserScreen";
import MakeReview from "./components/screens/MakeReview";
import Settings from "./components/screens/Settings";

function Layout() {
  const location = useLocation();
  const hideHeaderOn = ["/login", "/signup"];
  const showHeader = !hideHeaderOn.includes(location.pathname);
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route exact path="/" element={<Profile />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route
          exact
          path="/search/requests"
          element={<SearchRequests />}
        ></Route>
        <Route exact path="/search/users" element={<SearchUsers />}></Route>
        <Route exact path="/profile/company" element={<Company />}></Route>
        <Route exact path="/profile/requests" element={<MyRequests />}></Route>
        <Route
          exact
          path="/profile/requests/:id"
          element={<MyRequestScreen />}
        ></Route>
        <Route
          exact
          path="/search/requests/:id"
          element={<RequestScreen />}
        ></Route>
        <Route
          exact
          path="/search/users/:id"
          element={<UserScreen />}
        ></Route>
        <Route
          exact
          path="/profile/requests/create"
          element={<MakeRequest />}
        ></Route>
        <Route
          exact
          path="/search/users/:id/comment"
          element={<MakeReview />}
        ></Route>
        <Route
          exact
          path="profile/settings"
          element={<Settings />}
        ></Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
