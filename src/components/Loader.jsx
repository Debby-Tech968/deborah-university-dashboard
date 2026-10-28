import { classNames } from "../lib/format";
import { Crest } from "./Ui";

export default function PageLoader({ visible, message = "Preparing your campus workspace…" }) {
  return (
    <div
      className={classNames("page-loader", visible ? "is-visible" : "is-done")}
      role="status"
      aria-live="polite"
      aria-label="Loading Deborah University"
      aria-hidden={!visible}
    >
      <div className="loader-card">
        <Crest size="lg" />
        <p className="loader-university">Deborah University</p>
        <p className="loader-caption">College of Computing &amp; Digital Technology</p>
        <div className="loader-bar" aria-hidden="true">
          <span />
        </div>
        <p className="loader-note">{message}</p>
      </div>
    </div>
  );
}
