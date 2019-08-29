module.exports = (req, res) => {
  try {
    const journal = req.db.getById(req.params.id)
    res.status(200).json(journal)
  } catch ({ message }) {
    res.status(400).json({ error: message })
  }
}
