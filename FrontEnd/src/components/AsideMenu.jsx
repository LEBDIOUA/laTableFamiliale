import { NavLink } from "react-router-dom";

function AsideMenu() {
  return (
    <aside className="menuAside">
      <NavLink to="recette" className="menuAside-slide">
        <img
          src="meilleurRecette.png"
          alt="Image illustrant la meilleure recette"
          title="meilleur recette"
          className="menuAside-img imgRecette"
        />
        <h2>Meilleur recette</h2>
      </NavLink>

      <h2 className="menuAside-txt menuAside-slide">Citation du jour</h2>
    </aside>
  );
}
export default AsideMenu;
