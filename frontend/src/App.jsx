import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Library from "./Library.jsx";
import Groups from "./Groups.jsx"; // जर फाईल StudyGroups.jsx असेल तर ही ओळ वापरा
import Notifications from "./Notifications.jsx";
import Donate from "./Donate.jsx";
import Subscriptions from "./Subscriptions.jsx";
import Shop from "./Shop.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<Library />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Routes>
      </main>
    </>
  );
}