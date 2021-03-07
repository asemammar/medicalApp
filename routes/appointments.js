const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const authorize = require('./authorize')

const Appointment = require('../model/appointments.js');
const Referral = require('../model/referrals.js');

// Get patient referrals
router.get('/patient/:id', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }
    
    var id = new ObjectId(req.params.id);
    try {
        let patient = await Patient.findById(id)
        let referrals = await Referral.find({patientId: patient._id});
        let appointments = await Appointment.find({patientId: patient._id});
        p = patient.toObject();
        p.referrals = referrals
        p.appointments = appointments
        if (p) {
            res.send(p)
        } else {
            res.send("Patient does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get all appointments
router.get('/', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }
    
    try {
        let p = await Appointment.find({});
        res.send(p);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

// Search appointment in database using object id
router.get('/id/:id', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }

    var id = new ObjectId(req.params.id);
    try {
        let appointment = await Appointment.findById(id)
        if (appointment) {
            res.send(appointment)
        } else {
            res.send("Appointment does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search appointment in database using fulfilment status
router.get('/status/:status', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }

    var status = req.params.status;
    var bool;

    if (status == "false") {
        bool = false
    } else {
        bool = true
    }

    try {
        let p = await Appointment.find({status: bool});
        res.send(p);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}); 

// Search appointment in database using date restrictions
router.get('/date', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }

    try {
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;

        if(startDate === '' || endDate === '') {
            return res.status(400).json({
                status: 'Failed.',
                message: 'Please ensure you pick two dates.'
            })
        }

        let p = await Appointment.find({dateAndTime: {
            $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
        }});

        res.send(p);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}); 

// Create a new patient and add it to the database
router.post('/newAppointment', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }

    try {
        const appointment = new Appointment({
            patientId: new ObjectId(req.params.patientId),
            machineId: req.user.id,
            channel: req.body.channel,
            department: req.body.department,
            referralId: req.body.referralId,
            treatmentId: req.body.treatmentId,
            dateAndTime: req.body.dateAndTime,
            endDateAndTime: req.body.endDateAndTime,
            remarks: req.body.remarks
        });
        const savedAppointment = await appointment.save();
        res.json({ error: null, data: savedAppointment });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

// Delete appointment in database using object id
router.delete('/id/:id', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }

    try {
        var id = new ObjectId(req.params.id);
        var query = { _id: id };
        const result = await Appointment.deleteOne(query);
        if (result.deletedCount === 1) {
            res.json({ message: "Successfully deleted 1 document." });
        } else {
            res.json({ message: "No documents matched the query. Deleted 0 documents." });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

// Update appointment document using object id
router.put('/id/:id', async(req, res) => {
    try {
        // authorize the user roles
        let a =await authorize(req.user.id, ['admin','clerk','doctor','nurse','paramedic']);

        if(!a){
            res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
        }
    } catch (error){
        res.status(400).json({ error });
    }
    
    try {
        var id = new ObjectId(req.params.id);
        let appointment = await Appointment.findById(id)
    
        var status = ''
        var updateDoc = {
            $set: {
                machineId: req.user.id,
                referralId: req.body.referralId,
                treatmentId: req.body.treatmentId,
                remarks: req.body.remarks,
            },
        };
    
        if (appointment.dateAndTime - (new Date()) < 0) {
            status = "Appointment date passed."
            updateDoc = {
                $set: {
                    machineId: req.user.id,
                    referralId: req.body.referralId,
                    treatmentId: req.body.treatmentId,
                    status: req.body.status,
                    remarks: req.body.remarks,
                },
            }
        } else {
            status = "Appointment date has not arrived, cannot update appointment status."
        } 

        const result = await Appointment.updateOne({_id: id}, updateDoc);
        if (result.nModified === 1) {
            res.json({ message: "Successfully updated 1 document." , status: status});
        } else {
            res.json({ message: "No documents matched the query. 0 documents modified.", status: status});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

module.exports = router