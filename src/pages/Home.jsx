import "./Home.css";
import { useMemo } from "react";


// 날짜 포맷 함수
const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Home() {
  // 오늘 날짜
  const today = new Date();

  const todayStr = formatDate(today);

  const diaries = JSON.parse(localStorage.getItem("diaries")) || [];

  const todayDiary = diaries.find((diary) => diary.date === todayStr);

  // 현재 월
  const currentMonth = today.getMonth() + 1;

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const lastDate = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push(i);
  }

  // 일정 불러오기
  const events = JSON.parse(localStorage.getItem("events")) || [];

  // 할일 불러오기
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  // 오늘 일정 필터링
  const todayDate = formatDate(new Date());

  const todayEvents = events.filter((event) => {

    // 일반 일정
    if (event.start) {
      const start = event.start.split("T")[0];

      const end = event.end
        ? event.end.split("T")[0]
        : start;

      return todayDate >= start && todayDate < end;
    }

    // 반복 일정
    if (event.rrule) {

      const repeatStart = event.rrule.dtstart.split("T")[0];

      const startDate = new Date(repeatStart);
      const currentDate = new Date(todayDate);

      // 시작일 이전이면 표시 안함
      if (currentDate < startDate) {
        return false;
      }

      // 매주
      if (event.repeat === "매주") {
        return currentDate.getDay() === startDate.getDay();
      }

      // 매월
      if (event.repeat === "매월") {
        return currentDate.getDate() === startDate.getDate();
      }

      // 매년
      if (event.repeat === "매년") {
        return (
          currentDate.getMonth() === startDate.getMonth() &&
          currentDate.getDate() === startDate.getDate()
        );
      }
    }

    return false;
  });

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const todayName = dayNames[new Date(todayStr).getDay()];

  const todayNum = new Date(todayStr).getDate();

  // 오늘 할일 필터링
  const todayTodos = todos.filter((todo) => {
    if (todo.repeat === "매일") return true;

    if (todo.repeat === "하루") return todo.onceDate === todayStr;

    if (todo.repeat === "매주") return todo.weekDay === todayName;

    if (todo.repeat === "매월" && todo.monthType === "date") {
      return Number(todo.monthDate) === todayNum;
    }

    return false;
  });

  // 완료 개수
  const completedCount = todayTodos.filter(
    (todo) => todo.history?.[todayStr],
  ).length;

  const progress =
    todayTodos.length === 0
      ? 0
      : Math.round((completedCount / todayTodos.length) * 100);

  return (
    <div className="home-container">
      {/* 인사말 */}
      <div className="welcome-section">
        <h1>안녕하세요 ☁️</h1>

        <p>{todayStr}</p>
      </div>

      {/* 상단 카드 */}
      <div className="top-cards">
        {/* 기분 */}
        <div className="card mood-card">
          <h3>오늘의 기분</h3>

          <div className="mood-circle">
            {todayDiary?.newMood === "happy" && "😊"}
            {todayDiary?.newMood === "sad" && "😢"}
            {todayDiary?.newMood === "angry" && "😡"}
            {todayDiary?.newMood === "sleep" && "😴"}
            {todayDiary?.newMood === "fear" && "😨"}

            {!todayDiary && "🤔"}
          </div>

          <h2>{todayDiary ? todayDiary.newTitle : "오늘 일기가 없어요"}</h2>

          <p>{todayDiary ? todayDiary.newCategory : "일기를 작성해보세요"}</p>
        </div>
        {/* 오늘 일정 */}
        <div className="card schedule-card">
          <div className="card-header">
            <h3>오늘 일정</h3>
            <span>{todayEvents.length}건</span>
          </div>

          {todayEvents.length === 0 ? (
            <p>오늘 일정이 없습니다.</p>
          ) : (
            todayEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="home-schedule-card">
                <span className={`category-badge ${event.category}`}>
                  {event.category}
                </span>

                {event.title}
              </div>
            ))
          )}
        </div>

        {/* 오늘 할일 */}
        <div className="card todo-card">
          <div className="card-header">
            <h3>오늘 할 일</h3>

            <span>{todayTodos.length}개</span>
          </div>

          {todayTodos.length === 0 ? (
            <p>오늘 할일이 없습니다.</p>
          ) : (
            todayTodos.map((todo) => (
              <label key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.history?.[todayStr] || false}
                  onChange={() => {
                    const updatedTodos = todos.map((t) =>
                      t.id === todo.id
                        ? {
                            ...t,
                            history: {
                              ...t.history,
                              [todayStr]: !t.history?.[todayStr],
                            },
                          }
                        : t,
                    );

                    localStorage.setItem("todos", JSON.stringify(updatedTodos));

                    window.location.reload();
                  }}
                />

                <span className={`category-badge ${todo.category}`}>
                  {todo.category}
                </span>

                {todo.title}
              </label>
            ))
          )}

        </div>

        {/* 달력 */}
        <div className="card calendar-card">
          <h3>{currentMonth}월</h3>

          <div className="mini-calendar">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={
                  day === today.getDate()
                    ? "calendar-day today"
                    : "calendar-day"
                }
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오늘의 한줄 일기 */}
      <div className="one-line-diary">
        <h3>✏️ 오늘의 한줄 일기</h3>

        <p>
          {todayDiary
            ? todayDiary.newContent.substring(0, 80)
            : "작성된 일기가 없습니다."}
        </p>
      </div>

      {/* 카테고리 */}
      <div className="category-section">
        <h3>카테고리 바로가기</h3>

        <div className="category-cards">
          <div className="category-card school">
            <h4>학교</h4>

            <p>
              일정 {events.filter((e) => e.category === "학교").length}개 | 할일{" "}
              {todos.filter((t) => t.category === "학교").length}개
            </p>
          </div>

          <div className="category-card friend">
            <h4>친구</h4>

            <p>
              일정 {events.filter((e) => e.category === "친구").length}개 | 할일{" "}
              {todos.filter((t) => t.category === "친구").length}개
            </p>
          </div>

          <div className="category-card love">
            <h4>연애</h4>

            <p>
              일정 {events.filter((e) => e.category === "연애").length}개 | 할일{" "}
              {todos.filter((t) => t.category === "연애").length}개
            </p>
          </div>

          <div className="category-card personal">
            <h4>개인</h4>

            <p>
              일정 {events.filter((e) => e.category === "개인").length}개 | 할일{" "}
              {todos.filter((t) => t.category === "개인").length}개
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
