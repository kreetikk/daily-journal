module.exports = (req, res) => {
  try {
    const journal = req.db.upsert(req.body)
    res.status(201).json(journal)
  } catch ({ message }) {
    res.status(400).json({ error: message })
  }
}
