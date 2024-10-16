import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <h2 className="footer_titre">Des saveurs partagées, des moments inoubliables</h2>
      <div className="footer_topRecettes">
        <h3>Top 5 des recettes</h3>
        <NavLink to="/recette">
          <li>Recette 1</li>
        </NavLink>
        <NavLink to="/recette">
          <li>Recette 2</li>
        </NavLink>
        <NavLink to="/recette">
          <li>Recette 3</li>
        </NavLink>
        <NavLink to="/recette">
          <li>Recette 4</li>
        </NavLink>
        <NavLink to="/recette">
          <li>Recette 5</li>
        </NavLink>
      </div>
      <div className="footer_demandes">
        <li>Devenir Admin</li>
        <li>Commander livre de Cuisine</li>
        <li>Commander album photo</li>
      </div>
      <div className="footer_contact">
        Une question, une suggestion ? N&apos;hésitez pas à nous contacter ! Nous sommes là
      </div>
    </footer>
  );
}
export default Footer;
