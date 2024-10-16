import { NavLink } from "react-router-dom";

function AsideMenu() {
  return (
    <aside className="menuAside">
      <NavLink to="recette" className="menuAside_slide">
        <img
          src="meilleurRecette.png"
          alt="Image illustrant la meilleure recette"
          title="meilleur recette"
          className="menuAside_img imgRecette"
        />
        <h2>Meilleur recette</h2>
      </NavLink>

      <h2 className="menuAside_txt menuAside_slide">Citation du jour</h2>
    </aside>
  );
}
export default AsideMenu;
