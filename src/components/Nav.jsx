import { Link } from "react-router-dom";

import logo from "./../assets/logo.png";
import todo from "./../assets/todo.png";
import daily from "./../assets/daily.png";
import diary from "./../assets/diary.png";
import home from "./../assets/home.png";

import "./Nav.css";

function Nav() {
  return (
    <div className="nav">
      <div className="logo">
        <img src={logo} alt="logo" className="skyLogo" />
      </div>

      <ul>
        <li>
          <Link to="/" className="navLink">
            <img src={home} alt="홈" className="navIcon" />홈
          </Link>
        </li>

        <li>
          <Link to="/todo" className="navLink">
            <img src={todo} alt="할일" className="navIcon" />
            할일
          </Link>
        </li>

        <li>
          <Link to="/schedule" className="navLink">
            <img src={daily} alt="일정관리" className="navIcon" />
            일정
          </Link>
        </li>

        <li>
          <Link to="/diary" className="navLink">
            <img src={diary} alt="일기" className="navIcon" />
            일기
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
