import { useEffect, useRef, useState } from "react";
import { NAV, UNIVERSITY } from "../data";
import { useApp } from "../context/AppContext";
import { classNames } from "../lib/format";
import { formatCampusDate, useCampusNow } from "../lib/time";
import { Icon } from "./Icon";
import { Avatar, Brand } from "./Ui";

const ROUTE_LABELS = {
  "/admin": "Overview",
  "/admin/students": "Students",
  "/admin/courses": "Courses",
  "/admin/finance": "Finance",
  "/student": "Overview",
  "/student/courses": "My courses",
  "/student/courses/registration": "Registration",
  "/student/courses/grades": "Grades",
  "/student/finance": "Fees & payments"
};

export default function PortalLayout({ children }) {
  const {
    session,
    route,
    navigate,
    logout,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    exitAdminPreview
  } = useApp();
  const [openMenu, setOpenMenu] = useState(null);
  const actionsRef = useRef(null);
  const now = useCampusNow();
  const shortDate = formatCampusDate(now, {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).replace(",", "");

  const items = NAV[session.role];
  const currentLabel = ROUTE_LABELS[route] || "Workspace";
  const roleLabel = session.adminPreview
    ? "Admin preview"
    : session.role === "admin"
      ? "Admin"
      : "Student";

  useEffect(() => {
    setOpenMenu(null);
  }, [route]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (event) => {
      if (!actionsRef.current?.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenu]);

  return (
    <div className={classNames("app-shell", sidebarOpen && "nav-open")}>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <button
        className="sidebar-overlay"
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-brand">
          <Brand />
        </div>

        <div className="sidebar-term">
          <span className="term-dot" aria-hidden="true" />
          <div>
            <strong>
              {UNIVERSITY.term} · Week {UNIVERSITY.week}
            </strong>
            <small>{UNIVERSITY.session} session</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Workspace</p>
          {items.map((item) => {
            const active =
              route === item.path ||
              (item.path === "/student/courses" && route.startsWith("/student/courses"));
            return (
              <button
                key={item.path}
                type="button"
                className={classNames("nav-link", active && "is-active")}
                aria-current={active ? "page" : undefined}
                onClick={() => navigate(item.path)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {active && <span className="nav-active-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <span className="support-icon">
              <Icon name="help-circle" />
            </span>
            <strong>Need a hand?</strong>
            <p>Campus IT support is available 08:00–20:00.</p>
            <a href={`mailto:${UNIVERSITY.supportEmail}`}>Contact support</a>
          </div>

          <div className="sidebar-user">
            <Avatar name={session.name} size="sm" />
            <div>
              <strong>{session.name}</strong>
              <small>{session.title}</small>
            </div>
            <button type="button" onClick={logout} aria-label="Sign out">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn menu-btn"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <Icon name="menu" />
          </button>

          <div className="crumbs">
            <span>{roleLabel}</span>
            <Icon name="chevron-right" />
            <strong>{currentLabel}</strong>
          </div>

          <div className="topbar-right" ref={actionsRef}>
            <span className="topbar-date">
              <Icon name="calendar" /> {shortDate}
            </span>

            <div className="popover-wrap">
              <button
                className="icon-btn"
                type="button"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={openMenu === "notifications"}
                onClick={() =>
                  setOpenMenu((current) => (current === "notifications" ? null : "notifications"))
                }
              >
                <Icon name="bell" />
                {unreadCount > 0 && <span className="notif-dot" aria-hidden="true" />}
              </button>
              {openMenu === "notifications" && (
                <div className="popover popover--notifications">
                  <div className="popover-head">
                    <div>
                      <h3>Notifications</h3>
                      <p>{unreadCount ? `${unreadCount} unread updates` : "You are all caught up"}</p>
                    </div>
                    <button className="icon-btn icon-btn--sm" type="button" onClick={() => setOpenMenu(null)} aria-label="Close notifications">
                      <Icon name="x" />
                    </button>
                  </div>
                  <div className="notif-list">
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={classNames("notif-item", item.unread && "is-unread")}
                        onClick={() => markRead(item.id)}
                      >
                        <span className="notif-icon">
                          <Icon name={item.icon || "bell"} />
                        </span>
                        <span className="notif-copy">
                          <strong>{item.title}</strong>
                          <span>{item.detail}</span>
                          <time>{item.time}</time>
                        </span>
                        {item.unread && <span className="notif-unread-dot" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                  <button className="notif-footer" type="button" onClick={markAllRead}>
                    <Icon name="check-circle" /> Mark all as read
                  </button>
                </div>
              )}
            </div>

            <div className="popover-wrap">
              <button
                className="topbar-user"
                type="button"
                aria-expanded={openMenu === "user"}
                onClick={() => setOpenMenu((current) => (current === "user" ? null : "user"))}
              >
                <Avatar name={session.name} size="sm" />
                <span className="topbar-user-copy">
                  <strong>{session.name}</strong>
                  <small>{session.role === "admin" ? "Administrator" : "Student"}</small>
                </span>
                <Icon name="chevron-down" />
              </button>
              {openMenu === "user" && (
                <div className="popover popover--user">
                  <div className="user-popover-head">
                    <Avatar name={session.name} />
                    <div>
                      <strong>{session.name}</strong>
                      <span>{session.email}</span>
                    </div>
                  </div>
                  <div className="user-popover-meta">
                    <span>{session.title}</span>
                    <span>{session.id}</span>
                  </div>
                  <button type="button" className="user-popover-action" onClick={logout}>
                    <Icon name="logout" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page" id="main" tabIndex={-1}>
          {session.adminPreview && (
            <div className="admin-preview-banner" role="status">
              <span className="admin-preview-icon" aria-hidden="true">
                <Icon name="shield" />
              </span>
              <p>
                <strong>Administrator preview</strong>
                <span>
                  Viewing {session.name}&apos;s student portal as {session.adminPreview.name}.
                </span>
              </p>
              <button className="btn btn--ghost btn--sm" type="button" onClick={exitAdminPreview}>
                <Icon name="chevron-left" /> Return to admin
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
