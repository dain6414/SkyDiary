import { useState, useEffect } from "react";
import "./Todo.css";

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Todo() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [currentDate, setCurrentDate] = useState(
    formatDate(new Date())
  );
  const [viewMode, setViewMode] = useState("day");

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    title: "",
    category: "학교",
    repeat: "하루",
    weekDay: "월",
    monthType: "date",
    monthDate: 1,
    monthWeek: "첫째",
    monthWeekDay: "월",
    onceDate: currentDate
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const resetForm = () => {
    setSelectedTodoId(null);
    setForm({
      title: "",
      category: "학교",
      repeat: "하루",
      weekDay: "월",
      monthType: "date",
      monthDate: 1,
      monthWeek: "첫째",
      monthWeekDay: "월",
      onceDate: currentDate
    });
  };

  const addTodo = () => {
    if (!form.title.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: form.title,
      category: form.category,
      repeat: form.repeat,
      weekDay: form.weekDay,
      monthType: form.monthType,
      monthDate: form.monthDate,
      monthWeek: form.monthWeek,
      monthWeekDay: form.monthWeekDay,
      onceDate: form.onceDate,
      history: {}
    };

    setTodos([...todos, newTodo]);
    resetForm();
  };

  const updateTodo = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === selectedTodoId
          ? {
              ...todo,
              title: form.title,
              category: form.category,

              repeat: form.repeat,
              weekDay: form.weekDay,
              monthType: form.monthType,
              monthDate: form.monthDate,
              monthWeek: form.monthWeek,
              monthWeekDay: form.monthWeekDay,
              onceDate: form.onceDate
            }
          : todo
      )
    );

    resetForm();
  };

  const deleteTodo = () => {
    setTodos(todos.filter((todo) => todo.id !== selectedTodoId));
    resetForm();
  };

  const moveDay = (amount) => {
    if (viewMode === "day") {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + amount);
      setCurrentDate(formatDate(date));
    } else {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + amount);
      setCurrentDate(formatDate(date));
    }
  };

  const toggleComplete = (todoId) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          history: {
            ...todo.history,
            [currentDate]: !todo.history?.[currentDate]
          }
        };
      })
    );
  };

  const getWeekDates = () => {
    const date = new Date(currentDate);
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(formatDate(d));
    }
    return week;
  };

  const weekDates = getWeekDates();

  const getStreak = (todo) => {
    if (!todo.history) return 0;

    let streak = 0;
    let checkDate = new Date();

    const todayStr = formatDate(checkDate);

    if (!todo.history[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = formatDate(checkDate);

      if (todo.history[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getColor = (cat) => {
    switch (cat) {
      case "학교":
        return "#6BA8FF";
      case "친구":
        return "#63D68C";
      case "연애":
        return "#FF8FB8";
      case "개인":
        return "#B28DFF";
      default:
        return "#6BA8FF";
    }
  };

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const today =
    formatDate(new Date())

  const getMonthDaysDetails = () => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay; i++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(i).padStart(2, "0");
      days.push(`${year}-${mm}-${dd}`);
    }

    return days;
  };

  const monthCalendarDays = getMonthDaysDetails();

  const getDayTodos = (dateStr) => {
    if (!dateStr) return [];
    const dName = dayNames[new Date(dateStr).getDay()];
    const dNum = new Date(dateStr).getDate();

    return todos.filter((todo) => {
      const categoryMatch =
        selectedCategory === "전체" ? true : todo.category === selectedCategory;

      if (!categoryMatch) return false;

      if (todo.repeat === "매일") return true;
      if (todo.repeat === "하루") return todo.onceDate === dateStr;
      if (todo.repeat === "매주") return todo.weekDay === dName;
      if (todo.repeat === "매월" && todo.monthType === "date") {
        return Number(todo.monthDate) === dNum;
      }
      if (
        todo.repeat === "매월" &&
        todo.monthType === "weekday"
      ) {

        const date = new Date(dateStr);

        const weekIndex =
          Math.floor((date.getDate() - 1) / 7);

        const weekNames = [
          "첫째",
          "둘째",
          "셋째",
          "넷째",
          "다섯째"
        ];

        const dayName =
          dayNames[date.getDay()];

        return (
          weekNames[weekIndex] === todo.monthWeek &&
          dayName === todo.monthWeekDay
        );
      }
      return false;
    });
  };

  const filteredTodos = getDayTodos(currentDate);

  const formatHeaderDate = () => {
    const date = new Date(currentDate);
    if (viewMode === "day") {
      return currentDate;
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }
  };

  const handleContainerClick = (e) => {
    if (selectedTodoId && !e.target.closest(".todo-card") && !e.target.closest(".todo-form")) {
      resetForm();
    }
  };

  return (
    <div className="todo-container" onClick={handleContainerClick}>
      <h1>할일 관리</h1>

      <div className="category-filter">
        {["전체", "학교", "친구", "연애", "개인"].map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="todo-top">
        <div className="todo-content-area">
          <div className="date-header">
            <div className="view-toggle">
              <button
                className={viewMode === "day" ? "active" : ""}
                onClick={() => setViewMode("day")}
              >
                일별 보기
              </button>
              <button
                className={viewMode === "month" ? "active" : ""}
                onClick={() => setViewMode("month")}
              >
                월별 보기
              </button>
            </div>

            <div className="date-controls">
              <button className="nav-btn" onClick={() => moveDay(-1)}>◀</button>
              <button
                className="today-btn"
                onClick={() => {
                  setCurrentDate(formatDate(new Date()));
                  setViewMode("day");
                }}
              >
                오늘
              </button>
              <h2>{formatHeaderDate()}</h2>
              <button className="nav-btn" onClick={() => moveDay(1)}>▶</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            {viewMode === "month" && (
              <div className="month-calendar-container" style={{ flex: 2 }}>
                <div className="calendar-weekdays">
                  {dayNames.map((name) => (
                    <div key={name}>{name}</div>
                  ))}
                </div>
                <div className="month-grid">
                  {monthCalendarDays.map((date, idx) => {
                    if (!date) {
                      return <div key={`empty-${idx}`} className="month-day empty-day" />;
                    }

                    const dayTodos = getDayTodos(date);
                    const isSelected = date === currentDate;
                    const isToday = date === today;

                    return (
                      <div
                        key={date}
                        className={`month-day
                        ${isSelected ? "active-selected" : ""}
                        ${isToday ? "today-day" : ""} `}
                        onClick={() => setCurrentDate(date)}
                      >
                        <div className="day-number">
                          {new Date(date).getDate()}
                        </div>

                        <div className="mini-todos">
                          {dayTodos.map((t) => {
                            const isCompleted = t.history?.[date] || false;
                            return (
                              <div
                                key={t.id}
                                className={`mini-todo-dot ${isCompleted ? "completed-dot" : "active-dot"}`}
                                style={{ "--dot-color": getColor(t.category) }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="todo-list-section">
              {viewMode === "month" && (
                <h3 style={{ color: "#233b67", marginBottom: "15px", fontSize: "16px" }}>
                  {currentDate} 할일 목록
                </h3>
              )}

              {filteredTodos.length === 0 && (
                <div className="empty-todo">
                  <h3>📅 할일이 없습니다</h3>
                  <p>이 날짜에는 등록된 할일이 없어요.</p>
                </div>
              )}

              {filteredTodos.map((todo) => (
                <div key={todo.id} className="todo-card">
                  <div className="todo-main">
                    <input
                      type="checkbox"
                      checked={todo.history?.[currentDate] || false}
                      disabled={currentDate > today}
                      onChange={() => toggleComplete(todo.id)}
                    />

                    <div
                      className="todo-info"
                      onClick={() => {
                        setExpandedTodoId(expandedTodoId === todo.id ? null : todo.id);
                        setSelectedTodoId(todo.id);
                        setForm({
                          title: todo.title || "",
                          category: todo.category || "학교",
                          repeat: todo.repeat || "하루",

                          weekDay: todo.weekDay || "월",

                          monthType: todo.monthType || "date",

                          monthDate: todo.monthDate || 1,

                          monthWeek: todo.monthWeek || "첫째",

                          monthWeekDay: todo.monthWeekDay || "월",

                          onceDate: todo.onceDate || currentDate
                        });
                      }}
                    >
                      <h3>{todo.title}</h3>
                      <span>
                        {todo.category}
                        {" · "}
                        {todo.repeat === "매일"
                          ? "매일"
                          : todo.repeat === "매주"
                          ? `매주 ${todo.weekDay}요일`
                          : todo.repeat === "매월" && todo.monthType === "date"
                          ? `매월 ${todo.monthDate}일`
                          : todo.repeat === "매월"
                          ? `매월 ${todo.monthWeek}주 ${todo.monthWeekDay}요일`
                          : `하루 · ${todo.onceDate}`}
                      </span>
                    </div>

                    {todo.repeat === "매일" && (
                      <div className="streak">🔥 {getStreak(todo)}일</div>
                    )}
                  </div>

                  {expandedTodoId === todo.id && (
                    <div className="week-history">
                      <div className="week-days">
                        {weekDates.map((date) => {
                          const day = new Date(date).getDate();
                          return <div key={date}>{day}</div>;
                        })}
                      </div>
                      <div className="week-checks">
                        {weekDates.map((date) => (
                          <div
                            key={date}
                            className={todo.history?.[date] ? "week-box done" : "week-box"}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="todo-form">
          <h3>{selectedTodoId ? "할일 수정 / 삭제" : "할일 추가"}</h3>

          <input
            placeholder="할일 제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label>반복</label>
          <select
            value={form.repeat}
            onChange={(e) => setForm({ ...form, repeat: e.target.value })}
          >
            <option>하루</option>
            <option>매일</option>
            <option>매주</option>
            <option>매월</option>
            
          </select>

          {form.repeat === "매주" && (
            <select
              value={form.weekDay}
              onChange={(e) => setForm({ ...form, weekDay: e.target.value })}
            >
              <option>일</option>
              <option>월</option>
              <option>화</option>
              <option>수</option>
              <option>목</option>
              <option>금</option>
              <option>토</option>
            </select>
          )}

          {form.repeat === "매월" && (
            <select
              value={form.monthType}
              onChange={(e) => setForm({ ...form, monthType: e.target.value })}
            >
              <option value="date">날짜로 반복</option>
              <option value="weekday">요일로 반복</option>
            </select>
          )}

          {form.repeat === "매월" && form.monthType === "date" && (
            <input
              type="number"
              min="1"
              max="31"
              value={form.monthDate}
              onChange={(e) => setForm({ ...form, monthDate: e.target.value })}
            />
          )}

          {form.repeat === "매월" && form.monthType === "weekday" && (
            <>
              <select
                value={form.monthWeek}
                onChange={(e) => setForm({ ...form, monthWeek: e.target.value })}
              >
                <option>첫째</option>
                <option>둘째</option>
                <option>셋째</option>
                <option>넷째</option>
                <option>다섯째</option>
              </select>
              <select
                value={form.monthWeekDay}
                onChange={(e) => setForm({ ...form, monthWeekDay: e.target.value })}
              >
                <option>일</option>
                <option>월</option>
                <option>화</option>
                <option>수</option>
                <option>목</option>
                <option>금</option>
                <option>토</option>
              </select>
            </>
          )}

          {form.repeat === "하루" && (
            <input
              type="date"
              value={form.onceDate}
              onChange={(e) => setForm({ ...form, onceDate: e.target.value })}
            />
          )}

          <label>카테고리</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>학교</option>
            <option>친구</option>
            <option>연애</option>
            <option>개인</option>
          </select>

          {!selectedTodoId ? (
            <button onClick={addTodo}>추가하기</button>
          ) : (
            <>
              <button onClick={updateTodo}>수정하기</button>
              <button className="delete-btn" onClick={deleteTodo}>삭제하기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;