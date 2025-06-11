const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const userService = require("../services/userService");
const privilegiosService = require("../services/privilegiosService");
const personaService = require("../services/personaService");
const crypt = require("../cripto/crypto");

exports.login = async (req, res) => {
  try {
    const passwordLogin = req.body.password;

    const user = await userService.getUserByUsername(req.body.username);

    if (user) {
      const passwordCrypt = user.contrasena;

      let compare
      if(!req.body.encrypt) compare = crypt.compare(passwordLogin, passwordCrypt);
      else compare = passwordLogin === passwordCrypt;

      if (!compare) {
        return res.status(401).json({ message: "Contraseña Incorrecta" });
      }
      
      const persona = await personaService.getPersonaById(user.id_persona);

      const privilegios = await privilegiosService.getPrivilegiosByUser(
        user.id_usuario
      );

      const privs = privilegios.map((priv) => {
        return priv.id_privilegio
      })

      const id_pais = await personaService.getPais(user.id_persona);
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id_usuario,
          username: user.nickname,
          role: user.rol,
          id_persona: user.id_persona,
          id_hospital: user.id_hospital,
          id_lugar: persona.id_lugar,
          privilegios: privs,
          id_pais: id_pais.Lugar.Pai.id_pais,
          referencia_telefonica: persona.referencia_telefonica
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.status(201).json({
        user,
        privs,
        token,
        userId: user.id_usuario,
        message: "Inicio de sesión exitoso",
      });
    } else {
      return res
        .status(401)
        .json({ message: "Nombre de usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
