import MainLayout from "../layouts/MainLayout";

export default function AdminDashboard() {
  // MainLayout already handles role-based upload; this route is for admins/companies
  return <MainLayout />;
}

