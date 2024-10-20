import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const profileMenuRef = useRef(null);
  const statutLogin = {
    utilisateur: useSelector((state) => state.utilisateur),
    err: useSelector((state) => state.error),
  };
  console.log("utilisateur header  :  ", statutLogin.utilisateur);
  console.log("error header  :  ", statutLogin.err);

  const controlProfileMenu = () => {
    console.log("click");
    profileMenuRef.current.classList.toggle("hide");
  };

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
                Recettes
              </NavLink>
              <NavLink to="/" className="header_menu_item">
                Souvenir
              </NavLink>
              <NavLink to="/" className="header_menu_item">
                Contact
              </NavLink>
            </nav>

            {(!statutLogin.utilisateur || Object.keys(statutLogin.utilisateur).length === 0) && (
              <div className="header_authentification">
                <NavLink to="/connection" className="header_menu_item header_authentification_item">
                  Se connecter
                </NavLink>
                <NavLink to="/inscription" className="header_menu_item header_authentification_item">
                  S&apos;inscrire
                </NavLink>
              </div>
            )}
            {statutLogin.utilisateur && Object.keys(statutLogin.utilisateur).length > 0 && (
              <div className="header_authentification">
                <img src="profil.png" alt="Image illustrant profil" title={statutLogin.utilisateur.nom ?? statutLogin.utilisateur.email} className="header_authentification_profil" />
                <div className="header_authentification_userData">
                  {statutLogin.utilisateur.nom && (
                    <p>
                      {statutLogin.utilisateur.nom}
                      {statutLogin.utilisateur.prenom}
                    </p>
                  )}
                  <p>{statutLogin.utilisateur.email}</p>
                </div>
                <div className="header_authentification_detail" aria-placeholder="Cliquez ici pour voir votre profil" onClick={controlProfileMenu}>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <ProfileMenu valueRef={profileMenuRef} />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
