import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import rrulePlugin from "@fullcalendar/rrule";

import "./Schedule.css";

function Schedule() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedEventId, setSelectedEventId] = useState(null);

  const [hoveredEvent, setHoveredEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    start: "",
    startTime: "",
    end: "",
    endTime: "",
    isAllDay: true,
    category: "학교",

    repeat: "없음",
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // 카테고리 색
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

  // 추가
  const addEvent = () => {
    if (!form.title || !form.start) return;

    let finalStart = form.start;
    let finalEnd = form.end;

    if (!form.isAllDay && form.startTime) {
      finalStart = `${form.start}T${form.startTime}`;
      if (form.end && form.endTime) {
        finalEnd = `${form.end}T${form.endTime}`;
      } else if (form.end) {
        finalEnd = `${form.end}T23:59:59`;
      } else {
        finalEnd = `${form.start}T${form.startTime}`;
      }
    } else if (form.isAllDay) {

      if(!form.end){
        finalEnd = form.start;
      }else{
        finalEnd = form.end;
      }

    }

    let newEvent;

    if (form.repeat === "없음") {
      newEvent = {
        id: Date.now().toString(),
        title: form.title,
        start: finalStart,
        end: finalEnd,
        allDay: form.isAllDay,
        category: form.category,
        repeat: form.repeat,
        backgroundColor: getColor(form.category),
      };
    } else {
      const freqMap = {
        매주: "weekly",
        매월: "monthly",
        매년: "yearly",
      };

      newEvent = {
        id: Date.now().toString(),
        title: form.title,

        rrule: {
          freq: freqMap[form.repeat],
          dtstart: finalStart,

          ...(form.end && {
            until:`${form.end}T23:59:59`
          })
        },

        duration: form.isAllDay ? { days: 1 } : undefined,

        allDay: form.isAllDay,
        category: form.category,
        repeat: form.repeat,
        backgroundColor: getColor(form.category),
      };
    }

    setEvents([...events, newEvent]);

    setForm({
      title: "",
      start: "",
      startTime: "",
      end: "",
      endTime: "",
      isAllDay: true,
      category: "학교",
      repeat: "없음",
    });
  };

  // 삭제
  const deleteEvent = () => {
    setEvents(events.filter((e) => e.id !== selectedEventId));
    setSelectedEventId(null);
  };

  // 수정
  const updateEvent = () => {
    if (!form.title || !form.start) return;


    let finalStart = form.start;
    let finalEnd = form.end;


    if (!form.isAllDay && form.startTime) {
      finalStart = `${form.start}T${form.startTime}`;

      if (form.end && form.endTime) {
        finalEnd = `${form.end}T${form.endTime}`;
      }
    } 
    else if(form.isAllDay){

      if(!form.end){
        finalEnd=form.start;
      }else{
        finalEnd=form.end;
      }

    }


    let updatedEvent;


    if (form.repeat === "없음") {

      updatedEvent = {
        id: selectedEventId,
        title: form.title,
        start: finalStart,
        end: finalEnd,
        allDay: form.isAllDay,
        category: form.category,
        repeat: form.repeat,
        backgroundColor:getColor(form.category)
      };

    } else {

      const freqMap={
        매주:"weekly",
        매월:"monthly",
        매년:"yearly"
      };


      updatedEvent={
        id:selectedEventId,
        title:form.title,

        rrule:{
          freq:freqMap[form.repeat],
          dtstart:finalStart,

          ...(form.end && {
            until:`${form.end}T23:59:59`
          })
        },

        duration:{
          days:1
        },

        allDay:true,
        category:form.category,
        repeat:form.repeat,
        backgroundColor:getColor(form.category)
      };
    }


    setEvents(
      events.map((e)=>
        e.id===selectedEventId
        ? updatedEvent
        : e
      )
    );


    setSelectedEventId(null);

    setForm({
      title:"",
      start:"",
      startTime:"",
      end:"",
      endTime:"",
      isAllDay:true,
      category:"학교",
      repeat:"없음"
    });
  };

  const filteredEvents =
    selectedCategory === "전체"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="schedule-container">
      <h1>일정 관리</h1>

      {/* 카테고리 */}
      <div className="category-filter">
        {["전체", "학교", "친구", "연애", "개인"].map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="schedule-top">
        {/* 달력 */}
        <div className="calendar-section" style={{ position: "relative" }}>
          <FullCalendar
            dayCellDidMount={(info) => {
              info.el.onclick = () => {

                setSelectedEventId(null);

                setForm({
                  title:"",
                  start: info.date.toISOString().split("T")[0],
                  startTime:"",
                  end:"",
                  endTime:"",
                  isAllDay:true,
                  category:"학교",
                  repeat:"없음",
                });

              };
            }}
            plugins={[dayGridPlugin, interactionPlugin, rrulePlugin]}
            locale={koLocale}
            firstDay={0}
            initialView="dayGridMonth"
            events={filteredEvents}
            
              dateClick={(info) => {
                setSelectedEventId(null);

                setForm({
                  title: "",
                  start: info.dateStr,
                  startTime: "",
                  end: "",
                  endTime: "",
                  isAllDay: true,
                  category: "학교",
                  repeat: "없음",
                });
              }}

            height="auto"
            dayMaxEvents={true}
            contentHeight={650}
            eventMouseEnter={(info) => {
              const rect = info.el.getBoundingClientRect();
              const containerRect = info.el
                .closest(".calendar-section")
                .getBoundingClientRect();

              setHoveredEvent({
                title: info.event.title,
                category: info.event.extendedProps.category,
                color: info.event.backgroundColor,
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top - 10,
              });
            }}
            eventMouseLeave={() => {
              setHoveredEvent(null);
            }}
            eventClick={(info) => {
              const e = events.find((ev) => ev.id === info.event.id);

              setSelectedEventId(e.id);

              const hasTimeStart = e.start && String(e.start).includes("T");
              const hasTimeEnd = e.end && String(e.end).includes("T");

              let startDay;
              if(e.rrule){

                startDay = e.rrule.dtstart.split("T")[0];

              }else{

                startDay = String(e.start).split("T")[0];

              }
              const startTime = hasTimeStart
                ? String(e.start).split("T")[1].substring(0, 5)
                : "";

              let endDay = "";
              let endTime = "";

              if (e.end) {
                if (hasTimeEnd) {
                  endDay = String(e.end).split("T")[0];
                  endTime = String(e.end).split("T")[1].substring(0, 5);
                } else {

                  const end = String(e.end);

                  if(end === startDay){
                    endDay="";
                  }else{
                    endDay=end;
                  }

                }
              } else {
                endDay = startDay;
              }

              setForm({
                title: e.title,
                start: startDay,
                startTime: startTime,
                end:
                  e.rrule?.until
                  ? e.rrule.until.split("T")[0]
                  : endDay,
                endTime: endTime,
                isAllDay: e.allDay !== undefined ? e.allDay : !hasTimeStart,
                category: e.category,
                repeat: e.repeat || "없음",
              });
            }}
          />

          {hoveredEvent && (
            <div
              className="custom-tooltip-overlay"
              style={{
                left: `${hoveredEvent.x}px`,
                top: `${hoveredEvent.y}px`,
              }}
            >
              <span
                className="tooltip-badge"
                style={{ backgroundColor: hoveredEvent.color }}
              >
                {hoveredEvent.category}
              </span>
              <div className="tooltip-title">{hoveredEvent.title}</div>
            </div>
          )}
        </div>

        {/* 오른쪽 패널 */}
        <div className="add-section">
          <h3>{selectedEventId ? "일정 수정 / 삭제" : "일정 추가"}</h3>

          <input
            placeholder="제목"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <div className="allday-checkbox-wrapper">
            <label>
              <input
                type="checkbox"
                checked={form.isAllDay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isAllDay: e.target.checked,
                  })
                }
              />
              하루 종일
            </label>
          </div>

          <label>시작일</label>
          <div className="datetime-input-row">
            <input
              type="date"
              value={form.start}
              onChange={(e) =>
                setForm({
                  ...form,
                  start: e.target.value,
                })
              }
            />
            {!form.isAllDay && (
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startTime: e.target.value,
                  })
                }
              />
            )}
          </div>

          <label>종료일</label>
          <div className="datetime-input-row">
            <input
              type="date"
              value={form.end}
              onChange={(e) =>
                setForm({
                  ...form,
                  end: e.target.value,
                })
              }
            />
            {!form.isAllDay && (
              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endTime: e.target.value,
                  })
                }
              />
            )}
          </div>

          <label>반복</label>

          <select
            value={form.repeat}
            onChange={(e) =>
              setForm({
                ...form,
                repeat: e.target.value,
              })
            }
          >
            <option>없음</option>
            <option>매주</option>
            <option>매월</option>
            <option>매년</option>
          </select>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option>학교</option>
            <option>친구</option>
            <option>연애</option>
            <option>개인</option>
          </select>

          {!selectedEventId ? (
            <button onClick={addEvent}>추가하기</button>
          ) : (
            <>
              <button onClick={updateEvent}>수정하기</button>

              <button className="delete-btn" onClick={deleteEvent}>
                삭제하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
