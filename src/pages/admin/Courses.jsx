import { useMemo, useState } from "react";
import { COURSES, DEPARTMENTS } from "../../data";
import { useApp } from "../../context/AppContext";
import {
  Avatar,
  EmptyState,
  Field,
  Meter,
  MiniStat,
  Modal,
  StatusBadge
} from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { classNames, number } from "../../lib/format";

const emptyCourse = {
  code: "",
  title: "",
  department: "Computing",
  instructor: "",
  capacity: "60",
  schedule: "",
  room: "",
  status: "Draft"
};

export default function AdminCourses() {
  const { toast, navigate } = useApp();
  const [courses, setCourses] = useState(COURSES);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyCourse);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        `${course.code} ${course.title} ${course.instructor} ${course.department}`
          .toLowerCase()
          .includes(search);
      const matchesDepartment = department === "All" || course.department === department;
      const matchesStatus =
        status === "all" || course.status.toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [courses, query, department, status]);

  const active = courses.filter((course) => course.status === "Active").length;
  const drafts = courses.filter((course) => course.status === "Draft").length;
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const averageClass = Math.round(
    courses.reduce((sum, course) => sum + course.capacity, 0) / Math.max(1, courses.length)
  );

  const resetFilters = () => {
    setQuery("");
    setDepartment("All");
    setStatus("all");
  };

  const openModal = () => {
    setForm(emptyCourse);
    setErrors({});
    setModalOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submitCourse = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.code.trim()) nextErrors.code = "Course code is required.";
    else if (courses.some((course) => course.code.toLowerCase() === form.code.trim().toLowerCase())) {
      nextErrors.code = "A course with this code already exists.";
    }
    if (!form.title.trim()) nextErrors.title = "Course title is required.";
    if (!form.instructor.trim()) nextErrors.instructor = "Lead instructor is required.";
    if (!form.schedule.trim()) nextErrors.schedule = "Schedule is required.";
    if (!form.room.trim()) nextErrors.room = "Room is required.";
    if (!form.capacity || Number(form.capacity) < 1) nextErrors.capacity = "Enter a valid capacity.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const newCourse = {
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      department: form.department,
      instructor: form.instructor.trim(),
      capacity: Number(form.capacity),
      enrolled: 0,
      schedule: form.schedule.trim(),
      room: form.room.trim(),
      status: form.status,
      credits: 3
    };
    setCourses((current) => [newCourse, ...current]);
    setQuery("");
    setDepartment("All");
    setStatus("all");
    setModalOpen(false);
    toast(`${newCourse.code} added to the catalogue as ${newCourse.status.toLowerCase()}.`, "success");
  };

  const toggleCourse = (code) => {
    const currentCourse = courses.find((course) => course.code === code);
    if (!currentCourse) return;
    const nextStatus = currentCourse.status === "Active" ? "Draft" : "Active";
    setCourses((current) =>
      current.map((course) => (course.code === code ? { ...course, status: nextStatus } : course))
    );
    toast(`${code} is now ${nextStatus.toLowerCase()}.`, "info");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="book" /> Academic operations
          </p>
          <h1>Course catalogue</h1>
          <p className="page-sub">
            Manage capacity, teaching teams and publishing status across every tech department.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={() => navigate("/admin")}>
            <Icon name="chart" /> Enrolment report
          </button>
          <button className="btn btn--primary" type="button" onClick={openModal}>
            <Icon name="plus" /> New course
          </button>
        </div>
      </div>

      <div className="mini-stats" aria-label="Course statistics">
        <MiniStat icon="book" value={active} label="Active courses" />
        <MiniStat icon="users" tone="mint" value={number(totalEnrolled)} label="Total enrolments" />
        <MiniStat icon="chart" tone="gold" value={averageClass} label="Average capacity" />
        <MiniStat icon="edit" tone="violet" value={drafts} label="Courses in draft" />
      </div>

      <div className="toolbar" role="search" aria-label="Filter courses">
        <label className="search-input">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search course code, title or instructor…"
            aria-label="Search courses"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <span className="toolbar-divider" aria-hidden="true" />
        <label className="sr-only" htmlFor="course-status">
          Status
        </label>
        <select
          className="select"
          id="course-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <button className="btn btn--ghost btn--sm" type="button" onClick={resetFilters}>
          Reset
        </button>
        <div className="chips" role="group" aria-label="Filter by department">
          <button
            className={classNames("chip", department === "All" && "is-active")}
            type="button"
            onClick={() => setDepartment("All")}
          >
            All
          </button>
          {DEPARTMENTS.map((item) => (
            <button
              key={item}
              className={classNames("chip", department === item && "is-active")}
              type="button"
              onClick={() => setDepartment(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="results-line">
        <span>
          <strong>{filtered.length}</strong> of <strong>{courses.length}</strong> courses
        </span>
        <span>Fall 2026 · catalogue updated today</span>
      </div>

      {filtered.length ? (
        <section className="course-grid" aria-label="Courses">
          {filtered.map((course) => {
            const fill = Math.round((course.enrolled / course.capacity) * 100);
            const meterTone = fill >= 90 ? "danger" : fill >= 75 ? "gold" : "";
            return (
              <article className="course-card" key={course.code}>
                <div className="course-card-top">
                  <span className="course-code">{course.code}</span>
                  <StatusBadge status={course.status} />
                </div>
                <div className="course-card-body">
                  <h2>{course.title}</h2>
                  <p className="course-dept">{course.department}</p>
                  <div className="course-meta">
                    <span>
                      <Icon name="calendar" /> {course.schedule}
                    </span>
                    <span>
                      <Icon name="map-pin" /> {course.room}
                    </span>
                  </div>
                  <div className="course-instructor">
                    <Avatar name={course.instructor} size="xs" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="course-enrolment">
                    <div className="course-enrolment-top">
                      <span>Enrolment</span>
                      <strong>
                        {course.enrolled} / {course.capacity}
                      </strong>
                    </div>
                    <Meter value={fill} tone={meterTone} label={`${course.title} enrolment`} />
                  </div>
                </div>
                <div className="course-card-foot">
                  <button
                    className={classNames("switch", course.status === "Active" && "is-on")}
                    type="button"
                    role="switch"
                    aria-checked={course.status === "Active"}
                    aria-label={`Toggle ${course.title} publishing status`}
                    onClick={() => toggleCourse(course.code)}
                  >
                    <span />
                  </button>
                  <span className="switch-label">{course.status}</span>
                  <span className="course-credits">{course.credits} credits</span>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="panel">
          <EmptyState
            icon="book"
            title="No courses found"
            text="Try another department, status or search term."
            action={
              <button className="btn btn--ghost btn--sm" type="button" onClick={resetFilters}>
                Clear filters
              </button>
            }
          />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create a course"
        subtitle="Add a new offering to the Fall 2026 catalogue."
        footer={
          <>
            <button className="btn btn--ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit" form="new-course-form">
              <Icon name="plus" /> Create course
            </button>
          </>
        }
      >
        <form id="new-course-form" onSubmit={submitCourse} noValidate>
          <div className="form-grid">
            <Field label="Course code" htmlFor="course-code" required error={errors.code}>
              <input
                className="input"
                id="course-code"
                type="text"
                placeholder="e.g. CSC 420"
                value={form.code}
                onChange={(event) => updateForm("code", event.target.value)}
                aria-invalid={Boolean(errors.code)}
              />
            </Field>
            <Field label="Course title" htmlFor="course-title" required error={errors.title}>
              <input
                className="input"
                id="course-title"
                type="text"
                placeholder="e.g. Applied Generative AI"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                aria-invalid={Boolean(errors.title)}
              />
            </Field>
            <Field label="Department" htmlFor="course-department" required>
              <select
                className="select"
                id="course-department"
                value={form.department}
                onChange={(event) => updateForm("department", event.target.value)}
              >
                {DEPARTMENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Lead instructor" htmlFor="course-instructor" required error={errors.instructor}>
              <input
                className="input"
                id="course-instructor"
                type="text"
                placeholder="e.g. Dr. Lena Fischer"
                value={form.instructor}
                onChange={(event) => updateForm("instructor", event.target.value)}
                aria-invalid={Boolean(errors.instructor)}
              />
            </Field>
            <Field label="Capacity" htmlFor="course-capacity" required error={errors.capacity}>
              <input
                className="input"
                id="course-capacity"
                type="number"
                min="1"
                max="500"
                value={form.capacity}
                onChange={(event) => updateForm("capacity", event.target.value)}
                aria-invalid={Boolean(errors.capacity)}
              />
            </Field>
            <Field label="Schedule" htmlFor="course-schedule" required error={errors.schedule}>
              <input
                className="input"
                id="course-schedule"
                type="text"
                placeholder="e.g. Tue & Thu · 10:00"
                value={form.schedule}
                onChange={(event) => updateForm("schedule", event.target.value)}
                aria-invalid={Boolean(errors.schedule)}
              />
            </Field>
            <Field label="Room" htmlFor="course-room" required error={errors.room}>
              <input
                className="input"
                id="course-room"
                type="text"
                placeholder="e.g. Lab 4.12"
                value={form.room}
                onChange={(event) => updateForm("room", event.target.value)}
                aria-invalid={Boolean(errors.room)}
              />
            </Field>
            <Field label="Status" htmlFor="course-status-new" required>
              <select
                className="select"
                id="course-status-new"
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
              >
                <option>Draft</option>
                <option>Active</option>
              </select>
            </Field>
          </div>
          <div className="form-note">
            <Icon name="info" /> Draft courses are visible to administrators only until published.
          </div>
        </form>
      </Modal>
    </>
  );
}
