import MainLayout from "../layouts/MainLayout";

export default function UserDashboard() {
  // MainLayout hides upload for user role; this route is for read-only users
  return <MainLayout />;
}

