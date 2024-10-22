import { createRoot } from "react-dom/client";
import "./stylesheets/css/style.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Accueil from "./pages/Accueil.jsx";
import Recette from "./pages/Recette.jsx";
import Recettes from "./pages/Recettes.jsx";
import Connection from "./pages/Connection.jsx";
import Inscription from "./pages/Inscription.jsx";
import { Provider } from "react-redux";
import { myStore } from "./redux/myStore.js";
import AsideMenu from "./components/AsideMenu.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import "./config.js";

const App = () => {
  const location = useLocation();
  const layoutClass =
    location.pathname === "/connection" || location.pathname === "/inscription"
      ? "layout-login"
      : "";
  document.getElementById("root");
  return (
    <div className={`layout ${layoutClass}`}>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/recettes" element={<Recettes />} />
        <Route path="/recette" element={<Recette />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {location.pathname !== "/connection" && location.pathname !== "/inscription" && (
        <>
          <AsideMenu />
          <Footer />
        </>
      )}
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={myStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </>,
);
