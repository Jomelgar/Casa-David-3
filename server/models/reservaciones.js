const { DataTypes } = require("sequelize");
const sequelize = require("../Db");
const { PacienteHuesped } = require("./huesped");
const { Hospital } = require("./hospital");
const { Lugar } = require("./persona");
const { afiliado, Afiliado } = require("./afiliado");

const Reservacion = sequelize.define(
  "Reservacion",
  {
    id_reservacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cama: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fecha_entrada: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
    },
    becado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "reservacion",
    timestamps: false,
  }
);

const CambioReserva = sequelize.define(
  "CambioReserva",
  {
    id_cambio_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_reservacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaSalidaAntigua: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaSalidaNueva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaModificacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    responsable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cambio_reserva",
    timestamps: false,
  }
)

const Habitacion = sequelize.define(
  "Habitacion",
  {
    id_habitacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_lugar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    genero: {
      type: DataTypes.ENUM("MASCULINO", "FEMENINO", "OTRO"),
      allowNull: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "habitacion",
    timestamps: false,
  }
);


const Cama = sequelize.define(
  "Cama",
  {
    id_cama: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("INDIVIDUAL", "MATRIMONIAL", "CAMAROTE"),
      allowNull: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "cama",
    timestamps: false,
  }
);

const Ofrenda = sequelize.define(
  "Ofrenda",
  {
    id_ofrenda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_reservacion: {
      type: DataTypes.INTEGER,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    recibo: {
      type: DataTypes.TEXT,
      defaultValue: "N/A",
      allowNull: false,
    },
    observacion: {
      type: DataTypes.TEXT,
      defaultValue: "N/A",
    }
  },
  {
    tableName: "ofrenda",
    timestamps: false,
  }
);

const AfiliadoReservacion = sequelize.define(
  "AfiliadoReservacion",
  {
    id_afiliado_reservacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_afiliado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_reservacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "afiliado_reservacion",
    timestamps: false,
  }
);

Reservacion.belongsTo(Cama, { foreignKey: "id_cama" });
Reservacion.belongsTo(Hospital, { foreignKey: "id_hospital" });

CambioReserva.belongsTo(Reservacion, { foreignKey: "id_reservacion" });
Reservacion.hasMany(CambioReserva, { foreignKey: "id_reservacion" });

AfiliadoReservacion.belongsTo(Reservacion, { foreignKey: "id_reservacion" });
AfiliadoReservacion.belongsTo(Afiliado, { foreignKey: "id_afiliado" });

Reservacion.hasMany(AfiliadoReservacion, { foreignKey: "id_reservacion" });
Afiliado.hasMany(AfiliadoReservacion, { foreignKey: "id_afiliado" });

Cama.hasMany(Reservacion, { foreignKey: "id_cama" });
Hospital.hasMany(Reservacion, { foreignKey: "id_hospital" });

Cama.belongsTo(Habitacion, { foreignKey: "id_habitacion" });
Habitacion.hasMany(Cama, { foreignKey: "id_habitacion", onDelete: "CASCADE" });

Lugar.hasMany(Habitacion, { foreignKey: "id_lugar" });
Habitacion.belongsTo(Lugar, { foreignKey: "id_lugar" });

Ofrenda.belongsTo(Reservacion, { foreignKey: "id_reservacion" });
Reservacion.hasMany(Ofrenda, { foreignKey: "id_reservacion" });

//revisar
PacienteHuesped.hasMany(Reservacion, { foreignKey: "id_paciente_huesped" });
Reservacion.belongsTo(PacienteHuesped, { foreignKey: "id_paciente_huesped" });

module.exports = { Reservacion, Habitacion, Cama, Ofrenda, AfiliadoReservacion, CambioReserva };
