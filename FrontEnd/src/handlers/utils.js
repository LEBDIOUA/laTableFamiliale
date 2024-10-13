function getUtilisateur(){
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
}
export default getUtilisateur;