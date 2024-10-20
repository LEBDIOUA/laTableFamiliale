import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/utilisateurSlice";

function Connection() {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const seConnecter = async () => {
    setErrorMessage(null); // Réinitialiser l'erreur avant la nouvelle tentative
    try {
      await dispatch(login(emailRef.current.value, passRef.current.value));
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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
    <main className="connectionPage">
      <form className="form_connection">
        <label htmlFor="email" className="form_connection_label">
          Email :{" "}
        </label>
        <input id="email" type="text" tabIndex={0} className="form_connection_input" ref={emailRef} />

        <label htmlFor="password" className="form_connection_label">
          Mot de passe :{" "}
        </label>
        <div className={`form_connection_input form_connection_div ${isFocused ? "focused" : ""}`}>
          <input id="password" type="password" tabIndex={1} className="form_connection_input" ref={passRef} onFocus={handleFocus} onBlur={handleBlur} />
          <p className="eye-btn btn" onClick={visiblityPassword}>
            x
          </p>
        </div>

        <button
          className="form_connection_btn btn"
          onClick={(e) => {
            e.preventDefault();
            seConnecter();
          }}
        >
          Se connecter
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </main>
  );
}
export default Connection;
