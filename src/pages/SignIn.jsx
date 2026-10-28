import { useState } from "react";
import { DEMO_ACCOUNTS, UNIVERSITY } from "../data";
import { useApp } from "../context/AppContext";
import { classNames } from "../lib/format";
import { Brand, Field } from "../components/Ui";
import { Icon } from "../components/Icon";

export default function SignIn() {
  const { login, toast } = useApp();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const account = DEMO_ACCOUNTS[role];

  const changeRole = (nextRole) => {
    setRole(nextRole);
    setError("");
    setFieldErrors({});
  };

  const fillDemo = () => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setFieldErrors({});
    toast(`${role === "admin" ? "Administrator" : "Student"} demo credentials filled.`, "info");
  };

  const submit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!email.trim()) errors.email = "Enter your university email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    setError("");
    if (Object.keys(errors).length) return;
    const result = login(role, email, password);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="auth-shell">
      <section className="auth-visual" aria-label="About Deborah University">
        <div className="auth-visual-grid" aria-hidden="true" />
        <div className="auth-visual-top">
          <Brand />
          <span className="auth-campus-pill">
            <span className="pulse-dot" aria-hidden="true" /> Technology-first campus
          </span>
        </div>

        <div className="auth-visual-copy">
          <p className="auth-kicker">One campus. One workspace.</p>
          <h1>
            Build what&apos;s <em>next</em> at Deborah.
          </h1>
          <p>
            A focused digital campus for computing students and the people who keep the university
            moving.
          </p>
        </div>

        <div className="code-window" aria-hidden="true">
          <div className="code-window-bar">
            <span className="code-dots">
              <i />
              <i />
              <i />
            </span>
            <span>campus.js</span>
            <span className="code-live">
              <span /> live
            </span>
          </div>
          <pre>
            <code>
              <span className="code-muted">// Deborah University · 2026</span>
              {"\n"}
              <span className="code-key">const</span> <span className="code-var">future</span> ={" "}
              <span className="code-key">await</span> <span className="code-fn">Deborah</span>.
              <span className="code-fn">build</span>({"{"}
              {"\n"}  <span className="code-prop">focus</span>:{" "}
              <span className="code-string">&apos;computing&apos;</span>,{"\n"}  {" "}
              <span className="code-prop">students</span>:{" "}
              <span className="code-number">12_480</span>,{"\n"}  {" "}
              <span className="code-prop">term</span>:{" "}
              <span className="code-string">&apos;Fall 2026&apos;</span>
              {"\n"}
              {"}"});
            </code>
          </pre>
          <div className="code-output">
            <span className="code-check">
              <Icon name="check" />
            </span>
            <span>Workspace ready in 42ms</span>
          </div>
        </div>

        <div className="auth-proof">
          <div className="auth-proof-card">
            <strong>96%</strong>
            <span>Graduate outcomes</span>
          </div>
          <div className="auth-proof-card">
            <strong>6</strong>
            <span>Tech departments</span>
          </div>
          <div className="auth-proof-card">
            <strong>₦250M</strong>
            <span>Innovation fund</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-mobile-brand">
          <Brand dark={false} />
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <p className="auth-kicker">Campus sign in</p>
            <h1>Welcome back.</h1>
            <p>Choose your portal and sign in to continue.</p>
          </div>

          <div className="role-switch" role="group" aria-label="Choose a portal">
            <button
              type="button"
              className={classNames("role-btn", role === "student" && "is-active")}
              aria-pressed={role === "student"}
              onClick={() => changeRole("student")}
            >
              <Icon name="cap" /> Student
            </button>
            <button
              type="button"
              className={classNames("role-btn", role === "admin" && "is-active")}
              aria-pressed={role === "admin"}
              onClick={() => changeRole("admin")}
            >
              <Icon name="shield" /> Administrator
            </button>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            {error && (
              <div className="form-alert" role="alert">
                <Icon name="alert-circle" />
                <span>{error}</span>
              </div>
            )}

            <Field
              label="University email"
              htmlFor="signin-email"
              required
              error={fieldErrors.email}
            >
              <div className="input-with-icon">
                <Icon name="mail" />
                <input
                  className="input"
                  id="signin-email"
                  type="email"
                  autoComplete="username"
                  placeholder={account.email}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
            </Field>

            <Field
              label="Password"
              htmlFor="signin-password"
              required
              error={fieldErrors.password}
            >
              <div className="input-with-icon input-with-action">
                <Icon name="lock" />
                <input
                  className="input"
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} />
                </button>
              </div>
            </Field>

            <div className="auth-form-row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <button
                className="link-btn"
                type="button"
                onClick={() =>
                  toast("Password reset is disabled in this demo. Use a demo account below.", "info")
                }
              >
                Forgot password?
              </button>
            </div>

            <button className="btn btn--primary btn--block auth-submit" type="submit">
              Sign in <Icon name="arrow-right" />
            </button>
          </form>

          <div className="demo-box">
            <div className="demo-box-head">
              <div>
                <strong>Want a quick look around?</strong>
                <p>Use a demo account — no sign-up needed.</p>
              </div>
              <span className="demo-tag">{role === "admin" ? "Admin" : "Student"}</span>
            </div>
            <div className="demo-actions">
              <button className="btn btn--ghost btn--sm" type="button" onClick={fillDemo}>
                <Icon name="sparkle" /> Fill {role === "admin" ? "admin" : "student"} demo
              </button>
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => {
                  const nextRole = role === "admin" ? "student" : "admin";
                  changeRole(nextRole);
                  setEmail(DEMO_ACCOUNTS[nextRole].email);
                  setPassword(DEMO_ACCOUNTS[nextRole].password);
                  toast(
                    `${nextRole === "admin" ? "Administrator" : "Student"} demo credentials filled.`,
                    "info"
                  );
                }}
              >
                <Icon name="refresh" /> Switch demo
              </button>
            </div>
            <p className="demo-credentials">
              {account.email} · {account.password}
            </p>
          </div>

          <p className="auth-help">
            Trouble signing in?{" "}
            <a href={`mailto:${UNIVERSITY.supportEmail}`}>Contact IT support</a>
          </p>
        </div>

        <footer className="auth-footer">
          © 2026 {UNIVERSITY.name} · {UNIVERSITY.college}
        </footer>
      </section>
    </div>
  );
}
