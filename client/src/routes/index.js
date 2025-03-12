import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPageContainer from "../layouts/UserPageContainer";
import AdminPageContainer from "../layouts/AdminPageContainer";
import Home from "../views/app-views/Home";
import Register from "../views/auth-views/Register";
import Login from "../views/auth-views/Login";
import AdminLogin from "../views/auth-views/AdminLogin";
import Dashboard from "../views/app-views/Dashboard";
import AdminDashboard from "../views/app-views/AdminDashboard";
import UpdateProfile from "../views/app-views/UpdateProfile";
import UserViewProfile from "../views/app-views/UserViewProfile";
import Cadre from "../components/admin/Cadre";
import UserManagement from "../components/admin/UserManagement";
import Test from "../views/Test";
import NotFound from "../views/NotFound";
import AdminManagement from "../components/admin/AdminManagement";

const authRoutes = [
  { path: "/", element: <Home /> },
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

      <Route path="/test" element={<Test />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default RoutesPage;
