const availabilityModel = require("../models/availability-model");
/**
 * @param {*} req
 * @param {*} res
 * @description registro de entradas de los automoviles
 */

const entry = async (req, res) => {
  try {
    const availability = new availabilityModel();
    const { plate, state, description } = req.body;
    availability.plate = plate;
    availability.state = state;
    availability.description = description;
    await availability.save();
    res.send({ status: "OK", message: "Saved" });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: "DUPLICATED_VALUES", message: error.keyValue });
      return;
    }
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @description validación de salida, valor a pagar y fechas de entrada y salida
 */

const exit = async (req, res) => {
  try {
    const existPlate = await availabilityModel.findOne({
      plate: req.body.plate,
    });

    if (existPlate != null) {
      const inDate = existPlate.input_date;
      const outputDate = new Date();
      const mils = outputDate - inDate;
      const hours = Math.round(mils / 3600000);
      const payValue = hours * process.env.PRICE_HOUR
      res.send({
        status: "OK",
        message: "Exist",
        description: {
          fecha_entrada: inDate,
          fecha_salida: outputDate,
          total_horas: hours,
          valor: payValue,
        },
      });
    } else {
      res.send({
        status: "OK",
        message: "Not exist",
      });
    }
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: "DUPLICATED_VALUES", message: error.keyValue });
      return;
    }
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

module.exports = {
  entry,
  exit,
};
