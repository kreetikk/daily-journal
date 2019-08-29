const fs = require('fs')
const path = require('path')
const saveToFile = require('../utils/saveToFile')

class DatabaseService {
  constructor() {
    try {
      this.filePath = path.join(__dirname, '..', '..', `db.json`)
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, '{}')
      }
      this.data = require(this.filePath)
    } catch ({ message, stack }) {
      const error = new Error(`Failed to init DB: ${message}`)
      error.stack = stack
      throw error
    }
  }

  save() {
    saveToFile(this.filePath, this.data)
  }

  getAll() {
    return Object.values(this.data).filter((x) => !x.isDeleted)
  }

  getById(id) {
    const journal = this.data[id]
    if (journal && !journal.isDeleted) {
      return journal
    } else {
      const error = new Error('Journal not found')
      error.name = 'NOT_FOUND'
      throw error
    }
  }

  upsert(item) {
    const journal = this.data[item.id]
    if (!journal || !journal.isDeleted) {
      const now = new Date()
      item.createdAt = journal ? journal.createdAt : now
      item.updatedAt = now
      item.isDeleted = false
      if (!item.id) {
        const result = Object.values(this.data).find((x) => {
          const journalDate = new Date(x.createdAt)
          return (
            journalDate.getDate() === now.getDate() &&
            journalDate.getMonth() === now.getMonth() &&
            journalDate.getFullYear() === now.getFullYear() &&
            !x.isDeleted
          )
        })

        if (result) {
          const error = new Error("Today's journal entry already exists.")
          error.name = 'ALREADY_EXISTS'

          throw error
        }

        const lastId = +Object.keys(this.data).pop()
        item.id = lastId ? lastId + 1 : 1
      }

      this.data[item.id] = item
      this.save()
      return item
    } else {
      const error = new Error('Failed to upsert journal')
      error.name = 'UPDATE_FAILED'

      throw error
    }
  }

  delete(id) {
    const journal = this.data[id]
    if (journal && !journal.isDeleted) {
      this.data[id].isDeleted = true
      this.save()
    } else {
      const error = new Error('Journal not found')
      error.name = 'NOT_FOUND'
      throw error
    }
  }
}

module.exports = DatabaseService
