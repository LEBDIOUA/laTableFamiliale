import { createTransform } from "redux-persist";

// Transformer pour fusionner les données avant de les stocker
const utilisateurTransform = createTransform(
  // Fonction avant de sauvegarder dans localStorage
  (inboundState) => {
    const storedData = JSON.parse(localStorage.getItem("persist:root")) || {};
    let utilisateur = storedData.utilisateur;

    console.log("utilisateurTransform (avant) : ", utilisateur);

    if(!utilisateur || typeof(utilisateur) !== "object") utilisateur = {};
    utilisateur.token = utilisateur ? utilisateur.token : inboundState.token?? {};
    utilisateur.nom = inboundState.nom;
    utilisateur.prenom = inboundState.prenom;
    utilisateur.email = inboundState.email;
    utilisateur.roles = inboundState.roles?.length ? inboundState.roles : utilisateur.roles;

    storedData.utilisateur = JSON.stringify(utilisateur);
    localStorage.setItem("persist:root", JSON.stringify(storedData));

    console.log("utilisateurTransform (apres) : ", utilisateur);

    return utilisateur;
  },

  // Fonction avant de réhydrater les données depuis le storage
  (outboundState) => {
    const storedData = JSON.parse(localStorage.getItem("persist:root"));
    const utilisateur = JSON.parse(storedData.utilisateur || "{}");

    return storedData
      ? {
          ...outboundState,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          roles: utilisateur.roles,
        }
      : outboundState;
  },
  { whitelist: ["utilisateur"] },
);

export default utilisateurTransform;
