import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo-circle">O</div>
          <div className="navbar-brand">
            <div className="navbar-title">OpsMind AI</div>
            <div className="navbar-tagline">
              {user?.role
                ? `Signed in as ${user.role.toUpperCase()}`
                : "Operational Knowledge Brain"}
            </div>
          </div>
        </div>
        <div className="navbar-right">
          {user?.role && (
            <span className="card-badge" style={{ marginRight: 8 }}>
              {user.role.toUpperCase()}
            </span>
          )}
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

