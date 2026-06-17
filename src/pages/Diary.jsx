import { useState, useEffect } from "react";
import "./Diary.css";
import { HiOutlineSearch } from "react-icons/hi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function Diary() {
  const [viewMode, setViewMode] = useState("view");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [worry, setWorry] = useState("");
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const [selectDiary, setSelectDiary] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [date, setDate] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const solution = [
    "많이 힘들수밖에 없어요!오늘 하루는 푹 쉬고 푹 쉰뒤에 다시 생각해봐요",
    "힘들어도 우리 다음을 위에 버텨봐요",
    "힘들 땐 역시 좋아하는 음식을 먹어야겠져??얼른 먹으러 편의점 털러 가요!!",
    "꼭 지금 당장 해결할 필요는 없잖아요?우리 좀 더 미루고 스스로의 마음을 다독여요",
    "한 번 속 시원하게 마음을 위로해주기 위해 우리 소리를 질러볼까요?",
    "한 번 속 시원하게 마음을 위로해주기 위해 우리 이불을 때려볼까요?",
    "많이 속상했겠어요ㅜㅜ",
    "당신의 영원한 편은 당신 밖에 없어요!자신을 믿으세요",
  ];

  let searchEvent = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  let newWrite = () => {
    console.log("현재:", viewMode);
    setViewMode("write");
  };

  const [diaryList, setDiaryList] = useState(() => {
    const saved = localStorage.getItem("diaries");
    console.log("렌더:", viewMode);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("diaries", JSON.stringify(diaryList));
  }, [diaryList]);

  let dailyDiary = (item) => {
    setSelectDiary(item);
    setViewMode("diary");
  };

  let closeDiary = () => {
    setViewMode("view");
  };

  const filteredList = diaryList.filter((item) => {
    const selectedDateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    const matchesCategory =
      searchCategory === "" ? true : item.newCategory === searchCategory;
    const matchesSearch = item.newTitle
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDate = item.date === selectedDateStr;
    return matchesCategory && matchesSearch && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const saveDiary = (e) => {
    e.preventDefault();

    if (!category || category === "") {
      alert("일기의 카테고리를 알려주세요!");
      return;
    }

    if (!mood || mood === "") {
      alert("오늘의 기분을 알려주세요!");
      return;
    }

    let reply = "";
    if (worry) {
      const randomIndex = Math.floor(Math.random() * solution.length);
      reply = solution[randomIndex];
    }

    const today = new Date();
    const dateString =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const newDiary = {
      id: Date.now(),
      date: dateString,
      newTitle: title,
      newContent: content,
      newWorry: worry,
      newMood: mood,
      replySolution: reply,
      newCategory: category,
    };

    setDiaryList([newDiary, ...diaryList]);

    setTitle("");
    setContent("");
    setViewMode("view");
    setMood("");
    setWorry("");
    setCategory("");
  };

  const updateDiary = (e) => {
    e.preventDefault();

    const updatedList = diaryList.map((item) =>
      item.id === selectDiary.id
        ? {
            ...item,
            newTitle: title,
            newContent: content,
            newMood: mood,
            newCategory: category,
            newWorry: worry,
          }
        : item,
    );

    setDiaryList(updatedList);

    setViewMode("view");

    setTitle("");
    setContent("");
    setMood("");
    setCategory("");
    setWorry("");
  };

  return (
    <div className="diarySection">
      <div className="leftSection">
        <h2 className="title">My Daily Diary</h2>
        <div className="bar">
          <div className="searchSection">
            <input
              className="search"
              value={search}
              onChange={searchEvent}
              placeholder="검색"
            />
            <button type="submit" className="searchBtn">
              <HiOutlineSearch size={22} color="#333" />
            </button>
          </div>

          <button
            className="writeBtn"
            onClick={() => {
              console.log("클릭됨");
              newWrite();
            }}
          >
            일기쓰기
          </button>
        </div>
        <div className="categorySearch">
          <button
            type="button"
            className={`searchAll ${searchCategory === "" ? "search" : ""}`}
            onClick={() => {
              setSearchCategory("");
              setCurrentPage(1);
            }}
          >
            📁 전체
          </button>
          <button
            type="button"
            className={`searchSchool ${searchCategory === "school" ? "search" : ""}`}
            onClick={() => {
              setSearchCategory("school");
              setCurrentPage(1);
            }}
          >
            📚 학교
          </button>
          <button
            type="button"
            className={`searchFriend ${searchCategory === "friend" ? "search" : ""}`}
            onClick={() => {
              setSearchCategory("friend");
              setCurrentPage(1);
            }}
          >
            👥 친구
          </button>
          <button
            type="button"
            className={`searchCouple ${searchCategory === "couple" ? "search" : ""}`}
            onClick={() => {
              setSearchCategory("couple");
              setCurrentPage(1);
            }}
          >
            💕 연애
          </button>
          <button
            type="button"
            className={`searchIndiv ${searchCategory === "indiv" ? "search" : ""}`}
            onClick={() => {
              setSearchCategory("indiv");
              setCurrentPage(1);
            }}
          >
            ⭐ 개인
          </button>
        </div>

        {(viewMode === "write" || viewMode === "edit") && (
          <div className="overLay">
            <form
              className="dailyWrite"
              onSubmit={viewMode === "edit" ? updateDiary : saveDiary}
            >
              <h2 className="dailyTitle">
                {viewMode === "edit" ? "일기 수정" : "일기 작성"}
              </h2>
              <input
                type="text"
                className="TitleInput"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
              />
              <div className="selectSection">
                <p className="selectTitle">오늘의 기분</p>
                <div className="selectList">
                  <button
                    type="button"
                    className={`moodHappy ${mood === "happy" ? "active" : ""}`}
                    onClick={() => {
                      setMood("happy");
                    }}
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    className={`moodSad ${mood === "sad" ? "active" : ""}`}
                    onClick={() => {
                      setMood("sad");
                    }}
                  >
                    😢
                  </button>
                  <button
                    type="button"
                    className={`moodAngry ${mood === "angry" ? "active" : ""}`}
                    onClick={() => {
                      setMood("angry");
                    }}
                  >
                    😡
                  </button>
                  <button
                    type="button"
                    className={`moodSleep ${mood === "sleep" ? "active" : ""}`}
                    onClick={() => {
                      setMood("sleep");
                    }}
                  >
                    😴
                  </button>
                  <button
                    type="button"
                    className={`moodFear ${mood === "fear" ? "active" : ""}`}
                    onClick={() => {
                      setMood("fear");
                    }}
                  >
                    😨
                  </button>
                </div>
              </div>

              <div className="selectSection">
                <p className="selectTitle">카테고리</p>
                <div className="selectList">
                  <button
                    type="button"
                    className={`cateSchool ${category === "school" ? "activity" : ""}`}
                    onClick={() => {
                      setCategory("school");
                    }}
                  >
                    📚 학교
                  </button>
                  <button
                    type="button"
                    className={`cateFriend ${category === "friend" ? "activity" : ""}`}
                    onClick={() => {
                      setCategory("friend");
                    }}
                  >
                    👥 친구
                  </button>
                  <button
                    type="button"
                    className={`cateCouple ${category === "couple" ? "activity" : ""}`}
                    onClick={() => {
                      setCategory("couple");
                    }}
                  >
                    💕 연애
                  </button>
                  <button
                    type="button"
                    className={`cateIndiv ${category === "indiv" ? "activity" : ""}`}
                    onClick={() => {
                      setCategory("indiv");
                    }}
                  >
                    ⭐ 개인
                  </button>
                </div>
              </div>
              <textarea
                className="ContentInput"
                placeholder="오늘 하루는 어땠나요?"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                required
              />
              <input
                type="text"
                className="gomin"
                placeholder="오늘의 고민은 있었나요?"
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
              />

              <div className="buttonSection">
                <button
                  type="button"
                  className="cancleBtn"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setMood("");
                    setCategory("");
                    setViewMode("view");
                  }}
                >
                  취소
                </button>
                <button type="submit" className="saveBtn">
                  {viewMode === "edit" ? "수정하기" : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        )}

        {viewMode === "diary" && selectDiary && (
          <div className="overLay">
            <div className="diary">
              <div className="diaryTop">
                <button className="exit" onClick={closeDiary}>
                  ✕
                </button>
              </div>
              <div className="dailyDiary">
                <div className="cardBar">
                  <span className="diaryDate">{selectDiary.date}</span>
                  <span className={`cardMood ${selectDiary.newMood}`}>
                    {selectDiary.newMood === "happy" && "😊행복"}
                    {selectDiary.newMood === "sad" && "😢슬픔"}
                    {selectDiary.newMood === "angry" && "😡짜증"}
                    {selectDiary.newMood === "sleep" && "😴피곤"}
                    {selectDiary.newMood === "fear" && "😨무서움"}
                  </span>
                </div>
                <div className="titleSection">
                  <h2 className="diaryTitle">{selectDiary.newTitle}</h2>
                  <span className={`cardCategory ${selectDiary.newCategory}`}>
                    {selectDiary.newCategory === "school" && "📚 학교"}
                    {selectDiary.newCategory === "friend" && "👥 친구"}
                    {selectDiary.newCategory === "couple" && "💕 연애"}
                    {selectDiary.newCategory === "indiv" && "⭐ 개인"}
                  </span>
                </div>
                <div className="diaryContent">{selectDiary.newContent}</div>
                <div className="worrySection">
                  <div className="worry">
                    <p>💭 오늘의 고민</p>
                    {selectDiary.newWorry === "" && (
                      <div className="notWorry">오늘의 고민은 없어요!</div>
                    )}
                    {selectDiary.newWorry}
                  </div>
                  <div className="solution">
                    <p>💌 답장</p>
                    {selectDiary.newWorry === "" && (
                      <div className="notWorry">오늘의 고민은 없어요!</div>
                    )}
                    {selectDiary.replySolution}
                  </div>
                </div>
                <div className="diaryAction">
                  <button
                    className="editBtn"
                    onClick={() => {
                      setTitle(selectDiary.newTitle);
                      setContent(selectDiary.newContent);
                      setMood(selectDiary.newMood);
                      setCategory(selectDiary.newCategory);
                      setWorry(selectDiary.newWorry);

                      setViewMode("edit");
                    }}
                  >
                    수정
                  </button>

                  <button
                    className="deleteBtn"
                    onClick={() => {
                      if (window.confirm("삭제하시겠습니까?")) {
                        setDiaryList(
                          diaryList.filter(
                            (item) => item.id !== selectDiary.id,
                          ),
                        );

                        setViewMode("view");
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dailyContainer">
          <div className="dailyList">
            {filteredList.length === 0 && <div>쓰여진 일기가 없어요!</div>}
            {currentItems.map((item) => (
              <div
                className={`diaryCard ${item.newMood}`}
                key={item.id}
                onClick={() => dailyDiary(item)}
              >
                <div className="cardBar">
                  <span className="cardDate">{item.date}</span>
                  <span className={`cardMood ${item.newMood}`}>
                    {item.newMood === "happy" && "😊행복"}
                    {item.newMood === "sad" && "😢슬픔"}
                    {item.newMood === "angry" && "😡짜증"}
                    {item.newMood === "sleep" && "😴피곤"}
                    {item.newMood === "fear" && "😨무서움"}
                  </span>
                </div>
                <h3 className="cardTitle">{item.newTitle}</h3>
                <span className={`cardCategory ${item.newCategory}`}>
                  {item.newCategory === "school" && "📚 학교"}
                  {item.newCategory === "friend" && "👥 친구"}
                  {item.newCategory === "couple" && "💕 연애"}
                  {item.newCategory === "indiv" && "⭐ 개인"}
                </span>
                <div
                  className="cardWorrySection"
                  style={{
                    visibility: item.newWorry !== "" ? "visible" : "hidden",
                  }}
                >
                  <p className="cardWorry">💭 고민 있음</p>
                  <p className="msg">💌 답장을 보려면 카드를 클릭!</p>
                </div>
              </div>
            ))}
          </div>

          {filteredList.length > 0 && (
            <div className="pagination">
              <button
                className="pageMoveBtn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`pageNumber ${currentPage === number ? "active" : ""}`}
                >
                  {number}
                </button>
              ))}
              <button
                className="pageMoveBtn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="rightSection">
        <div className="todayMood">
          {(() => {
            const todayStr = (() => {
              const today = new Date();
              return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
            })();

            const todayDiary = diaryList.find((item) => item.date === todayStr);

            if (!todayDiary) {
              return (
                <div className="moodInfo">
                  <p className="moodTitle">오늘의 기분</p>
                  <div className="moodDisplay">
                    <p className="moodEmoji">🤔</p>
                    <p className="moodText">작성된 일기가 없어요</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="moodInfo">
                <p className="moodTitle">오늘의 기분</p>
                <div className="moodDisplay">
                  <p className="moodEmoji">
                    {todayDiary.newMood === "happy" && "😊"}
                    {todayDiary.newMood === "sad" && "😢"}
                    {todayDiary.newMood === "angry" && "😡"}
                    {todayDiary.newMood === "sleep" && "😴"}
                    {todayDiary.newMood === "fear" && "😨"}
                  </p>
                  <p className={`moodText ${todayDiary.newMood}`}>
                    {todayDiary.newMood === "happy" && "행복해요"}
                    {todayDiary.newMood === "sad" && "슬퍼요"}
                    {todayDiary.newMood === "angry" && "짜증나요"}
                    {todayDiary.newMood === "sleep" && "피곤해요"}
                    {todayDiary.newMood === "fear" && "두려워요"}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
        <div className="calenderSection">
          <FullCalendar
            key={date.toString()}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            dateClick={(info) => {
              setDate(new Date(info.dateStr + "T00:00:00"));
              setCurrentPage(1);
            }}
            dayCellClassNames={(arg) => {
              const selectedDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              const cellDateStr = `${arg.date.getFullYear()}-${String(arg.date.getMonth() + 1).padStart(2, "0")}-${String(arg.date.getDate()).padStart(2, "0")}`;
              return cellDateStr === selectedDateStr
                ? ["my-selected-date"]
                : [];
            }}
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "today next",
            }}
            height="100%"
            fixedWeekCount={false}
          />
        </div>
      </div>
    </div>
  );
}
export default Diary;
