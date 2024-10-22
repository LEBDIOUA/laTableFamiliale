import { useRef, useState } from "react";
import { useSelector } from "react-redux";
function Profile() {
  const statutLogin = {
    utilisateur: useSelector((state) => state.utilisateur),
    err: useSelector((state) => state.error),
  };
  const nomRef = useRef(null);
  const prenomRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(!isFocused);
  };

  const visiblityPassword = () => {
    passRef.current.type === "password" ? (passRef.current.type = "text") : (passRef.current.type = "password");
  };

  return (
    <main>
      <form className="form-profil">
        <div className="photo">
          <img src="profil.png" alt="Image illustrant profil" title={statutLogin.utilisateur.nom ?? statutLogin.utilisateur.email} className="form-profile-photo" />
          <label htmlFor="photo" className="form-connection-label">
            Nom :{" "}
          </label>
          <input id="nom" type="text" tabIndex={0} className="form-connection-input" ref={nomRef} value={statutLogin.utilisateur.nom ?? ""} />
        </div>
        <div className="nom">
          <label htmlFor="nom" className="form-connection-label">
            Nom :{" "}
          </label>
          <input id="nom" type="text" tabIndex={0} className="form-connection-input" ref={nomRef} value={statutLogin.utilisateur.nom ?? ""} />
        </div>
        <div className="prenom">
          <label htmlFor="prenom" className="form-connection-label">
            Prenom :{" "}
          </label>
          <input id="prenom" type="text" tabIndex={1} className="form-connection-input" ref={prenomRef} value={statutLogin.utilisateur.prenom ?? ""} />
        </div>
        <div className="email">
          <label htmlFor="email" className="form-connection-label">
            Email :{" "}
          </label>
          <input id="email" type="text" tabIndex={3} className="form-connection-input" ref={emailRef} value={statutLogin.utilisateur.email} disabled />
        </div>
        <div className="password">
          <label htmlFor="password" className="form-connection-label">
            Mot de passe :{" "}
          </label>
          <div className={`form-connection-input form-connection-div ${isFocused ? "focused" : ""}`}>
            <input id="password" type="password" tabIndex={4} className="form-connection-input" ref={passRef} onFocus={handleFocus} onBlur={handleBlur} />
            <p className="eye-btn btn" onClick={visiblityPassword}>
              x
            </p>
          </div>
        </div>
        <div className="confirm-password">
          <label htmlFor="confirm-password" className="form-connection-label">
            Confirmez le mot de passe :{" "}
          </label>
          <div className={`form-connection-input form-connection-div ${isFocused ? "focused" : ""}`}>
            <input id="confirm-password" type="password" tabIndex={1} className="form-connection-input" ref={confirmPassRef} onFocus={handleFocus} onBlur={handleBlur} />
            <p className="eye-btn btn" onClick={visiblityPassword}>
              x
            </p>
          </div>
        </div>
        {/* 
        <button
          className="form-connection-btn btn"
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
