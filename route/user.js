const express = require('express');
const router = express.Router();
const {submitform, getAppointmentqueries,sendMail} = require('../controllers/user')

router.post('/submitForm',submitform)
router.get('/getqueries',getAppointmentqueries)
router.post('/sendmail',sendMail)

module.exports = router;