import Nav from "./components/Nav";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Schedule from "./pages/Schedule";
import Diary from "./pages/Diary";
import Goal from "./pages/Goal";
import Love from "./pages/Love";

import "./App.css";


function App() {
  return (
    <div className="app">
      <Nav />

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="/love" element={<Love />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;