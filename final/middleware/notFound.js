function notFound(req, res) {
  return res.status(404).json("Route does not exist");
}

module.exports = notFound;
