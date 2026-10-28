import { useState } from "react";
import {
  ANNOUNCEMENTS,
  DEADLINES,
  GPA_TERMS,
  SCHEDULE,
  UNIVERSITY
} from "../../data";
import { useApp } from "../../context/AppContext";
import {
  BarChart,
  Badge,
  KpiCard,
  Meter,
  Panel,
  PanelHead
} from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { classNames, naira, nairaCompact } from "../../lib/format";
import { formatCampusDate, getGreeting, useCampusNow } from "../../lib/time";

export default function StudentOverview() {
  const { session, navigate, finance, balance, toast } = useApp();
  const now = useCampusNow();
  const greeting = getGreeting(now);
  const dateLabel = formatCampusDate(now);
  const scheduleDate = formatCampusDate(now, {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  const shortDate = formatCampusDate(now, {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).replace(",", "");
  const [deadlines, setDeadlines] = useState(DEADLINES);
  const openDeadlines = deadlines.filter((item) => !item.done);
  const netPayable = finance.totalTuition - finance.scholarship;
  const paidPercent = Math.min(100, (finance.paid / Math.max(1, netPayable)) * 100);
  const firstName = session.firstName || session.name.split(" ")[0];
  const gpa = Number(session.gpa) || 0;
  const creditsEarned = { 1: 24, 2: 60, 3: 96, 4: 120 }[session.year] ?? 96;
  const degreeProgress = Math.round((creditsEarned / 120) * 100);
  const gpaTrend = [0.44, 0.27, 0.14, 0.06, 0].map((delta) =>
    Number(Math.max(0, Math.min(4, gpa - delta)).toFixed(2))
  );
  const gpaTerms = GPA_TERMS.map((term, index) => ({
    ...term,
    value: gpaTrend[index]
  }));
  const gpaDelta = (gpaTrend[4] - gpaTrend[3]).toFixed(2);

  const toggleDeadline = (item) => {
    setDeadlines((current) =>
      current.map((deadline) =>
        deadline.id === item.id ? { ...deadline, done: !deadline.done } : deadline
      )
    );
    if (!item.done) toast(`${item.title} marked complete.`, "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="cap" /> Student portal
          </p>
          <h1>{greeting}, {firstName}.</h1>
          <p className="page-sub">
            {dateLabel} · {UNIVERSITY.term}, Week {UNIVERSITY.week}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={() => navigate("/student/courses")}>
            <Icon name="book" /> My courses
          </button>
          <button className="btn btn--gold" type="button" onClick={() => navigate("/student/finance")}>
            <Icon name="wallet" /> Fees &amp; payments
          </button>
        </div>
      </div>

      <div className="term-banner">
        <div className="term-banner-copy">
          <span className="stat-icon stat-icon--gold">
            <Icon name="calendar" />
          </span>
          <div>
            <strong>Spring 2027 registration opens in 6 days</strong>
            <p>Your window starts Tuesday, 3 November at 09:00. Plan up to 18 credits.</p>
          </div>
        </div>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => navigate("/student/courses/registration")}
        >
          Plan courses
        </button>
      </div>

      <section className="kpi-grid" aria-label="Academic snapshot">
        <KpiCard
          label="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "—"}
          icon="award"
          tone="gold"
          delta={gpa > 0 ? gpaDelta : "—"}
          note="versus Spring 2026"
          spark={gpaTrend}
        />
        <KpiCard
          label="Credits earned"
          value={
            <>
              {creditsEarned}<small> / 120</small>
            </>
          }
          icon="cap"
          delta="On track"
          deltaTone="flat"
          note="to graduate June 2028"
          spark={[creditsEarned - 48, creditsEarned - 36, creditsEarned - 24, creditsEarned - 12, creditsEarned].map(
            (value) => Math.max(0, value)
          )}
        />
        <KpiCard
          label="Outstanding fees"
          value={naira(balance)}
          icon="wallet"
          tone="coral"
          delta="Due 15 Nov"
          deltaTone="flat"
          note="for the 2026/2027 session"
          spark={[875, 755, 620, 430, balance / 1000]}
        />
        <KpiCard
          label="Assignments due"
          value={openDeadlines.length}
          icon="file"
          tone="mint"
          delta="This week"
          deltaTone="flat"
          note="next due tomorrow"
          spark={[5, 4, 6, 3, 3]}
        />
      </section>

      <section className="student-layout" aria-label="Schedule and progress">
        <div className="stack">
          <Panel flush>
            <PanelHead
              title="Today's schedule"
              subtitle={`4 sessions · ${scheduleDate}`}
              actions={<span className="tag">{shortDate}</span>}
            />
            <div className="schedule-list">
              {SCHEDULE.map((item) => (
                <div className={classNames("class-row", item.state === "now" && "is-now")} key={`${item.code}-${item.time}`}>
                  <div className="class-time">
                    <strong>{item.time.split(" – ")[0]}</strong>
                    <span>{item.time.split(" – ")[1]}</span>
                    <small>Today</small>
                  </div>
                  <div className="class-main">
                    <strong>
                      {item.title} <span className="class-code">{item.code}</span>
                    </strong>
                    <small>{item.meta}</small>
                  </div>
                  <div className="class-side">
                    {item.state === "now" && <Badge tone="success">Now</Badge>}
                    {item.state === "next" && <Badge tone="info">Next</Badge>}
                    <span className="class-room">{item.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel flush>
            <PanelHead
              title={
                <>
                  Due this week <Badge tone="danger">{openDeadlines.length}</Badge>
                </>
              }
              subtitle="Mark items complete as you go"
              actions={
                <button
                  className="panel-link"
                  type="button"
                  onClick={() => navigate("/student/courses/grades")}
                >
                  Grades <Icon name="arrow-right" />
                </button>
              }
            />
            <div className="deadline-list">
              {deadlines.map((item) => (
                <div className={classNames("deadline", item.done && "is-done")} key={item.id}>
                  <div className="deadline-date">
                    <strong>{item.day}</strong>
                    <span>{item.month}</span>
                  </div>
                  <div className="deadline-body">
                    <strong>{item.title}</strong>
                    <small>{item.code}</small>
                  </div>
                  <Badge
                    tone={item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "info"}
                  >
                    {item.priority}
                  </Badge>
                  <button
                    className="deadline-check"
                    type="button"
                    aria-pressed={item.done}
                    aria-label={`${item.done ? "Reopen" : "Complete"} ${item.title}`}
                    onClick={() => toggleDeadline(item)}
                  >
                    <Icon name="check" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title="Announcements"
              subtitle="From across campus"
              plain
            />
            <div className="announcement-list">
              {ANNOUNCEMENTS.map((item) => (
                <div className="announcement" key={item.id}>
                  <span className="announcement-icon">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="stack">
          <Panel className="ring-card">
            <h2>Degree progress</h2>
            <div
              className="ring"
              style={{ "--p": degreeProgress }}
              role="img"
              aria-label={`${degreeProgress} percent of degree credits completed`}
            >
              <div className="ring-inner">
                <strong>{degreeProgress}%</strong>
                <span>completed</span>
              </div>
            </div>
            <div className="ring-legend">
              <span>
                <b>{creditsEarned}</b> earned
              </span>
              <span>
                <b>{120 - creditsEarned}</b> remaining
              </span>
            </div>
            <p className="ring-note">{session.title}</p>
          </Panel>

          <Panel>
            <PanelHead title="GPA by term" subtitle="Steady progress since Fall 2024" plain />
            <BarChart
              items={gpaTerms}
              maxValue={4}
              valueFormatter={(value) => value.toFixed(2)}
            />
          </Panel>

          <Panel>
            <PanelHead
              title="Fee status"
              subtitle={`${UNIVERSITY.session} session`}
              plain
              actions={
                <button className="panel-link" type="button" onClick={() => navigate("/student/finance")}>
                  Manage <Icon name="arrow-right" />
                </button>
              }
            />
            <div className="fee-balance">
              <div>
                <span>Outstanding balance</span>
                <strong>{naira(balance)}</strong>
              </div>
              <Badge tone={balance === 0 ? "success" : "warning"}>
                {balance === 0 ? "Settled" : "Due 15 Nov"}
              </Badge>
            </div>
            <Meter value={paidPercent} tone="gold" label="Tuition paid" />
            <div className="fee-mini-grid">
              <div>
                <span>Net payable</span>
                <strong>{naira(netPayable)}</strong>
              </div>
              <div>
                <span>Paid</span>
                <strong>{naira(finance.paid)}</strong>
              </div>
            </div>
            <p className="panel-note">
              <Icon name="award" /> {nairaCompact(finance.scholarship)} scholarship already applied.
            </p>
          </Panel>

          <Panel>
            <PanelHead title="Quick links" plain />
            <div className="quick-grid">
              <button className="quick-link" type="button" onClick={() => navigate("/student/courses")}>
                <Icon name="book" /> My courses
              </button>
              <button
                className="quick-link"
                type="button"
                onClick={() => navigate("/student/courses/registration")}
              >
                <Icon name="file" /> Registration
              </button>
              <button
                className="quick-link"
                type="button"
                onClick={() => navigate("/student/courses/grades")}
              >
                <Icon name="award" /> Grades
              </button>
              <button className="quick-link" type="button" onClick={() => navigate("/student/finance")}>
                <Icon name="wallet" /> Fees
              </button>
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
