import { useEffect, useState } from "react";
import {
  GPA_TERMS,
  GRADES,
  MY_COURSES,
  REGISTRATION_COURSES
} from "../../data";
import { useApp } from "../../context/AppContext";
import { Meter, Panel, PanelHead } from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { classNames, downloadCsv } from "../../lib/format";

const TABS = [
  { id: "courses", label: "My courses" },
  { id: "registration", label: "Registration" },
  { id: "grades", label: "Grades" }
];

const GRADE_TONES = {
  A: "success",
  "A–": "success",
  "B+": "info",
  "B": "info",
  IP: "warning"
};

export default function StudentCourses({ initialTab = "courses" }) {
  const { toast } = useApp();
  const [tab, setTab] = useState(TABS.some((item) => item.id === initialTab) ? initialTab : "courses");
  const [registration, setRegistration] = useState(REGISTRATION_COURSES);

  useEffect(() => {
    if (TABS.some((item) => item.id === initialTab)) setTab(initialTab);
  }, [initialTab]);

  const selected = registration.filter((course) => course.selected);
  const selectedCredits = selected.reduce((sum, course) => sum + course.credits, 0);
  const creditCap = 18;

  const toggleRegistration = (course) => {
    if (!course.selected) {
      if (selectedCredits + course.credits > creditCap) {
        toast(`You can plan up to ${creditCap} credits this term. Drop a course first.`, "danger");
        return;
      }
      if (course.enrolled >= course.capacity) {
        toast(`${course.code} is full. Choose another elective.`, "danger");
        return;
      }
      setRegistration((current) =>
        current.map((item) => (item.code === course.code ? { ...item, selected: true } : item))
      );
      toast(`${course.code} added to your Spring 2027 plan.`, "success");
    } else {
      setRegistration((current) =>
        current.map((item) => (item.code === course.code ? { ...item, selected: false } : item))
      );
      toast(`${course.code} removed from your plan.`, "info");
    }
  };

  const downloadTranscript = () => {
    const rows = [
      ["Deborah University — unofficial transcript"],
      ["Code", "Course", "Term", "Credits", "Grade", "Points"],
      ...GRADES.map((grade) => [
        grade.code,
        grade.title,
        grade.term,
        grade.credits,
        grade.grade,
        grade.points.toFixed(1)
      ])
    ];
    downloadCsv("deborah-transcript.csv", rows);
    toast("Unofficial transcript downloaded.", "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="book" /> Academic record
          </p>
          <h1>My courses</h1>
          <p className="page-sub">
            Everything you are studying this term, plus registration and results.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={() => window.print()}>
            <Icon name="print" /> Print
          </button>
          <button className="btn btn--primary" type="button" onClick={downloadTranscript}>
            <Icon name="download" /> Transcript
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Course sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            className={classNames("tab", tab === item.id && "is-active")}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <section
          className="tab-panel is-active"
          id="panel-courses"
          role="tabpanel"
          aria-labelledby="tab-courses"
        >
          <div className="results-line">
            <span>
              <strong>{MY_COURSES.length}</strong> courses · 18 credits this term
            </span>
            <span>Fall 2026 · Week 9</span>
          </div>
          <div className="my-course-grid">
            {MY_COURSES.map((course) => (
              <article className="my-course" key={course.code}>
                <div className="my-course-top">
                  <span className="course-code">{course.code}</span>
                  <span
                    className={classNames(
                      "course-grade",
                      `course-grade--${GRADE_TONES[course.grade] || "info"}`
                    )}
                  >
                    {course.grade}
                  </span>
                </div>
                <h2>{course.title}</h2>
                <p className="course-instructor-line">
                  <Icon name="user" /> {course.instructor}
                </p>
                <div className="course-meta">
                  <span>
                    <Icon name="calendar" /> {course.schedule}
                  </span>
                  <span>
                    <Icon name="map-pin" /> {course.room}
                  </span>
                </div>
                <div className="course-progress">
                  <div className="course-progress-top">
                    <span>Course progress</span>
                    <strong>{course.progress}%</strong>
                  </div>
                  <Meter value={course.progress} label={`${course.title} progress`} />
                </div>
                <div className="my-course-foot">
                  <button
                    className="panel-link"
                    type="button"
                    onClick={() => toast(`Course materials opened for ${course.code}.`, "info")}
                  >
                    Course materials <Icon name="arrow-right" />
                  </button>
                  <span>{course.credits} credits</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "registration" && (
        <section
          className="tab-panel is-active"
          id="panel-registration"
          role="tabpanel"
          aria-labelledby="tab-registration"
        >
          <div className="reg-summary">
            <div>
              <h2>Spring 2027 registration</h2>
              <p>Your window opens Tuesday, 3 November at 09:00. Plan up to 18 credits now.</p>
            </div>
            <div className="reg-credits">
              <div className="reg-credits-top">
                <strong>
                  {selectedCredits} / {creditCap} credits
                </strong>
                <span>
                  {selected.length} course{selected.length === 1 ? "" : "s"} selected
                </span>
              </div>
              <Meter
                value={(selectedCredits / creditCap) * 100}
                tone="gold"
                label={`${selectedCredits} of ${creditCap} credits planned`}
              />
            </div>
          </div>

          <Panel flush>
            <PanelHead
              title="Available courses"
              subtitle="Seat counts update as students register"
              actions={<span className="tag">Spring 2027</span>}
            />
            <div className="table-scroll">
              <table className="data-table reg-table data-table--cards">
                <thead>
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col">Instructor</th>
                    <th scope="col">Schedule</th>
                    <th scope="col">Credits</th>
                    <th scope="col">Availability</th>
                    <th scope="col">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registration.map((course) => {
                    const fill = Math.round((course.enrolled / course.capacity) * 100);
                    const seats = course.capacity - course.enrolled;
                    return (
                      <tr key={course.code}>
                        <td className="is-primary">
                          <strong>{course.title}</strong>
                          <div className="td-muted">{course.code}</div>
                        </td>
                        <td className="td-muted" data-label="Instructor">{course.instructor}</td>
                        <td className="schedule-cell td-muted td-nowrap" data-label="Schedule">{course.schedule}</td>
                        <td className="credits-cell" data-label="Credits">{course.credits}</td>
                        <td data-label="Availability">
                          <div className="seat-bar">
                            <Meter
                              value={fill}
                              tone={fill >= 90 ? "danger" : fill >= 75 ? "gold" : ""}
                              label={`${course.code} seat availability`}
                            />
                            <span>{seats} left</span>
                          </div>
                        </td>
                        <td className="td-actions">
                          <button
                            className={classNames(
                              "btn btn--sm",
                              course.selected ? "btn--ghost" : "btn--primary"
                            )}
                            type="button"
                            onClick={() => toggleRegistration(course)}
                          >
                            {course.selected ? "Drop" : "Register"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <p className="table-info">
                Registration changes are saved to your plan automatically.
              </p>
              <span className="panel-note">
                <Icon name="info" /> You can change this plan until 20 November.
              </span>
            </div>
          </Panel>
        </section>
      )}

      {tab === "grades" && (
        <section
          className="tab-panel is-active"
          id="panel-grades"
          role="tabpanel"
          aria-labelledby="tab-grades"
        >
          <div className="grade-summary">
            <div className="grade-stat grade-stat--highlight">
              <span>Term GPA</span>
              <strong>3.72</strong>
              <small>Fall 2026 · in progress</small>
            </div>
            <div className="grade-stat">
              <span>Cumulative GPA</span>
              <strong>3.64</strong>
              <small>Across 96 graded credits</small>
            </div>
            <div className="grade-stat">
              <span>Credits earned</span>
              <strong>96</strong>
              <small>24 remaining for graduation</small>
            </div>
          </div>

          <Panel flush>
            <PanelHead
              title="Recent results"
              subtitle="Your last five completed courses"
              actions={
                <button className="panel-link" type="button" onClick={downloadTranscript}>
                  Download CSV <Icon name="download" />
                </button>
              }
            />
            <div className="table-scroll">
              <table className="data-table grades-table data-table--cards">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Course</th>
                    <th scope="col">Term</th>
                    <th scope="col">Credits</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADES.map((grade) => (
                    <tr key={`${grade.code}-${grade.term}`}>
                      <td className="td-muted td-nowrap" data-label="Code">{grade.code}</td>
                      <td className="is-primary">{grade.title}</td>
                      <td className="td-muted td-nowrap" data-label="Term">{grade.term}</td>
                      <td data-label="Credits">{grade.credits}</td>
                      <td data-label="Grade">
                        <span
                          className={classNames(
                            "grade-letter",
                            `grade-letter--${GRADE_TONES[grade.grade] || "info"}`
                          )}
                        >
                          {grade.grade}
                        </span>
                      </td>
                      <td className="td-strong" data-label="Points">{grade.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <p className="table-info">
                This is an unofficial record. Official transcripts are issued by the Registrar.
              </p>
              <button
                className="panel-link"
                type="button"
                onClick={() => toast("Official transcript request opened.", "info")}
              >
                Request official copy <Icon name="arrow-up-right" />
              </button>
            </div>
          </Panel>
        </section>
      )}

      {tab === "grades" && (
        <Panel className="gpa-panel">
          <PanelHead title="GPA trend" subtitle="A steady climb across five terms" plain />
          <div className="gpa-terms">
            {GPA_TERMS.map((term) => (
              <div key={term.label}>
                <span>{term.label}</span>
                <strong>{term.value.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}
