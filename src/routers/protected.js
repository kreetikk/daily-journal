const { Router } = require('express')

const getJournals = require('../controllers/journals/getJournals')
const getJournalById = require('../controllers/journals/getJournalById')
const journalUpsertValidator = require('../middlewares/journalUpsertValidator')
const postJournal = require('../controllers/journals/postJournal')
const putJournal = require('../controllers/journals/putJournal')
const deleteJournal = require('../controllers/journals/deleteJournal')

const router = Router()

router.get('/journals', getJournals)

router.get('/journals/:id', getJournalById)

router.post('/journals', journalUpsertValidator, postJournal)

router.put('/journals/:id', journalUpsertValidator, putJournal)

router.delete('/journals/:id', deleteJournal)

module.exports = router
