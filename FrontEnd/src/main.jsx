import { createRoot } from "react-dom/client";
import "./stylesheets/css/style.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Accueil from "./pages/Accueil.jsx";
import Recette from "./pages/Recette.jsx";
import Connection from "./pages/connection.jsx";
import Inscription from "./pages/Inscription.jsx";
import { Provider } from "react-redux";
import { myStore } from "./redux/myStore.js";

const App = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/recettes" element={<Recette />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/inscription" element={<Inscription />} />
      </Routes>

      {location.pathname !== "/connection" && location.pathname !== "/inscription"  &&(
        <>
          <aside className="menuAside">Menu principal</aside>
          <footer className="footer">Pied de page</footer>
        </>
      )}
    </>
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
