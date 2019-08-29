module.exports = (req, res) => {
  try {
    const journal = req.db.delete(req.params.id)
    res.status(204).send()
  } catch ({ message }) {
    res.status(400).json({ error: message })
  }
}
