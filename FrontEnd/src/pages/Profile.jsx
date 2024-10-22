import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Profile() {
  const statutLogin = {
    utilisateur: useSelector((state) => state.utilisateur),
    err: useSelector((state) => state.error),
  };
  const nomRef = useRef(null);
  const prenomRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const divConfirmPwRef = useRef(null);
  const divPwRef = useRef(null);
  const confirmPassRef = useRef(null);
  const photoRef = useRef(null);

  const handleFocus = (id) => {
    id === "password" ? divPwRef.current.classList.add("focused") : divConfirmPwRef.current.classList.add("focused");
  };

  const handleBlur = (id) => {
    id === "password" ? divPwRef.current.classList.remove("focused") : divConfirmPwRef.current.classList.remove("focused");
  };

  const visiblityPassword = (currentRef) => {
    currentRef.current.type === "password" ? (currentRef.current.type = "text") : (currentRef.current.type = "password");
  };

  const changeValue = (attribut, value) => {
    console.log(attribut, ": ", value);
  };

  const changePhoto = (e) => {
    const file = e.target.files[0]; 
  if (file) {
    photoRef.current.src = window.URL.createObjectURL(file);
  }
  };

  return (
    <main className="form-profile">
      <form className="form-profile-form">
        <div className="form-profile-form-photo">
          <img src="profil.png" alt="Image illustrant profil" title={statutLogin.utilisateur.nom ?? statutLogin.utilisateur.email} id="photo" ref={photoRef} />
          <div id="update">
            <label htmlFor="nouvellePhoto">Choisir photo de profile:</label>
            <input
              type="file"
              id="nouvellePhoto"
              name="nouvellePhoto"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                changePhoto(e);
              }}
            />
          </div>
        </div>
        <div className="form-profile-form-groups nom">
          <label htmlFor="nom" className="form-profile-label">
            Nom :{" "}
          </label>
          <input
            id="nom"
            type="text"
            tabIndex={0}
            className="form-profile-input"
            ref={nomRef}
            defaultValue={statutLogin.utilisateur.nom ?? ""}
            onChange={(e) => {
              changeValue(e.target.id, e.target.value);
            }}
          />
        </div>
        <div className="form-profile-form-groups prenom">
          <label htmlFor="prenom" className="form-profile-label">
            Prenom :{" "}
          </label>
          <input
            id="prenom"
            type="text"
            tabIndex={1}
            className="form-profile-input"
            ref={prenomRef}
            defaultValue={statutLogin.utilisateur.prenom ?? ""}
            onChange={(e) => {
              changeValue(e.target.id, e.target.value);
            }}
          />
        </div>
        <div className="form-profile-form-groups email">
          <label htmlFor="email" className="form-profile-label">
            Email :{" "}
          </label>
          <input id="email" type="text" tabIndex={3} className="form-profile-input" ref={emailRef} value={statutLogin.utilisateur.email} disabled />
        </div>
        <div className="form-profile-form-groups password">
          <label htmlFor="password" className="form-profile-label">
            Mot de passe :{" "}
          </label>
          <div className="form-profile-form-groups-input form-profile-form-groups-div" ref={divPwRef}>
            <input
              id="password"
              type="password"
              tabIndex={4}
              className="form-profile-input"
              ref={passRef}
              onFocus={(e) => {
                handleFocus(e.target.id);
              }}
              onBlur={(e) => {
                handleBlur(e.target.id);
              }}
              onChange={(e) => {
                changeValue(e.target.id, e.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={["far", "eye"]}
              className="eye-btn btn"
              onClick={() => {
                visiblityPassword(passRef);
              }}
            />
          </div>
        </div>
        <div className="form-profile-form-groups confirm-password">
          <label htmlFor="confirm-password" className="form-profile-label">
            Confirmez le mot de passe :{" "}
          </label>
          <div className="form-profile-form-groups-input form-profile-form-groups-div" ref={divConfirmPwRef}>
            <input
              id="confirm-password"
              type="password"
              tabIndex={1}
              className="form-profile-input"
              ref={confirmPassRef}
              onFocus={(e) => {
                handleFocus(e.target.id);
              }}
              onBlur={(e) => {
                handleBlur(e.target.id);
              }}
              onChange={(e) => {
                changeValue(e.target.id, e.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={["far", "eye"]}
              className="eye-btn btn"
              onClick={() => {
                visiblityPassword(confirmPassRef);
              }}
            />
          </div>
        </div>
        {/* 
        <button
          className="form-profile-btn btn"
          onClick={(e) => {
            e.preventDefault();
            seConnecter();
          }}
        >
          Se connecter
        </button> */}
        {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
      </form>
    </main>
  );
}
export default Profile;
