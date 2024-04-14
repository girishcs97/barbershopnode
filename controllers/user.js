const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ical = require('ical-generator').default;
const moment = require("moment");
const nodemailer = require("nodemailer");

function getIcalObjectInstance(starttime, endtime) {
  const cal = ical({ domain: "barberhouse.com", name: 'Barber House Appointment' });
  cal.createEvent({
    start: starttime,
    end: endtime,
    summary: 'Barber house appointment',
    description: 'Please find more information about the appointment!',
    location: 'Worcestor',
    url: 'barberhouse.com',
    organizer: {              // 'organizer details'
      name: "Barber House",
      email: "girishcs097@gmail.com"
    },
  });
  return cal;
}
exports.submitform = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAppointmentqueries = async (req, res, next) => {
  User.find()
    .then((result) => {
      res.status(200).json({
        queries: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
};

exports.sendMail = async (req, res, next) => {
  const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "girishcs097@gmail.com",
      pass: "rnkv fiel tiih hbvo"
    }
  });
  const mailOptions = {
    to: req.body.email,
    subject: "Welcome To Barber House, Here is the Appointment Details",
    html: "<h1>Hi, Here is the appointment details</h1>"
  }
  const calendarObj = getIcalObjectInstance(req.body.startTime, req.body.endtime);
  if (calendarObj) {
    let alternatives = {
      "Content-Type": "text/calendar",
      "method": "REQUEST",
      "content": new Buffer(calendarObj.toString()),
      "component": "VEVENT",
      "Content-Class": "urn:content-classes:calendarmessage"
    }
    mailOptions['alternatives'] = alternatives;
    mailOptions['alternatives']['contentType'] = 'text/calendar'
    mailOptions['alternatives']['content']
      = new Buffer(calendarObj.toString())
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: ", response);
      User.findByIdAndUpdate(req.body.id,{ $set: { status: 'Approved' }})
        .then(() => {
          res.status(200).json({
            message: "Success"
          })
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({
            error: err
          })
        })
    }
  })
}