const express = require('express');
const router = express.Router();
const {submitform, getAppointmentqueries,sendMail, declineMail} = require('../controllers/user')

router.post('/submitForm',submitform)
router.get('/getqueries',getAppointmentqueries)
router.post('/sendmail',sendMail)
router.post('/declinemail',declineMail)

module.exports = router;