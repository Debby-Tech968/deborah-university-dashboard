import { useMemo, useState } from "react";
import { ADMIN_FINANCE, STUDENTS } from "../../data";
import { useApp } from "../../context/AppContext";
import {
  Avatar,
  BarChart,
  Donut,
  Field,
  KpiCard,
  Modal,
  Panel,
  PanelHead,
  StatusBadge
} from "../../components/Ui";
import { Icon } from "../../components/Icon";
import { downloadCsv, downloadText, naira, nairaCompact, uid } from "../../lib/format";

const emptyPayment = {
  studentId: STUDENTS[0].id,
  amount: "",
  method: "Bank transfer"
};

export default function AdminFinance() {
  const { toast } = useApp();
  const [payments, setPayments] = useState(ADMIN_FINANCE.payments);
  const [added, setAdded] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyPayment);
  const [errors, setErrors] = useState({});

  const collected = ADMIN_FINANCE.collected + added;
  const outstanding = Math.max(0, ADMIN_FINANCE.outstanding - added);
  const billed = collected + outstanding;
  const rate = billed ? (collected / billed) * 100 : 0;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return payments.filter((payment) => {
      const matchesSearch =
        !search ||
        `${payment.ref} ${payment.student} ${payment.program} ${payment.method}`
          .toLowerCase()
          .includes(search);
      const matchesStatus = status === "All" || payment.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [payments, query, status]);

  const monthly = ADMIN_FINANCE.monthly.map((item) =>
    item.label === "Oct" ? { ...item, value: item.value + added / 1_000_000 } : item
  );

  const openModal = () => {
    setForm(emptyPayment);
    setErrors({});
    setModalOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const recordPayment = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const student = STUDENTS.find((item) => item.id === form.studentId);
    const amount = Math.floor(Number(form.amount));
    if (!student) nextErrors.studentId = "Choose a student.";
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payment = {
      ref: uid("PAY-2026"),
      student: `${student.first} ${student.last}`,
      program: student.program,
      amount,
      method: form.method,
      date: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date()),
      status: "Completed"
    };
    setPayments((current) => [payment, ...current]);
    setAdded((current) => current + amount);
    setModalOpen(false);
    toast(`${naira(amount)} payment recorded for ${payment.student}.`, "success");
  };

  const exportLedger = () => {
    const rows = [
      ["Reference", "Student", "Program", "Amount (NGN)", "Method", "Date", "Status"],
      ...payments.map((payment) => [
        payment.ref,
        payment.student,
        payment.program,
        payment.amount,
        payment.method,
        payment.date,
        payment.status
      ])
    ];
    downloadCsv("deborah-fee-ledger.csv", rows);
    toast("Fee ledger exported as CSV.", "success");
  };

  const downloadReceipt = (payment) => {
    const text = [
      "DEBORAH UNIVERSITY",
      "College of Computing & Digital Technology",
      "OFFICIAL FEE RECEIPT",
      "",
      `Receipt: ${payment.ref}`,
      `Student: ${payment.student}`,
      `Program: ${payment.program}`,
      `Amount: ${naira(payment.amount)}`,
      `Method: ${payment.method}`,
      `Date: ${payment.date}`,
      `Status: ${payment.status}`,
      "",
      "This is a computer-generated receipt from the Deborah University bursary.",
      "For enquiries, contact bursary@deborah.edu."
    ].join("\n");
    downloadText(`${payment.ref}.txt`, text);
    toast(`Receipt ${payment.ref} downloaded.`, "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="wallet" /> Bursary & finance
          </p>
          <h1>Finance</h1>
          <p className="page-sub">
            Monitor fee collection, scholarships and student payments across the session.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={exportLedger}>
            <Icon name="download" /> Export ledger
          </button>
          <button className="btn btn--primary" type="button" onClick={openModal}>
            <Icon name="plus" /> Record payment
          </button>
        </div>
      </div>

      <section className="kpi-grid" aria-label="Finance overview">
        <KpiCard
          label="Fees collected"
          value={nairaCompact(collected)}
          icon="banknote"
          tone="mint"
          delta="6.2%"
          note="versus last month"
          spark={[24.2, 28.6, 19.4, 31.2, 38.5, 42.7]}
        />
        <KpiCard
          label="Outstanding"
          value={nairaCompact(outstanding)}
          icon="receipt"
          tone="coral"
          delta="1,842 accounts"
          deltaTone="flat"
          note="with a balance"
          spark={[31, 29, 30, 27, 25, 23]}
        />
        <KpiCard
          label="Scholarships"
          value={nairaCompact(ADMIN_FINANCE.scholarships)}
          icon="award"
          tone="gold"
          delta="214 awards"
          deltaTone="flat"
          note="this session"
          spark={[4.2, 5.1, 5.6, 6.4, 7.3, 8.2]}
        />
        <KpiCard
          label="Collection rate"
          value={`${rate.toFixed(1)}%`}
          icon="trending-up"
          tone="violet"
          delta="2.3%"
          note="above the term target"
          spark={[72, 74, 76, 79, 84, rate]}
        />
      </section>

      <section className="charts-grid" aria-label="Finance charts">
        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Fee collections</h2>
              <p>Monthly totals this session · in naira</p>
            </div>
            <ul className="legend">
              <li>
                <span className="legend-dot" /> Collected
              </li>
            </ul>
          </div>
          <BarChart
            items={monthly}
            maxValue={50}
            tone="gold"
            valueFormatter={(value) => `₦${value.toFixed(1)}M`}
          />
        </article>

        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Payment channels</h2>
              <p>Share of completed payments</p>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut
              segments={ADMIN_FINANCE.channels}
              centerValue="₦184.6M"
              centerLabel="Collected"
            />
            <ul className="donut-legend">
              {ADMIN_FINANCE.channels.map((item) => (
                <li key={item.label}>
                  <span className="legend-dot" style={{ background: item.color }} />
                  {item.label} <b>{item.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <div className="toolbar" role="search" aria-label="Filter payments">
        <label className="search-input">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search by reference, student or method…"
            aria-label="Search payments"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <span className="toolbar-divider" aria-hidden="true" />
        <label className="sr-only" htmlFor="payment-status">
          Payment status
        </label>
        <select
          className="select"
          id="payment-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Pending</option>
        </select>
        <span className="toolbar-label">
          <strong>{filtered.length}</strong> payments
        </span>
      </div>

      <Panel flush>
        <PanelHead
          title="Recent payments"
          subtitle="The latest fee payments across all departments"
        />
        <div className="table-scroll">
          <table className="data-table finance-table data-table--cards">
            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Student</th>
                <th scope="col">Amount</th>
                <th scope="col">Method</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Receipt</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((payment) => (
                  <tr key={payment.ref}>
                    <td className="td-muted td-nowrap" data-label="Reference">{payment.ref}</td>
                    <td className="is-primary">
                      <div className="person">
                        <Avatar name={payment.student} />
                        <div className="person-text">
                          <strong>{payment.student}</strong>
                          <small>{payment.program}</small>
                        </div>
                      </div>
                    </td>
                    <td className="td-strong td-nowrap" data-label="Amount">{naira(payment.amount)}</td>
                    <td className="td-muted td-nowrap" data-label="Method">{payment.method}</td>
                    <td className="td-muted td-nowrap" data-label="Date">{payment.date}</td>
                    <td data-label="Status">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="td-actions">
                      <button
                        className="icon-btn icon-btn--sm"
                        type="button"
                        onClick={() => downloadReceipt(payment)}
                        aria-label={`Download receipt ${payment.ref}`}
                      >
                        <Icon name="download" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <span className="empty-icon">
                        <Icon name="receipt" />
                      </span>
                      <h3>No payments found</h3>
                      <p>Try another search term or status.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="finance-lower" aria-label="Fee schedule and scholarships">
        <Panel flush>
          <PanelHead title="Fee schedule" subtitle="Tuition per program · 2026/2027" />
          <div className="fee-schedule">
            {ADMIN_FINANCE.feeSchedule.map((item) => (
              <div className="fee-schedule-row" key={item.program}>
                <span>{item.program}</span>
                <strong>{naira(item.tuition)}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Scholarships"
            subtitle="Awards applied this session"
            plain
          />
          <div className="scholarship-total">
            <span>Total awarded</span>
            <strong>{naira(ADMIN_FINANCE.scholarships)}</strong>
          </div>
          <div className="quick-stat">
            <span>Merit awards</span>
            <strong>{naira(4_800_000)}</strong>
          </div>
          <div className="quick-stat">
            <span>Need-based grants</span>
            <strong>{naira(2_400_000)}</strong>
          </div>
          <div className="quick-stat">
            <span>Innovation & sport</span>
            <strong>{naira(1_000_000)}</strong>
          </div>
          <p className="panel-note">
            <Icon name="info" /> 214 students received an award. Bursary reviews run every Friday.
          </p>
        </Panel>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record a payment"
        subtitle="Add a confirmed fee payment to the ledger."
        footer={
          <>
            <button className="btn btn--ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit" form="record-payment-form">
              <Icon name="check" /> Record payment
            </button>
          </>
        }
      >
        <form id="record-payment-form" onSubmit={recordPayment} noValidate>
          <div className="form-grid">
            <Field label="Student" htmlFor="payment-student" required error={errors.studentId} className="field--full">
              <select
                className="select"
                id="payment-student"
                value={form.studentId}
                onChange={(event) => updateForm("studentId", event.target.value)}
                aria-invalid={Boolean(errors.studentId)}
              >
                {STUDENTS.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first} {student.last} · {student.program}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount (₦)" htmlFor="payment-amount" required error={errors.amount}>
              <input
                className="input"
                id="payment-amount"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="e.g. 245000"
                value={form.amount}
                onChange={(event) => updateForm("amount", event.target.value)}
                aria-invalid={Boolean(errors.amount)}
              />
            </Field>
            <Field label="Payment method" htmlFor="payment-method" required>
              <select
                className="select"
                id="payment-method"
                value={form.method}
                onChange={(event) => updateForm("method", event.target.value)}
              >
                <option>Bank transfer</option>
                <option>Card</option>
                <option>USSD</option>
                <option>Cash</option>
              </select>
            </Field>
          </div>
          <div className="form-note">
            <Icon name="lock" /> This demo records the payment locally and generates a downloadable receipt.
          </div>
        </form>
      </Modal>
    </>
  );
}
