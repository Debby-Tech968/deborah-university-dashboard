import { useMemo, useState } from "react";
import { DEPARTMENTS, PROGRAMS, STUDENTS } from "../../data";
import { useApp } from "../../context/AppContext";
import {
  Avatar,
  Badge,
  Drawer,
  EmptyState,
  Field,
  MiniStat,
  Modal,
  Pagination,
  Panel,
  StatusBadge
} from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { downloadCsv, naira, number, uid } from "../../lib/format";

const PAGE_SIZE = 8;

const PROGRAM_DEPARTMENT = {
  "Computer Science": "Computing",
  "Software Engineering": "Software Engineering",
  "Cyber Security": "Cyber Security",
  "Data Science": "Data Science",
  "Artificial Intelligence": "AI & Robotics",
  "Information Technology": "Information Systems"
};

const emptyForm = {
  first: "",
  last: "",
  email: "",
  program: "Computer Science",
  year: "1",
  status: "Active"
};

export default function AdminStudents() {
  const { toast, openStudentPortal } = useApp();
  const [students, setStudents] = useState(STUDENTS);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const results = students.filter((student) => {
      const matchesSearch =
        !search ||
        `${student.first} ${student.last} ${student.email} ${student.id} ${student.program}`
          .toLowerCase()
          .includes(search);
      const matchesDepartment = department === "All" || student.department === department;
      const matchesStatus = status === "All" || student.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    return [...results].sort((a, b) => {
      if (sort === "gpa") return (b.gpa ?? -1) - (a.gpa ?? -1);
      if (sort === "year") return b.year - a.year || a.last.localeCompare(b.last);
      return a.last.localeCompare(b.last) || a.first.localeCompare(b.first);
    });
  }, [students, query, department, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setQuery("");
    setDepartment("All");
    setStatus("All");
    setSort("name");
    setPage(1);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setAddOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  };

  const submitStudent = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.first.trim()) nextErrors.first = "First name is required.";
    if (!form.last.trim()) nextErrors.last = "Last name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    } else if (
      students.some((student) => student.email.toLowerCase() === form.email.trim().toLowerCase())
    ) {
      nextErrors.email = "A student with this email already exists.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const newStudent = {
      id: uid("DU-2026"),
      first: form.first.trim(),
      last: form.last.trim(),
      email: form.email.trim().toLowerCase(),
      program: form.program,
      department: PROGRAM_DEPARTMENT[form.program],
      year: Number(form.year),
      gpa: null,
      status: form.status,
      phone: "—",
      advisor: "Unassigned",
      feeBalance: 0
    };
    setStudents((current) => [newStudent, ...current]);
    setQuery("");
    setDepartment("All");
    setStatus("All");
    setPage(1);
    setAddOpen(false);
    toast(`${newStudent.first} ${newStudent.last} added to the student directory.`, "success");
  };

  const exportStudents = () => {
    const rows = [
      ["Student", "ID", "Email", "Program", "Department", "Year", "GPA", "Status", "Fee balance (NGN)"],
      ...filtered.map((student) => [
        `${student.first} ${student.last}`,
        student.id,
        student.email,
        student.program,
        student.department,
        student.year,
        student.gpa ?? "",
        student.status,
        student.feeBalance
      ])
    ];
    downloadCsv("deborah-students.csv", rows);
    toast("Student directory exported as CSV.", "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="users" /> Student affairs
          </p>
          <h1>Students</h1>
          <p className="page-sub">
            Search the directory, review records and keep enrolment details up to date.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={exportStudents}>
            <Icon name="download" /> Export CSV
          </button>
          <button className="btn btn--primary" type="button" onClick={openAdd}>
            <Icon name="plus" /> Add student
          </button>
        </div>
      </div>

      <div className="mini-stats" aria-label="Student statistics">
        <MiniStat icon="users" value={number(12480)} label="Total students" />
        <MiniStat icon="check-circle" tone="mint" value={number(11932)} label="Active this term" />
        <MiniStat icon="file" tone="gold" value={number(1286)} label="Open applications" />
        <MiniStat icon="alert-circle" tone="coral" value="148" label="On probation" />
      </div>

      <div className="toolbar" role="search" aria-label="Filter students">
        <label className="search-input">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search name, ID, program…"
            aria-label="Search students"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <span className="toolbar-divider" aria-hidden="true" />
        <label className="sr-only" htmlFor="student-department">
          Department
        </label>
        <select
          className="select"
          id="student-department"
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
            setPage(1);
          }}
        >
          <option value="All">All departments</option>
          {DEPARTMENTS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="student-status">
          Status
        </label>
        <select
          className="select"
          id="student-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="All">All statuses</option>
          <option>Active</option>
          <option>On hold</option>
          <option>Probation</option>
        </select>
        <label className="sr-only" htmlFor="student-sort">
          Sort
        </label>
        <select
          className="select"
          id="student-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="name">Sort: Name</option>
          <option value="gpa">Sort: Highest GPA</option>
          <option value="year">Sort: Year</option>
        </select>
        <button className="btn btn--ghost btn--sm" type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="results-line">
        <span>
          <strong>{filtered.length}</strong> students in this view
        </span>
        <span>Synced 2 minutes ago</span>
      </div>

      <Panel flush className="student-panel">
        <div className="table-scroll">
          <table className="data-table data-table--cards">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Student ID</th>
                <th scope="col">Program</th>
                <th scope="col">Year</th>
                <th scope="col">GPA</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((student) => (
                  <tr key={student.id}>
                    <td className="is-primary">
                      <div className="person">
                        <Avatar name={`${student.first} ${student.last}`} />
                        <div className="person-text">
                          <strong>
                            {student.first} {student.last}
                          </strong>
                          <small>{student.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted td-nowrap" data-label="Student ID">{student.id}</td>
                    <td data-label="Program">
                      {student.program}
                      <div className="td-muted">{student.department}</div>
                    </td>
                    <td className="td-muted td-nowrap" data-label="Year">Year {student.year}</td>
                    <td className="td-strong" data-label="GPA">{student.gpa == null ? "—" : student.gpa.toFixed(2)}</td>
                    <td data-label="Status">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="td-actions">
                      <button
                        className="row-action"
                        type="button"
                        onClick={() => setSelected(student)}
                      >
                        View <Icon name="arrow-right" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <EmptyState
                      icon="users"
                      title="No students found"
                      text="Try a different search term, department or status filter."
                      action={
                        <button className="btn btn--ghost btn--sm" type="button" onClick={resetFilters}>
                          Clear filters
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <p className="table-info">
            {filtered.length ? (
              <>
                Showing{" "}
                <strong>
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </strong>{" "}
                of <strong>{filtered.length}</strong> students
              </>
            ) : (
              "No students match the current filters"
            )}
          </p>
          <Pagination page={currentPage} pages={pages} onChange={setPage} />
        </div>
      </Panel>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a student"
        subtitle="Create a record in the Deborah University directory."
        footer={
          <>
            <button className="btn btn--ghost" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit" form="add-student-form">
              <Icon name="plus" /> Add student
            </button>
          </>
        }
      >
        <form id="add-student-form" onSubmit={submitStudent} noValidate>
          <div className="form-grid">
            <Field label="First name" htmlFor="new-first" required error={errors.first}>
              <input
                className="input"
                id="new-first"
                type="text"
                autoComplete="given-name"
                placeholder="e.g. Deborah"
                value={form.first}
                onChange={(event) => updateForm("first", event.target.value)}
                aria-invalid={Boolean(errors.first)}
              />
            </Field>
            <Field label="Last name" htmlFor="new-last" required error={errors.last}>
              <input
                className="input"
                id="new-last"
                type="text"
                autoComplete="family-name"
                placeholder="e.g. Adeyemi"
                value={form.last}
                onChange={(event) => updateForm("last", event.target.value)}
                aria-invalid={Boolean(errors.last)}
              />
            </Field>
            <Field
              label="University email"
              htmlFor="new-email"
              required
              error={errors.email}
              className="field--full"
            >
              <input
                className="input"
                id="new-email"
                type="email"
                autoComplete="email"
                placeholder="name@deborah.edu"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field label="Program" htmlFor="new-program" required>
              <select
                className="select"
                id="new-program"
                value={form.program}
                onChange={(event) => updateForm("program", event.target.value)}
              >
                {PROGRAMS.map((program) => (
                  <option key={program}>{program}</option>
                ))}
              </select>
            </Field>
            <Field label="Year of study" htmlFor="new-year" required>
              <select
                className="select"
                id="new-year"
                value={form.year}
                onChange={(event) => updateForm("year", event.target.value)}
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </Field>
            <Field label="Status" htmlFor="new-status" required className="field--full">
              <select
                className="select"
                id="new-status"
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
              >
                <option>Active</option>
                <option>On hold</option>
                <option>Probation</option>
              </select>
            </Field>
          </div>
          <div className="form-note">
            <Icon name="info" /> Department is assigned automatically from the selected program.
          </div>
        </form>
      </Modal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Student profile"
        footer={
          selected && (
            <>
              <button className="btn btn--ghost" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => openStudentPortal(selected)}
              >
                <Icon name="arrow-right" /> Open portal
              </button>
              <a className="btn btn--ghost" href={`mailto:${selected.email}`}>
                <Icon name="mail" /> Email
              </a>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="drawer-profile">
              <Avatar name={`${selected.first} ${selected.last}`} size="lg" />
              <h3>
                {selected.first} {selected.last}
              </h3>
              <p>
                {selected.program} · Year {selected.year}
              </p>
              <StatusBadge status={selected.status} />
            </div>

            <div className="drawer-section">
              <h4>Contact</h4>
              <div className="detail-list">
                <span>
                  <Icon name="mail" /> {selected.email}
                </span>
                <span>
                  <Icon name="phone" /> {selected.phone}
                </span>
                <span>
                  <Icon name="map-pin" /> {selected.department}
                </span>
              </div>
            </div>

            <div className="drawer-section">
              <h4>Academic record</h4>
              <div className="drawer-stats">
                <div>
                  <strong>{selected.gpa == null ? "—" : selected.gpa.toFixed(2)}</strong>
                  <span>GPA</span>
                </div>
                <div>
                  <strong>{selected.id}</strong>
                  <span>Student ID</span>
                </div>
              </div>
              <div className="detail-list">
                <span>
                  <Icon name="user" /> Advisor · {selected.advisor}
                </span>
              </div>
            </div>

            <div className="drawer-section">
              <h4>Fees</h4>
              <div className="fee-line">
                <span>Outstanding balance</span>
                <strong>{naira(selected.feeBalance)}</strong>
              </div>
              <div className="fee-subline">
                <span>
                  {selected.feeBalance === 0
                    ? "All fees settled for this session."
                    : "Next instalment due 15 November 2026."}
                </span>
                <Badge tone={selected.feeBalance === 0 ? "success" : "warning"}>
                  {selected.feeBalance === 0 ? "Settled" : "Payment due"}
                </Badge>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
