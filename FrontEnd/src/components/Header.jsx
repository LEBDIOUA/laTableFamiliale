import { NavLink } from "react-router-dom";

function Header() {

  return (
    <>
      <header className="header">
        <div className="header_logo">
          <img src="logo2.png" title="La table familiale" id="imgLogo" />
        </div>
        <div className="header_content">
          <div className="header_titre">
            <h1>La table familiale : Là où recettes et souvenirs se rencontrent</h1>
            <h2>Partageons nos saveurs, cultivons nos souvenirs et rions ensemble autour de la table</h2>
          </div>
          <div className="header_menulogin">
            <nav className="header_menu">
              <NavLink to="/" className="header_menu_item">
                Accueil
              </NavLink>
              <NavLink to="/recettes" className="header_menu_item">
                Recette
              </NavLink>
              <NavLink to="/" className="header_menu_item">
                Souvenir
              </NavLink>
              <NavLink to="/" className="header_menu_item">
                Contact
              </NavLink>
            </nav>
            <div className="header_authentification">
              <NavLink to="/connection" className="header_menu_item header_authentification_item">
                Se connecter
              </NavLink>
              <NavLink to="/inscription" className="header_menu_item header_authentification_item">
                S&apos;inscrire
              </NavLink>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
