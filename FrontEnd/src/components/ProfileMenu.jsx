import { NavLink } from "react-router-dom";
import { Modal } from "@lebdioua/react-modal-plugin";
import "@lebdioua/react-modal-plugin/dist/style.css";
import { useRef, useState } from "react";
import { logout } from "../redux/slices/utilisateurSlice";
import { useDispatch } from "react-redux";

function ProfileMenu({ valueRef }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const handelLogout = () => {
    setShowModal(true);
  };

  const fermer = () => {
    setShowModal(false);
  };

  const seDeconnecter = () => {
    dispatch(logout());
  };

  return (
    <>
      <div className="profile-menu hide" ref={valueRef}>
        <NavLink className="profile-menu-profile profile-menu-item" to="/profile">
          Voir Profil
        </NavLink>
        <li className="profile-menu-logout profile-menu-item" onClick={handelLogout}>
          Se Déconnecter
        </li>
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
