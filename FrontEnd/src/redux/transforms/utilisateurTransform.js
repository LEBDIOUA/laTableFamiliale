import { createTransform } from "redux-persist";

// Transformer pour fusionner les données avant de les stocker
const utilisateurTransform = createTransform(
  // Fonction avant de sauvegarder dans localStorage
  (inboundState) => {
    const storedData = JSON.parse(localStorage.getItem("persist:root")) || {};
    let utilisateur = storedData.utilisateur;

    if (!utilisateur || typeof utilisateur !== "object") utilisateur = {};
    if (inboundState && inboundState.email) {
      utilisateur = {
        token: utilisateur ? utilisateur.token : inboundState.token ?? {},
        nom: inboundState?.nom ?? null,
        prenom: inboundState?.prenom ?? null,
        email: inboundState?.email ?? null,
        roles: inboundState?.roles?.length ? inboundState.roles : utilisateur.roles,
      };
    } else {
      utilisateur = {};
    }

    storedData.utilisateur = JSON.stringify(utilisateur);
    localStorage.setItem("persist:root", JSON.stringify(storedData));

    return utilisateur;
  },

  // Fonction avant de réhydrater les données depuis le storage
  (outboundState) => {
    const storedData = JSON.parse(localStorage.getItem("persist:root"));
    const utilisateur = JSON.parse(storedData.utilisateur) || null;

    return storedData && utilisateur
      ? {
          ...outboundState,
          ...utilisateur,
        }
      : outboundState;
  },
  { whitelist: ["utilisateur"] },
);

export default utilisateurTransform;
