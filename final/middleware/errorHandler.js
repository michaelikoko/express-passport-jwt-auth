function errorHandler(err, req, res, next) {
  //console.error(err);
  //console.log("message", err.message, err.name);
  switch (err.name) {
    case "CastError":
      return res.status(400).send({ error: "malformatted id" });
      break;
    case "ValidationError":
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).send({ errors });
      break;
    default:
      console.log(err)
      return res.status(500).json({ error: "Something went wrong" });
      break;
  }
}

module.exports = errorHandler;
