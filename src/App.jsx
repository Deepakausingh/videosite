import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={isHomePage ? "app-shell home-shell" : "app-shell"}>
      <div className={isHomePage ? "bg-glow" : ""} />

      <header className={isHomePage ? "topbar home-topbar" : "topbar"}>
        <div>
          {isHomePage ? (
            <>
              <h1 className="home-title">Feed</h1>
              <p className="home-subtitle">Curated minimalist content</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Streaming Showcase</p>
              <h1>Video Site</h1>
            </>
          )}
        </div>

        <nav className={isHomePage ? "nav fab-group" : "nav"}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isHomePage
                ? isActive
                  ? "nav-link fab fab-home active"
                  : "nav-link fab fab-home"
                : isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isHomePage
                ? isActive
                  ? "nav-link fab fab-upload active"
                  : "nav-link fab fab-upload"
                : isActive
                  ? "nav-link active"
                  : "nav-link"
            }
          >
            Upload
          </NavLink>
        </nav>
      </header>

      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
