import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

const UserPageContainer = lazy(() => import("../layouts/UserPageContainer"));
const AdminPageContainer = lazy(() => import("../layouts/AdminPageContainer"));
const Home = lazy(() => import("../views/appViews/Home"));
const Register = lazy(() => import("../views/authViews/Register"));
const Login = lazy(() => import("../views/authViews/Login"));
const AdminLogin = lazy(() => import("../views/authViews/AdminLogin"));
const Dashboard = lazy(() => import("../views/appViews/Dashboard"));
const AdminDashboard = lazy(() => import("../views/appViews/AdminDashboard"));
const UpdateProfile = lazy(() => import("../views/appViews/UpdateProfile"));
const UserViewProfile = lazy(() =>
  import("../views/appViews/UserViewProfile")
);
const Cadre = lazy(() => import("../components/admin/Cadre"));
const UserManagement = lazy(() => import("../components/admin/UserManagement"));
const Test = lazy(() => import("../views/Test"));
const NotFound = lazy(() => import("../views/NotFound"));
const AdminManagement = lazy(() =>
  import("../components/admin/AdminManagement")
);
const TransferWindow = lazy(() => import("../components/admin/TransferWindow"));
const TransferApplication = lazy(() => import("../components/user/TransferApplication"));
const MyApplications = lazy(() => import("../components/user/MyApplications"));
const TransferApplications =lazy(() => import ("../components/admin/TransferApplications"));
const NotAppliedUsers =lazy(() => import ("../components/admin/NotAppliedUsers"));


const userRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/update-profile", element: <UpdateProfile /> },
  {
    path: "/dashboard/transfer-management/transfer-window",
    element: <TransferWindow />,
  },
  {
    path: "/dashboard/transfer-management/transfer-applications",
    element: <TransferApplication />,
  },
  {
    path: "/dashboard/transfer-management/my-applications",
    element: <MyApplications />,
  },
];

const adminRoutes = [
  { path: "/admin_dashboard", element: <AdminDashboard /> },
  {
    path: "/admin_dashboard/transfer-management/transfer-window",
    element: <TransferWindow />,
  },
  {
    path: "/admin_dashboard/transfer-management/transfer-applications",
    element: <TransferApplications />,
  },
  {
    path: "/admin_dashboard/transfer-management/notApllied-user",
    element: <NotAppliedUsers />,
  },
  { path: "/admin_dashboard/admin-management", element: <AdminManagement /> },
  { path: "/admin_dashboard/user-management", element: <UserManagement /> },
  { path: "/admin_dashboard/cadre-management", element: <Cadre /> },
  { path: "/admin_dashboard/view-profile/:id", element: <UserViewProfile /> },
];

const RoutesPage = () => (
  <Router>
    <Suspense
      fallback={
        <div
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
        </div>
      }
    >
      <Routes>
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
        <Route path="/login" element={<Login />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);

export default RoutesPage;
