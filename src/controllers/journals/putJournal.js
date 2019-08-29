module.exports = (req, res) => {
  try {
    const { body } = req
    body.id = req.params.id
    const journal = req.db.upsert(body)
    res.status(200).json(journal)
  } catch ({ message }) {
    res.status(400).json({ error: message })
  }
}
