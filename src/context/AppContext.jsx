import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ADMIN_ACCOUNTS,
  buildStudentFinance,
  NOTIFICATIONS,
  STUDENTS,
  STUDENT_ACCOUNTS,
  studentAccount
} from "../data";
import { naira, uid } from "../lib/format";

const AppContext = createContext(null);

const SESSION_KEY = "deborah.session.v2";
const FINANCE_KEY = "deborah.finance.v3";
const LEGACY_FINANCE_KEY = "deborah.finance.v2";

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mergeFinance(saved, fallback) {
  if (!saved || typeof saved !== "object") return fallback;
  return {
    ...fallback,
    ...saved,
    plan: Array.isArray(saved.plan) ? saved.plan : fallback.plan,
    payments: Array.isArray(saved.payments) ? saved.payments : fallback.payments
  };
}

function readFinances() {
  const next = Object.fromEntries(
    STUDENTS.map((student) => [student.id, buildStudentFinance(student)])
  );

  try {
    const raw = localStorage.getItem(FINANCE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.keys(next).forEach((id) => {
        if (saved?.[id]) next[id] = mergeFinance(saved[id], next[id]);
      });
      return next;
    }

    const legacy = localStorage.getItem(LEGACY_FINANCE_KEY);
    if (legacy && next[STUDENTS[0].id]) {
      next[STUDENTS[0].id] = mergeFinance(JSON.parse(legacy), next[STUDENTS[0].id]);
    }
  } catch {
    /* fall back to seeded records */
  }

  return next;
}

function getRoute() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function safeAccount(account) {
  const { password, ...safe } = account;
  return safe;
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [route, setRoute] = useState(getRoute);
  const [routeLoading, setRouteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [finances, setFinances] = useState(readFinances);
  const routeTimer = useRef(null);
  const activeStudentId = session?.role === "student" ? session.id : STUDENTS[0].id;
  const finance =
    finances[activeStudentId] ??
    (session?.role === "student" ? buildStudentFinance(session) : buildStudentFinance(STUDENTS[0]));

  useEffect(() => {
    const onHashChange = () => {
      const next = getRoute();
      setRoute(next);
      setSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      setRouteLoading(true);
      window.clearTimeout(routeTimer.current);
      routeTimer.current = window.setTimeout(() => setRouteLoading(false), 420);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.clearTimeout(routeTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage can be unavailable in private modes */
    }
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(FINANCE_KEY, JSON.stringify(finances));
    } catch {
      /* storage can be unavailable in private modes */
    }
  }, [finances]);

  const navigate = useCallback(
    (path) => {
      const next = path.startsWith("/") ? path : `/${path}`;
      if (getRoute() === next) {
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setRoute(next);
      window.location.hash = next;
    },
    []
  );

  const login = useCallback(
    (role, email, password) => {
      const normalized = email.trim().toLowerCase();

      if (role === "admin") {
        const account = ADMIN_ACCOUNTS.find(
          (item) => item.email.toLowerCase() === normalized
        );
        if (!account) {
          return { ok: false, error: "That email is not registered for the admin portal." };
        }
        if (password !== account.password) {
          return {
            ok: false,
            error: "Incorrect password. Administrator demo accounts use admin123."
          };
        }
        setSession(safeAccount(account));
        navigate("/admin");
        return { ok: true };
      }

      const account = STUDENT_ACCOUNTS.find(
        (item) => item.email.toLowerCase() === normalized
      );
      if (!account) {
        return {
          ok: false,
          error: "That student email is not in the Deborah directory."
        };
      }
      if (password !== account.password) {
        return {
          ok: false,
          error: "Incorrect password. Student demo accounts use student123."
        };
      }
      setSession(safeAccount(account));
      navigate("/student");
      return { ok: true };
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setSession(null);
    setSidebarOpen(false);
    navigate("/");
  }, [navigate]);

  const toast = useCallback((message, tone = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const openStudentPortal = useCallback(
    (student) => {
      if (!session || session.role !== "admin" || !student) return;
      const account = studentAccount(student);
      setSession({
        ...safeAccount(account),
        adminPreview: session
      });
      setSidebarOpen(false);
      navigate("/student");
      toast(`Viewing ${student.first} ${student.last}'s student portal.`, "info");
    },
    [session, navigate, toast]
  );

  const exitAdminPreview = useCallback(() => {
    if (!session?.adminPreview) return;
    setSession(session.adminPreview);
    setSidebarOpen(false);
    navigate("/admin/students");
    toast("Returned to the administrator portal.", "info");
  }, [session, navigate, toast]);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  }, []);

  const balance = Math.max(0, finance.totalTuition - finance.scholarship - finance.paid);

  const payTuition = useCallback(
    (amount, method) => {
      const numeric = Math.max(0, Math.floor(Number(amount) || 0));
      const currentBalance = Math.max(
        0,
        finance.totalTuition - finance.scholarship - finance.paid
      );
      const value = Math.min(numeric, currentBalance);
      if (!value) return null;
      const payment = {
        ref: uid("PAY-2026"),
        date: new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
          .format(new Date())
          .replace(/^(\d{2}) (\w{3}) (\d{4})$/, "$1 $2 $3"),
        amount: value,
        method,
        status: "Completed"
      };
      setFinances((current) => {
        const activeFinance = current[activeStudentId] ?? finance;
        return {
          ...current,
          [activeStudentId]: {
            ...activeFinance,
            paid: activeFinance.paid + value,
            payments: [payment, ...activeFinance.payments]
          }
        };
      });
      toast(`${naira(value)} payment received. Your receipt is ready.`, "success");
      return payment;
    },
    [activeStudentId, finance, toast]
  );

  useEffect(() => {
    if (!session) {
      if (route !== "/") navigate("/");
      return;
    }
    if (route === "/") {
      navigate(session.role === "admin" ? "/admin" : "/student");
      return;
    }
    if (session.role === "student" && route.startsWith("/admin")) {
      navigate("/student");
    }
    if (session.role === "admin" && route.startsWith("/student")) {
      navigate("/admin");
    }
  }, [session, route, navigate]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      route,
      navigate,
      routeLoading,
      sidebarOpen,
      setSidebarOpen,
      toasts,
      toast,
      dismissToast,
      notifications,
      unreadCount,
      markAllRead,
      markRead,
      finance,
      balance,
      payTuition,
      openStudentPortal,
      exitAdminPreview
    }),
    [
      session,
      login,
      logout,
      route,
      navigate,
      routeLoading,
      sidebarOpen,
      toasts,
      toast,
      dismissToast,
      notifications,
      unreadCount,
      markAllRead,
      markRead,
      finance,
      balance,
      payTuition,
      openStudentPortal,
      exitAdminPreview
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
