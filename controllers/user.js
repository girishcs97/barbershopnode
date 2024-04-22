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
    location: 'Worcester',
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
  const customerName = req.body.name || "Customer";
  const dateee = new Date(req.body.startTime);
  const appointmentDate = `${dateee.getFullYear()}-${dateee.getMonth()+1}-${dateee.getDate()}`;

  const selectedService = req.body.service || "Requested Service";
  const assignedBarber = req.body.barber || "Requested Barber";

  const mailList = [req.body.email,'girishcs097@gmail.com'];
  const mailOptions = {
    to: mailList,
    subject: `Welcome To Barber House, Appointment Confirmation: ${customerName} - ${appointmentDate} at ${req.body.time}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
        <h2 style="color: #333;">Appointment Confirmation</h2>
    
        <p>Dear ${customerName},</p>
    
        <p>Your appointment at Barber House has been successfully booked. Below are the details:</p>
    
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Date and Time:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointmentDate}, ${req.body.time}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Service:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${selectedService}</td>
            </tr>
            <tr>
                <td style="padding: 8px;">Barber:</td>
                <td style="padding: 8px;">${assignedBarber}</td>
            </tr>
        </table>
    
        <p>Please arrive on time for your appointment. If you have any questions or need to reschedule, feel free to contact us.</p>
    
        <p>We look forward to seeing you soon!</p>
    
        <p>Best regards,<br>
        The Barber House Team</p>
    
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
    
    </body>
    </html>
    `
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
      User.findByIdAndUpdate(req.body.id, { $set: { status: 'Approved' } })
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

exports.declineMail = async (req, res, next) => {
  const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "girishcs097@gmail.com",
      pass: "rnkv fiel tiih hbvo"
    }
  });
  const customerName = req.body.name || "Customer";
  const appointmentDate = `${dateee.getFullYear()}-${dateee.getMonth()+1}-${dateee.getDate()}`;
  const selectedService = req.body.service || "Requested Service";

  const mailOptions = {
    to: req.body.email,
    subject: `Welcome To Barber House, Appointment Declined: ${customerName} - ${appointmentDate} at ${req.body.time}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Declined</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
        <h2 style="color: #333;">Appointment Declined</h2>
    
        <p>Dear ${customerName},</p>
    
        <p>We regret to inform you that your appointment for a ${selectedService} on ${appointmentDate}  at ${req.body.time} has been declined.</p>
    
        <p>This decision was due to unforeseen circumstances or unavailability. We sincerely apologize for any inconvenience caused.</p>
    
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
    
        <p>Thank you for your understanding.</p>
    
        <p>Best regards,<br>
        The Barber House Team</p>
    
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
    
    </body>
    </html>
    `
  }

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Decline Message sent: ", response);
      User.findByIdAndUpdate(req.body.id, { $set: { status: 'Declined' } })
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

exports.fetchBookedTimeSlots = async (req, res, next) => {
  console.log("req",req)
  try {
    const { date } = req.query; // Assuming the date is passed in the format 'YYYY-MM-DD'

    // Construct the start and end date for the selected day
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Move to the next day

    // Find appointments for the selected day
    const appointments = await User.find({
      date: { $gte: startDate, $lt: endDate }, // Filter by date range
      time: { $exists: true, $ne: null } // Ensure 'time' field exists and is not null
    }).select('time'); // Select only the 'time' field
    console.log(appointments);
    const formattedAppointments = appointments.map(appointment =>appointment.time);

    res.status(200).json({
      bookedTimeSlots: formattedAppointments,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: err.message,
    });
  }
};
// end added manually

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