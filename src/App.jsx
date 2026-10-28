import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { IconSprite } from "./components/Icon";
import PageLoader from "./components/Loader";
import PortalLayout from "./components/Layout";
import { Toasts } from "./components/Ui";
import { BOOT_LOADER_MS } from "./lib/timing";
import SignIn from "./pages/SignIn";
import AdminOverview from "./pages/admin/Overview";
import AdminStudents from "./pages/admin/Students";
import AdminCourses from "./pages/admin/Courses";
import AdminFinance from "./pages/admin/Finance";
import StudentOverview from "./pages/student/Overview";
import StudentCourses from "./pages/student/Courses";
import StudentFinance from "./pages/student/Finance";

const TITLES = {
  "/": "Sign in",
  "/admin": "Admin overview",
  "/admin/students": "Students",
  "/admin/courses": "Courses",
  "/admin/finance": "Finance",
  "/student": "Student overview",
  "/student/courses": "My courses",
  "/student/courses/registration": "Registration",
  "/student/courses/grades": "Grades",
  "/student/finance": "Fees & payments"
};

function AdminRoutes({ route }) {
  switch (route) {
    case "/admin/students":
      return <AdminStudents />;
    case "/admin/courses":
      return <AdminCourses />;
    case "/admin/finance":
      return <AdminFinance />;
    case "/admin":
      return <AdminOverview />;
    default:
      return <AdminOverview />;
  }
}

function StudentRoutes({ route }) {
  switch (route) {
    case "/student/courses":
      return <StudentCourses initialTab="courses" />;
    case "/student/courses/registration":
      return <StudentCourses initialTab="registration" />;
    case "/student/courses/grades":
      return <StudentCourses initialTab="grades" />;
    case "/student/finance":
      return <StudentFinance />;
    case "/student":
      return <StudentOverview />;
    default:
      return <StudentOverview />;
  }
}

function AppBody() {
  const { session, route, routeLoading } = useApp();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), BOOT_LOADER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = `${TITLES[route] || "Workspace"} · Deborah University`;
  }, [route]);

  const loaderMessage = booting ? "Preparing your campus workspace…" : "Loading page…";

  return (
    <>
      <IconSprite />
      <PageLoader visible={booting || routeLoading} message={loaderMessage} />

      {!session ? (
        <SignIn />
      ) : (
        <PortalLayout>
          {session.role === "admin" ? (
            <AdminRoutes route={route} />
          ) : (
            <StudentRoutes route={route} />
          )}
        </PortalLayout>
      )}

      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppBody />
    </AppProvider>
  );
}
