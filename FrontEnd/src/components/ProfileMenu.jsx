import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { logout } from "../redux/slices/utilisateurSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@lebdioua/react-modal-plugin";
import "@lebdioua/react-modal-plugin/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProfileMenu({ valueRef }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const statutLogin = {
    utilisateur: useSelector((state) => state.utilisateur),
    err: useSelector((state) => state.error),
  };

  const handelLogout = () => {
    setShowModal(true);
  };

  const fermer = () => {
    setShowModal(false);
  };

  const seDeconnecter = () => {
    dispatch(logout());
  };
  const voirProfil = () => {
    window.location = "/profile";
  };

  return (
    <>
      <div className="profile-menu hide" ref={valueRef}>
        <div className="profile-menu-header">
          <p className="profile-menu-header-title">{statutLogin.utilisateur.prenom ?? statutLogin.utilisateur.email}</p>
          <img src="profil.png" alt="Image illustrant profil" title={statutLogin.utilisateur.nom ?? statutLogin.utilisateur.email} className="profile-menu-header-photo" />
          <FontAwesomeIcon icon={["fas", "pen"]} className="profile-menu-header-icon-update btn" onClick={voirProfil} />
        </div>
        <div className="profile-menu-content">
          {statutLogin.utilisateur.nom && (
            <p>
              {statutLogin.utilisateur.nom} {statutLogin.utilisateur.prenom}
            </p>
          )}
          <p>{statutLogin.utilisateur.email}</p>
        </div>
        <div className="profile-menu-footer btn" onClick={handelLogout}>
          Se Déconnecter
        </div>
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={fermer}
          title="Confirmation"
          messageBody="Voulez vous vous déconnecter"
          actions={[
            { label: "Oui", actionFor: seDeconnecter },
            { label: "Non", actionFor: fermer },
          ]}
          modalRef={modalRef}
        />
      )}
    </>
  );
}
export default ProfileMenu;
