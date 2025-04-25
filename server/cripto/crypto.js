const bcrypt = require("bcrypt");

const saltRounds = 10;

const encrpyt = (contra) => {
  const salt = bcrypt.genSaltSync(saltRounds);

  const encriptado = bcrypt.hashSync(contra, salt);

  return encriptado;
};

const compare = (contra, contraEn) => {
  return bcrypt.compareSync(contra, contraEn);
};

module.exports = { encrpyt, compare};
