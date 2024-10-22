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

  const controlProfileMenu = () => {
    console.log("click");
    profileMenuRef.current.classList.toggle("hide");
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <img src="logo2.png" title="La table familiale" id="imgLogo" />
        </div>
        <div className="header-content">
          <div className="header-titre">
            <h1>La table familiale : Là où recettes et souvenirs se rencontrent</h1>
            <h2>Partageons nos saveurs, cultivons nos souvenirs et rions ensemble autour de la table</h2>
          </div>
          <div className="header-menulogin">
            <nav className="header-menu">
              <NavLink to="/" className="header-menu-item">
                Accueil
              </NavLink>
              <NavLink to="/recettes" className="header-menu-item">
                Recettes
              </NavLink>
              <NavLink to="/" className="header-menu-item">
                Souvenir
              </NavLink>
              <NavLink to="/" className="header-menu-item">
                Contact
              </NavLink>
            </nav>

            {(!statutLogin.utilisateur || Object.keys(statutLogin.utilisateur).length === 0) && (
              <div className="header-authentification">
                <NavLink to="/connection" className="header-menu-item header-authentification-item">
                  Se connecter
                </NavLink>
                <NavLink to="/inscription" className="header-menu-item header-authentification-item">
                  S&apos;inscrire
                </NavLink>
              </div>
            )}
            {statutLogin.utilisateur && Object.keys(statutLogin.utilisateur).length > 0 && (
              <div className="header-authentification">
                <img onClick={controlProfileMenu} src="profil.png" alt="Image illustrant profil" title={statutLogin.utilisateur.nom ?? statutLogin.utilisateur.email} className="header-authentification-profil btn" />
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
