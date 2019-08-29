module.exports = (req, res) => {
  const journals = req.db.getAll()
  res.status(200).json(journals)
}
