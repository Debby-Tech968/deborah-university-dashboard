import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_ACCOUNTS, NOTIFICATIONS, STUDENT_FINANCE } from "../data";
import { naira, uid } from "../lib/format";

const AppContext = createContext(null);

const SESSION_KEY = "deborah.session.v2";
const FINANCE_KEY = "deborah.finance.v2";

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readFinance() {
  try {
    const raw = localStorage.getItem(FINANCE_KEY);
    if (!raw) return structuredClone(STUDENT_FINANCE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(STUDENT_FINANCE),
      ...parsed,
      payments: Array.isArray(parsed.payments) ? parsed.payments : STUDENT_FINANCE.payments
    };
  } catch {
    return structuredClone(STUDENT_FINANCE);
  }
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
  const [finance, setFinance] = useState(readFinance);
  const routeTimer = useRef(null);

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
      localStorage.setItem(FINANCE_KEY, JSON.stringify(finance));
    } catch {
      /* storage can be unavailable in private modes */
    }
  }, [finance]);

  const navigate = useCallback(
    (path) => {
      const next = path.startsWith("/") ? path : `/${path}`;
      if (getRoute() === next) {
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.location.hash = next;
    },
    []
  );

  const login = useCallback(
    (role, email, password) => {
      const account = DEMO_ACCOUNTS[role];
      if (!account) return { ok: false, error: "Choose a portal to continue." };
      if (email.trim().toLowerCase() !== account.email.toLowerCase()) {
        return { ok: false, error: "That email is not registered for this portal." };
      }
      if (password !== account.password) {
        return { ok: false, error: "Incorrect password. Use the demo credentials below if needed." };
      }
      setSession(safeAccount(account));
      navigate(role === "admin" ? "/admin" : "/student");
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
      setFinance((current) => ({
        ...current,
        paid: current.paid + value,
        payments: [payment, ...current.payments]
      }));
      toast(`${naira(value)} payment received. Your receipt is ready.`, "success");
      return payment;
    },
    [finance, toast]
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
      payTuition
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
      payTuition
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
