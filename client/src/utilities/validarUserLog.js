export function validarPrivilegio(user, privilegio) {
  if (!user) return false;
  if(user.role === "master") return true;
  if (privilegio === 11) return false;
  if(user.role === "admin") return true;
  const valid = user.privilegios.includes(privilegio)
  console.log("User incluye privilegio: ", valid)
  return valid;
};
