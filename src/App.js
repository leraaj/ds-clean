import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/context/useAuthContext";
import Home from "./pages/external/landing/Index";
import Login from "./pages/external/login/Index";
import InternalLayout from "./components/layout/InternalLayout";
import LoadingPage from "./pages/external/LoadingPage";
// Admin Routes
import Accounts from "./pages/internal/admin/accounts/Index";
import Applicants from "./pages/internal/admin/applicants/Index";
import Clients from "./pages/internal/admin/clients/Index";
import Jobs from "./pages/internal/admin/jobs/Index";
// Employee Routes
import Profile from "./pages/internal/employees/profile/Index";
// TEST
import Chats from "./pages/internal/test/Index";
import QRcodePage from "./pages/external/landing/qrcodePage/Index";
import Register from "./pages/external/register/Register";
function App() {
  const { user, isLoading } = useAuthContext();
  const defaultRoutes = [
    {
      isPrivate: false,
      path: "/",
      element:
        user?.position == 1 ? (
          <Navigate to={localStorage.getItem("url") || "/accounts"} replace />
        ) : user?.position == 2 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position == 3 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position === undefined ? (
          <Home />
        ) : (
          <Home />
        ),
    },
    {
      isPrivate: false,
      path: "/login",
      element:
        user?.position == 1 ? (
          <Navigate to={localStorage.getItem("url") || "/accounts"} replace />
        ) : user?.position == 2 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position == 3 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position === undefined ? (
          <Login />
        ) : (
          <Login />
        ),
    },
    {
      isPrivate: false,
      path: "/register",
      element:
        user?.position == 1 ? (
          <Navigate to={localStorage.getItem("url") || "/accounts"} replace />
        ) : user?.position == 2 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position == 3 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position === undefined ? (
          <Register />
        ) : (
          <Register />
        ),
    },
    {
      isPrivate: false,
      path: "/mobile-redirect",
      element:
        user?.position == 1 ? (
          <Navigate to={localStorage.getItem("url") || "/accounts"} replace />
        ) : user?.position == 2 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position == 3 ? (
          <Navigate to={localStorage.getItem("url") || "/profile"} replace />
        ) : user?.position === undefined ? (
          <QRcodePage />
        ) : (
          <QRcodePage />
        ),
    },
  ]; // Routes for admin
  const adminRoutes = [
    {
      isPrivate: true,
      path: "/accounts",
      element: <Accounts />,
    },
    {
      isPrivate: true,
      path: "/clients",
      element: <Clients />,
    },
    {
      isPrivate: true,
      path: "/applicants",
      element: <Applicants />,
    },
    {
      isPrivate: true,
      path: "/jobs",
      element: <Jobs />,
    },
    {
      isPrivate: true,
      path: "/chats",
      element: <Chats />,
    },
    {
      isPrivate: true,
      path: "/profile",
      element: <Profile />,
    },
  ];
  // Routes for applicants/clients users
  const employeeRoutes = [
    {
      isPrivate: true,
      path: "/profile",
      element: <Profile />,
    },
    {
      isPrivate: true,
      path: "/chats",
      element: <Chats />,
    },
    {
      isPrivate: true,
      path: "/profile",
      element: <Profile />,
    },
  ];

  if (isLoading) {
    return <LoadingPage />;
  }
  let routes = [];

  if (user?.position === 1) {
    routes = [...defaultRoutes, ...adminRoutes];
  } else if (user?.position === 2 || user?.position === 3) {
    routes = [...defaultRoutes, ...employeeRoutes];
  } else {
    routes = [...defaultRoutes];
  }

  return (
    <Routes>
      {routes.map((route, index) =>
        route.isPrivate ? (
          <Route key={index} element={<InternalLayout />}>
            <Route {...route} />
          </Route>
        ) : (
          <Route key={index} {...route} />
        )
      )}
      <Route
        path="*"
        element={
          <Navigate
            to={user?.position ? localStorage.getItem("url") : "/"} // Redirect to stored URL if available
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
