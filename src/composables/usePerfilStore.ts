export const usePerfilStore = () => {

  const registrarToken = (token: string) => {
    if (token && token.trim() !== ""){      
      let login = atob(token).split(",")[0];
      localStorage.setItem("login", login);
      localStorage.setItem("token", token);
    }
  }

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
  }

  const isTokenValido = (): boolean => {

    let token = localStorage.getItem("token");

    if (token && token.trim() !== ""){            
      let validadeInMillis = parseInt(atob(token).split(",")[1]);
      let agoraInMillis = new Date().getTime();
      return validadeInMillis > agoraInMillis;
    }

    return false;
    
  }

  const getToken = (): string => {
    return localStorage.getItem("token") ?? "";
  }

  const getLogin = (): string => {
    return localStorage.getItem("login") ?? "Usuário";
  }

  return {
    registrarToken,
    logout,
    isTokenValido,
    getToken,
    getLogin
  }

};
