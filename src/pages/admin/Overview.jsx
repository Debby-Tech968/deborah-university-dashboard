import { useState } from "react";
import {
  ACTIVITIES,
  ADMIN_FINANCE,
  APPLICATIONS,
  APPROVALS,
  DEPARTMENT_MIX,
  ENROLMENT,
  UNIVERSITY
} from "../../data";
import { useApp } from "../../context/AppContext";
import {
  Avatar,
  Badge,
  Donut,
  EmptyState,
  KpiCard,
  Modal,
  Meter,
  Panel,
  PanelHead,
  StatusBadge,
  Field
} from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { downloadCsv, nairaCompact, number } from "../../lib/format";

function EnrolmentChart() {
  const width = 560;
  const height = 230;
  const xStart = 44;
  const xEnd = 516;
  const yTop = 45;
  const yBottom = 200;
  const min = 10000;
  const max = 13000;
  const points = ENROLMENT.map((item, index) => ({
    ...item,
    x: xStart + (index * (xEnd - xStart)) / (ENROLMENT.length - 1),
    y: yBottom - ((item.value - min) / (max - min)) * (yBottom - yTop)
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
  const area = `${line} L${xEnd} ${yBottom} L${xStart} ${yBottom} Z`;
  const gridValues = [13000, 12000, 11000, 10000];
  const last = points[points.length - 1];

  return (
    <svg
      className="line-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Enrolment grew from 10,420 students in Fall 2024 to 12,480 in Fall 2026"
    >
      <defs>
        <linearGradient id="enrolFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f55d4" stopOpacity="0.16" />
          <stop offset="1" stopColor="#2f55d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridValues.map((value) => {
        const y = yBottom - ((value - min) / (max - min)) * (yBottom - yTop);
        return (
          <g key={value}>
            <line className="chart-grid-line" x1={xStart} y1={y} x2={xEnd} y2={y} />
            <text className="chart-axis-text" x={xStart - 10} y={y + 4} textAnchor="end">
              {value / 1000}k
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#enrolFill)" />
      <path className="chart-line" d={line} />
      {points.map((point) => (
        <circle key={point.label} className="chart-dot" cx={point.x} cy={point.y} r="4" />
      ))}
      <circle className="chart-dot--active" cx={last.x} cy={last.y} r="5.5" />
      <g>
        <rect x={last.x - 34} y={last.y - 38} width="68" height="24" rx="6" className="chart-callout" />
        <text x={last.x} y={last.y - 22} textAnchor="middle" className="chart-callout-text">
          {number(last.value)}
        </text>
      </g>
      {points.map((point) => (
        <text
          key={`label-${point.label}`}
          className="chart-axis-text"
          x={point.x}
          y={height - 10}
          textAnchor="middle"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}

export default function AdminOverview() {
  const { navigate, toast } = useApp();
  const [applications, setApplications] = useState(APPLICATIONS);
  const [approvals, setApprovals] = useState(APPROVALS);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const billed = ADMIN_FINANCE.collected + ADMIN_FINANCE.outstanding;

  const exportReport = () => {
    const rows = [
      ["Applicant", "Email", "Program", "Department", "Submitted", "Status"],
      ...applications.map((item) => [
        item.name,
        item.email,
        item.program,
        item.department,
        item.submitted,
        item.status
      ])
    ];
    downloadCsv("deborah-applications.csv", rows);
    toast("Applications report exported as CSV.", "success");
  };

  const decideApplication = (status) => {
    if (!selectedApplication) return;
    setApplications((current) =>
      current.map((item) => (item.id === selectedApplication.id ? { ...item, status } : item))
    );
    toast(
      `${selectedApplication.name}'s application marked ${status.toLowerCase()}.`,
      status === "Approved" ? "success" : "info"
    );
    setSelectedApplication(null);
  };

  const handleApproval = (approval) => {
    setApprovals((current) => current.filter((item) => item.id !== approval.id));
    toast(`${approval.title} approved. The requesting team has been notified.`, "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="shield" /> Administrator workspace
          </p>
          <h1>Good morning, Dr. Ellis.</h1>
          <p className="page-sub">
            Here is what is happening across {UNIVERSITY.name} today.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={() => navigate("/admin/students")}>
            <Icon name="users" /> Student directory
          </button>
          <button className="btn btn--primary" type="button" onClick={exportReport}>
            <Icon name="download" /> Export report
          </button>
        </div>
      </div>

      <div className="term-banner">
        <div className="term-banner-copy">
          <span className="stat-icon stat-icon--gold">
            <Icon name="calendar" />
          </span>
          <div>
            <strong>
              {UNIVERSITY.term} · Week {UNIVERSITY.week} of {UNIVERSITY.totalWeeks}
            </strong>
            <p>Midterm grades are due Friday, 30 October. Spring 2027 applications close 15 November.</p>
          </div>
        </div>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() =>
            document.getElementById("applications")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          Review applications
        </button>
      </div>

      <section className="kpi-grid" aria-label="University at a glance">
        <KpiCard
          label="Total students"
          value={number(12480)}
          icon="users"
          delta="4.8%"
          note="versus last term"
          spark={[10420, 10880, 11240, 11890, 12480]}
        />
        <KpiCard
          label="Active courses"
          value="186"
          icon="book"
          tone="gold"
          delta="2.1%"
          note="new tech electives added"
          spark={[168, 171, 176, 181, 186]}
        />
        <KpiCard
          label="Faculty & staff"
          value="214"
          icon="briefcase"
          tone="violet"
          delta="1.2%"
          note="across six departments"
          spark={[201, 205, 207, 211, 214]}
        />
        <KpiCard
          label="Applications"
          value={number(1286)}
          icon="file"
          tone="mint"
          delta="12.4%"
          note="for Spring 2027"
          spark={[980, 1040, 1100, 1180, 1286]}
        />
      </section>

      <section className="finance-strip" aria-label="Fee collection snapshot">
        <div className="finance-strip-copy">
          <span className="stat-icon stat-icon--mint">
            <Icon name="wallet" />
          </span>
          <div>
            <strong>{nairaCompact(ADMIN_FINANCE.collected)} collected this session</strong>
            <p>
              {ADMIN_FINANCE.collectionRate}% of {nairaCompact(billed)} billed ·{" "}
              {nairaCompact(ADMIN_FINANCE.outstanding)} outstanding
            </p>
          </div>
        </div>
        <div className="finance-strip-meter">
          <Meter
            value={ADMIN_FINANCE.collectionRate}
            tone="gold"
            label="Fee collection rate"
          />
        </div>
        <button className="btn btn--ghost btn--sm" type="button" onClick={() => navigate("/admin/finance")}>
          View finance <Icon name="arrow-right" />
        </button>
      </section>

      <section className="charts-grid" aria-label="Enrolment and department charts">
        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Enrolment growth</h2>
              <p>Undergraduate and postgraduate students · five terms</p>
            </div>
            <ul className="legend" aria-label="Legend">
              <li>
                <span className="legend-dot" /> Enrolled students
              </li>
            </ul>
          </div>
          <EnrolmentChart />
        </article>

        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Department mix</h2>
              <p>Enrolment by department · Fall 2026</p>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut
              segments={DEPARTMENT_MIX}
              centerValue="12.4k"
              centerLabel="Students"
            />
            <ul className="donut-legend">
              {DEPARTMENT_MIX.map((item) => (
                <li key={item.label}>
                  <span className="legend-dot" style={{ background: item.color }} />
                  {item.label} <b>{item.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="dashboard-grid" aria-label="Applications, approvals and activity">
        <Panel flush className="applications-panel" id="applications">
          <PanelHead
            title="Recent applications"
            subtitle="Spring 2027 admissions · 1,286 total"
            actions={
              <button className="panel-link" type="button" onClick={() => navigate("/admin/students")}>
                View all <Icon name="arrow-right" />
              </button>
            }
          />
          <div className="table-scroll">
            <table className="data-table data-table--cards">
              <thead>
                <tr>
                  <th scope="col">Applicant</th>
                  <th scope="col">Program</th>
                  <th scope="col">Department</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="is-primary">
                      <div className="person">
                        <Avatar name={application.name} />
                        <div className="person-text">
                          <strong>{application.name}</strong>
                          <small>{application.email}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Program">{application.program}</td>
                    <td className="td-muted" data-label="Department">{application.department}</td>
                    <td className="td-muted td-nowrap" data-label="Submitted">{application.submitted}</td>
                    <td data-label="Status">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="td-actions">
                      <button
                        className="row-action"
                        type="button"
                        onClick={() => setSelectedApplication(application)}
                      >
                        View <Icon name="arrow-right" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="stack">
          <Panel flush>
            <PanelHead
              title={
                <>
                  Pending approvals{" "}
                  <Badge tone="warning">{approvals.length}</Badge>
                </>
              }
              subtitle="Items that need your sign-off"
            />
            <div className="approval-list">
              {approvals.length ? (
                approvals.map((approval) => (
                  <div className="approval" key={approval.id}>
                    <span className="approval-icon">
                      <Icon name="file" />
                    </span>
                    <div className="approval-body">
                      <strong>{approval.title}</strong>
                      <small>{approval.type}</small>
                      <small>{approval.due}</small>
                    </div>
                    <div className="approval-actions">
                      <button
                        className="icon-btn approve"
                        type="button"
                        aria-label={`Approve ${approval.title}`}
                        onClick={() => handleApproval(approval)}
                      >
                        <Icon name="check" />
                      </button>
                      <button
                        className="icon-btn decline"
                        type="button"
                        aria-label={`Decline ${approval.title}`}
                        onClick={() => {
                          setApprovals((current) => current.filter((item) => item.id !== approval.id));
                          toast(`${approval.title} returned to the requester.`, "info");
                        }}
                      >
                        <Icon name="x" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon="check-circle"
                  title="All caught up"
                  text="There are no approvals waiting for you."
                />
              )}
            </div>
          </Panel>

          <Panel flush>
            <PanelHead title="Campus activity" subtitle="Last 24 hours" />
            <div className="activity-list">
              {ACTIVITIES.map((item) => (
                <div className="activity-item" key={item.id}>
                  <span className={`activity-dot activity-dot--${item.tone}`} aria-hidden="true" />
                  <div className="activity-text">
                    <p>{item.text}</p>
                    <time>{item.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <Modal
        open={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        title="Application review"
        subtitle="Spring 2027 undergraduate admissions"
        footer={
          selectedApplication && (
            <>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => decideApplication("Declined")}
              >
                <Icon name="x" /> Decline
              </button>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => decideApplication("Approved")}
              >
                <Icon name="check" /> Approve application
              </button>
            </>
          )
        }
      >
        {selectedApplication && (
          <>
            <div className="applicant-profile">
              <Avatar name={selectedApplication.name} size="lg" />
              <div>
                <h3>{selectedApplication.name}</h3>
                <p>{selectedApplication.email}</p>
                <StatusBadge status={selectedApplication.status} />
              </div>
            </div>
            <div className="detail-grid">
              <div>
                <span>Program</span>
                <strong>{selectedApplication.program}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{selectedApplication.department}</strong>
              </div>
              <div>
                <span>Submitted</span>
                <strong>{selectedApplication.submitted}</strong>
              </div>
              <div>
                <span>Reference</span>
                <strong>{selectedApplication.id}</strong>
              </div>
            </div>
            <Field label="Admissions note" htmlFor="admissions-note">
              <textarea
                className="input textarea"
                id="admissions-note"
                rows="3"
                placeholder="Optional note for the admissions file…"
              />
            </Field>
          </>
        )}
      </Modal>
    </>
  );
}
