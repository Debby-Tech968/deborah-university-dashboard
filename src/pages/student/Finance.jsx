import { useState } from "react";
import { UNIVERSITY } from "../../data";
import { useApp } from "../../context/AppContext";
import { Meter, Modal, Panel, PanelHead, StatusBadge } from "../../components/Ui";
import { Icon } from "../../components/Icon";
import {
  classNames,
  downloadCsv,
  downloadText,
  naira,
  number
} from "../../lib/format";

const METHODS = [
  { label: "Bank transfer", icon: "banknote" },
  { label: "Card", icon: "credit-card" },
  { label: "USSD", icon: "phone" }
];

function buildPlan(finance) {
  let cumulative = 0;
  return finance.plan.map((item) => {
    cumulative += item.amount;
    let status = "Due";
    if (finance.paid >= cumulative) status = "Paid";
    else if (finance.paid > cumulative - item.amount) status = "Part paid";
    return { ...item, status };
  });
}

export default function StudentFinance() {
  const { finance, balance, payTuition, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank transfer");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const netPayable = finance.totalTuition - finance.scholarship;
  const paidPercent = Math.min(100, (finance.paid / Math.max(1, netPayable)) * 100);
  const plan = buildPlan(finance);

  const openPayment = () => {
    if (balance <= 0) {
      toast("Your fees are fully settled for this session.", "success");
      return;
    }
    setAmount(String(balance));
    setMethod("Bank transfer");
    setError("");
    setStep("form");
    setReceipt(null);
    setProcessing(false);
    setOpen(true);
  };

  const closePayment = () => {
    if (processing) return;
    setOpen(false);
  };

  const submitPayment = (event) => {
    event.preventDefault();
    const value = Math.floor(Number(amount));
    if (!amount || Number.isNaN(value) || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (value > balance) {
      setError(`The outstanding balance is ${naira(balance)}.`);
      return;
    }
    setError("");
    setProcessing(true);
    window.setTimeout(() => {
      const payment = payTuition(value, method);
      if (payment) {
        setReceipt(payment);
        setStep("success");
      }
      setProcessing(false);
    }, 750);
  };

  const downloadReceipt = (payment) => {
    const text = [
      "DEBORAH UNIVERSITY",
      UNIVERSITY.college,
      "OFFICIAL FEE RECEIPT",
      "",
      `Receipt: ${payment.ref}`,
      "Student: Amara Okafor",
      "Program: Computer Science",
      `Amount: ${naira(payment.amount)}`,
      `Method: ${payment.method}`,
      `Date: ${payment.date}`,
      `Status: ${payment.status}`,
      "",
      "Payment received with thanks.",
      "For enquiries, contact bursary@deborah.edu."
    ].join("\n");
    downloadText(`${payment.ref}.txt`, text);
    toast(`Receipt ${payment.ref} downloaded.`, "success");
  };

  const downloadStatement = () => {
    const rows = [
      ["Deborah University — fee statement"],
      ["Student", "Amara Okafor"],
      ["Session", UNIVERSITY.session],
      ["Total tuition (NGN)", finance.totalTuition],
      ["Scholarship (NGN)", finance.scholarship],
      ["Net payable (NGN)", netPayable],
      ["Paid (NGN)", finance.paid],
      ["Balance (NGN)", balance],
      [],
      ["Reference", "Date", "Amount (NGN)", "Method", "Status"],
      ...finance.payments.map((payment) => [
        payment.ref,
        payment.date,
        payment.amount,
        payment.method,
        payment.status
      ])
    ];
    downloadCsv("deborah-fee-statement.csv", rows);
    toast("Fee statement downloaded.", "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="page-kicker">
            <Icon name="wallet" /> Bursary
          </p>
          <h1>Fees &amp; payments</h1>
          <p className="page-sub">
            Track your tuition, scholarships and receipts. All amounts are in Nigerian naira.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--ghost" type="button" onClick={downloadStatement}>
            <Icon name="download" /> Statement
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={openPayment}
            disabled={balance === 0}
          >
            <Icon name="credit-card" /> {balance === 0 ? "Fees settled" : "Make a payment"}
          </button>
        </div>
      </div>

      <section className="fee-hero" aria-label="Outstanding fee balance">
        <div className="fee-hero-main">
          <span className="fee-kicker">
            <span className="pulse-dot" aria-hidden="true" /> {UNIVERSITY.session} session
          </span>
          <p>Outstanding balance</p>
          <strong className="fee-hero-amount">{naira(balance)}</strong>
          <p className="fee-hero-due">
            <Icon name="calendar" />{" "}
            {balance === 0 ? "All fees settled — thank you." : "Next instalment due 15 November 2026."}
          </p>
          <div className="fee-hero-actions">
            <button
              className="btn btn--gold"
              type="button"
              onClick={openPayment}
              disabled={balance === 0}
            >
              <Icon name="credit-card" /> {balance === 0 ? "Paid in full" : "Pay balance"}
            </button>
            <button
              className="btn btn--on-dark"
              type="button"
              onClick={downloadStatement}
            >
              <Icon name="receipt" /> Download statement
            </button>
          </div>
        </div>
        <div className="fee-hero-aside">
          <div className="fee-hero-progress">
            <div>
              <span>Payment progress</span>
              <strong>{paidPercent.toFixed(0)}%</strong>
            </div>
            <Meter value={paidPercent} tone="gold" label="Tuition payment progress" />
          </div>
          <div className="fee-hero-stats">
            <div>
              <span>Net payable</span>
              <strong>{naira(netPayable)}</strong>
            </div>
            <div>
              <span>Paid</span>
              <strong>{naira(finance.paid)}</strong>
            </div>
            <div>
              <span>Scholarship</span>
              <strong>{naira(finance.scholarship)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="finance-lower" aria-label="Payment plan and fee breakdown">
        <Panel flush>
          <PanelHead
            title="Payment plan"
            subtitle="Three instalments · 2026/2027"
            actions={<span className="tag">Next due 15 Nov</span>}
          />
          <div className="payment-plan">
            {plan.map((item, index) => (
              <div className="plan-row" key={item.label}>
                <span className={classNames("plan-marker", item.status === "Paid" && "is-paid", item.status === "Part paid" && "is-part")}>
                  {item.status === "Paid" ? <Icon name="check" /> : number(index + 1)}
                </span>
                <div className="plan-body">
                  <strong>{item.label}</strong>
                  <small>{item.due}</small>
                </div>
                <strong className="plan-amount">{naira(item.amount)}</strong>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
          <div className="plan-note">
            <Icon name="info" /> Pay early to keep your registration window on time. No late fees
            apply until 30 November.
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Fee breakdown" subtitle="Applied to your account" plain />
          <div className="fee-breakdown">
            <div className="fee-breakdown-row">
              <span>Tuition</span>
              <strong>{naira(finance.totalTuition)}</strong>
            </div>
            <div className="fee-breakdown-row is-credit">
              <span>Merit scholarship</span>
              <strong>−{naira(finance.scholarship)}</strong>
            </div>
            <div className="fee-breakdown-row is-total">
              <span>Net payable</span>
              <strong>{naira(netPayable)}</strong>
            </div>
            <div className="fee-breakdown-row">
              <span>Paid to date</span>
              <strong>{naira(finance.paid)}</strong>
            </div>
            <div className="fee-breakdown-row is-balance">
              <span>Balance</span>
              <strong>{naira(balance)}</strong>
            </div>
          </div>
          <div className="scholarship-note">
            <span className="stat-icon stat-icon--gold">
              <Icon name="award" />
            </span>
            <div>
              <strong>{naira(finance.scholarship)} merit award</strong>
              <p>Applied automatically to your tuition for the 2026/2027 session.</p>
            </div>
          </div>
          <div className="payment-method-note">
            <Icon name="shield" /> Payments are processed securely. This demo does not move real
            money.
          </div>
        </Panel>
      </section>

      <Panel flush>
        <PanelHead
          title="Payment history"
          subtitle={`${finance.payments.length} payment${finance.payments.length === 1 ? "" : "s"} recorded`}
          actions={
            <button className="panel-link" type="button" onClick={downloadStatement}>
              Statement <Icon name="download" />
            </button>
          }
        />
        <div className="table-scroll">
          <table className="data-table finance-table data-table--cards">
            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Method</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Receipt</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {finance.payments.map((payment) => (
                <tr key={payment.ref}>
                  <td className="td-muted td-nowrap" data-label="Reference">{payment.ref}</td>
                  <td className="td-muted td-nowrap" data-label="Date">{payment.date}</td>
                  <td className="td-strong td-nowrap is-primary">{naira(payment.amount)}</td>
                  <td className="td-muted" data-label="Method">{payment.method}</td>
                  <td data-label="Status">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="td-actions">
                    <button
                      className="icon-btn icon-btn--sm"
                      type="button"
                      aria-label={`Download receipt ${payment.ref}`}
                      onClick={() => downloadReceipt(payment)}
                    >
                      <Icon name="download" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        open={open}
        onClose={closePayment}
        title={step === "success" ? "Payment received" : "Make a payment"}
        subtitle={
          step === "success"
            ? "Your receipt is ready to download."
            : `Outstanding balance · ${naira(balance)}`
        }
        footer={
          step === "form" ? (
            <>
              <button className="btn btn--ghost" type="button" onClick={closePayment} disabled={processing}>
                Cancel
              </button>
              <button
                className="btn btn--primary"
                type="submit"
                form="payment-form"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner" /> Processing…
                  </>
                ) : (
                  <>
                    <Icon name="lock" /> Pay {amount ? naira(Number(amount) || 0) : "now"}
                  </>
                )}
              </button>
            </>
          ) : (
            <button className="btn btn--primary btn--block" type="button" onClick={closePayment}>
              Done
            </button>
          )
        }
      >
        {step === "form" ? (
          <form id="payment-form" onSubmit={submitPayment} noValidate>
            <div className="amount-field">
              <label htmlFor="payment-amount-student">Amount</label>
              <div className="amount-input-wrap">
                <span>₦</span>
                <input
                  id="payment-amount-student"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={balance}
                  step="1"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                />
              </div>
              {error && <span className="field-error">{error}</span>}
            </div>
            <div className="quick-amounts">
              <button type="button" onClick={() => setAmount(String(balance))}>
                Full balance
              </button>
              <button type="button" onClick={() => setAmount("100000")}>
                ₦100,000
              </button>
              <button type="button" onClick={() => setAmount("50000")}>
                ₦50,000
              </button>
            </div>

            <div className="payment-methods" role="group" aria-label="Payment method">
              {METHODS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={classNames("payment-method", method === item.label && "is-active")}
                  aria-pressed={method === item.label}
                  onClick={() => setMethod(item.label)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="payment-summary">
              <div>
                <span>Paying today</span>
                <strong>{naira(Number(amount) || 0)}</strong>
              </div>
              <div>
                <span>Balance after payment</span>
                <strong>{naira(Math.max(0, balance - (Number(amount) || 0)))}</strong>
              </div>
            </div>
            <div className="form-note">
              <Icon name="info" /> Demo payment — no card or bank details are collected. Payments
              are recorded in naira.
            </div>
          </form>
        ) : (
          <div className="payment-success">
            <div className="payment-check">
              <Icon name="check" />
            </div>
            <h3>Thank you, Amara.</h3>
            <p>
              Your payment of <strong>{naira(receipt?.amount || 0)}</strong> has been recorded.
              A receipt has been added to your payment history.
            </p>
            <div className="success-details">
              <div>
                <span>Reference</span>
                <strong>{receipt?.ref}</strong>
              </div>
              <div>
                <span>Method</span>
                <strong>{receipt?.method}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{receipt?.date}</strong>
              </div>
              <div>
                <span>New balance</span>
                <strong>{naira(balance)}</strong>
              </div>
            </div>
            <button
              className="btn btn--ghost btn--block"
              type="button"
              onClick={() => receipt && downloadReceipt(receipt)}
            >
              <Icon name="download" /> Download receipt
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
