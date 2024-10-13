import axios from "axios";

class API {
  static instance = null;
  static getInstance() {
    if (this.instance === null) {
      this.instance = new API();
    }

    return this.instance;
  }

  constructor() {
    this.token = this.getTokenFromStorage() ?? null;
    this.DB_URL = import.meta.REACT_APP_API_URL || "https://127.0.0.1:8000";

    // Axios instance
    this.axiosInstance = axios.create({
      baseURL: this.DB_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  // Centraliser la logique d'interception pour ajouter le token et gérer les erreurs
  initializeInterceptors() {
    // Intercepter les requêtes pour ajouter le token si disponible
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.token ?? this.getTokenFromStorage();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    // Intercepter les réponses pour gérer les erreurs
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Gestion des erreurs globales (ex: 401 non autorisé)
        if (error.response && error.response.status === 401) {
          // Option de redirection vers la page de login ou gestion du refresh token
          console.error("Unauthorized access - perhaps you need to log in again.");
        }
        return Promise.reject(error);
      },
    );
  }

  // Récupérer le token du localStorage
  getTokenFromStorage() {
    const storedData = JSON.parse(localStorage.getItem("persist:root")) || {};
    const utilisateur = storedData.utilisateur || {};

    const token = utilisateur ? utilisateur.token : null;
    return token;
  }

  buildEndpoint(endpoint) {
    const endpoints = {
      GET_LOGIN: { url: "/api/login", content_type: "application/json" },
      GET_RECETTES: { url: "/api/recettes", content_type: "application/json" },
      GET_TOKEN: { url: "api/login", content_type: "application/json" },
      GET_UTILISATEUR: { url: "/api/utilisateur", content_type: "application/json" },
    };
    return endpoints[endpoint];
  }

  // Gérer la récupération du token de manière propre (via un service d'authentification ou React Context)
  async getToken(email, password) {
    if (email && password) {
      let endpointConfig = this.buildEndpoint("GET_TOKEN");
      try {
        const response = await this.axiosInstance.post(endpointConfig.url, {
          email: email,
          motDePasse: password,
        });
        // this.token = response.data.token;
        const storedData = JSON.parse(localStorage.getItem("persist:root")) || {};
        const utilisateur = storedData.utilisateur
          ? JSON.parse(storedData.utilisateur) && typeof JSON.parse(storedData.utilisateur) === "object"
            ? JSON.parse(storedData.utilisateur)
            : {}
          : {};

        utilisateur.token = response.data.token;
        storedData.utilisateur = utilisateur;
        localStorage.setItem("persist:root", JSON.stringify(storedData));

        return { token: response.data.token };
      } catch (error) {
        console.error("Error fetching user token:", error.message);
        return { err: error };
      }
    } else {
      const data = JSON.parse(localStorage.getItem("persist:root")) || {};
      const utilisateur = data.utilisateur || {};
      return { token: utilisateur ? utilisateur.token : null };
    }
  }

  async login(email, password) {
    let endpointConfig = this.buildEndpoint("GET_UTILISATEUR");
    const responseGetToken = await this.getToken(email, password);
    try {
      if (responseGetToken.err) return { err: responseGetToken.err };
      else if (responseGetToken.token) {
        const response = await this.axiosInstance.get(endpointConfig.url);
        let data = response.data;
        data.email = email;
        return { data: data };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return { err: error, data: null };
    }
  }

  async getRecettes() {
    const endpointConfig = this.buildEndpoint("GET_RECETTES");
    try {
      const response = await this.axiosInstance.get(endpointConfig.url);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching recettes:", error);
      return { err: error };
    }
  }
}
export default API.getInstance();
