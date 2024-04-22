const express = require('express');
const router = express.Router();
const {submitform, getAppointmentqueries,sendMail, declineMail, fetchBookedTimeSlots} = require('../controllers/user')

router.post('/submitForm',submitform)
router.get('/getqueries',getAppointmentqueries)
router.post('/sendmail',sendMail)
router.post('/declinemail',declineMail)
router.get('/getbookedslots', fetchBookedTimeSlots)

module.exports = router;