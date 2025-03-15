import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

const UserPageContainer = lazy(() => import("../layouts/UserPageContainer"));
const AdminPageContainer = lazy(() => import("../layouts/AdminPageContainer"));
const Home = lazy(() => import("../views/app-views/Home"));
const Register = lazy(() => import("../views/auth-views/Register"));
const Login = lazy(() => import("../views/auth-views/Login"));
const AdminLogin = lazy(() => import("../views/auth-views/AdminLogin"));
const Dashboard = lazy(() => import("../views/app-views/Dashboard"));
const AdminDashboard = lazy(() => import("../views/app-views/AdminDashboard"));
const UpdateProfile = lazy(() => import("../views/app-views/UpdateProfile"));
const UserViewProfile = lazy(() =>
  import("../views/app-views/UserViewProfile")
);
const Cadre = lazy(() => import("../components/admin/Cadre"));
const UserManagement = lazy(() => import("../components/admin/UserManagement"));
const Test = lazy(() => import("../views/Test"));
const NotFound = lazy(() => import("../views/NotFound"));
const AdminManagement = lazy(() =>
  import("../components/admin/AdminManagement")
);

const authRoutes = [
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/admin_login", element: <AdminLogin /> },
];



const userRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/update-profile", element: <UpdateProfile /> },
];



const adminRoutes = [
  { path: "/admin_dashboard", element: <AdminDashboard /> },
  { path: "/admin_dashboard/admin-management", element: <AdminManagement /> },
  { path: "/admin_dashboard/user-management", element: <UserManagement /> },
  { path: "/admin_dashboard/cadre-management", element: <Cadre /> },
  { path: "/admin_dashboard/view-profile/:id", element: <UserViewProfile /> },
];

const RoutesPage = () => (
  <Router>
    <Suspense fallback={ <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Spin
            size="large"
            tip="Loading..."
            style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
          />
        </div>}>
      <Routes>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route element={<UserPageContainer />}>
          {userRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route element={<AdminPageContainer />}>
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);

export default RoutesPage;
