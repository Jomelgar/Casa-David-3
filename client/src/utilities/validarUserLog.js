export function validarPrivilegio(user, privilegio) {
  if (!user) return false;
  if(user.role === "master") return true;
  if (user.role === "admin" && privilegio < 11) return true;
  
  const valid = user.privilegios.includes(privilegio)
  console.log("User incluye privilegio: ", valid)
  return valid;
};
