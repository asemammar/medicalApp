const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;

const Referral = require('../model/referrals.js');
const Patient = require('../model/patients.js');
const User = require('../model/user.js');


// Search referrals in database using patientName
router.post('/patientName', async(req, res) => {
    try {
        let patientId = 0;
        let patient = await Patient.findOne({patientName: req.body.patientName});
        if (patient) {
            let patientId = patient._id;
            console.log(patient._id);
            let referrals = await Referral.find({patientId: patientId});
            res.send(referrals);
        } else {
            res.send("Patient Name does not exist");
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search referrals in database using patientId
router.post('/patientId', async(req, res) => {
    try {
        let referrals = await Referral.find({patientId: req.body.patientId});
        if (referrals) {
            res.send(referrals);
        } else {
            res.send("Patient ID does not exist");
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});


// Search referrals in database using userName
router.post('/userName', async(req, res) => {
    try {
        let userId = 0;
        let user = await User.findOne({name: req.body.userName});
        if (user) {
            let userId = user._id;
            console.log(user._id);
            let referrals = await Referral.find({userId: userId});
            res.send(referrals);
        } else {
            res.send("User Name does not exist");
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search referrals in database using patientId
router.post('/userId', async(req, res) => {
    try {
        let referrals = await Referral.find({userId: req.body.userId});
        if (referrals) {
            res.send(referrals);
        } else {
            res.send("User ID does not exist");
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Create a new patient and add it to the database
router.post('/newReferralById', async(req, res) => {
    try {
        const referral = new Referral({
            patientId: req.body.patientId,
            userId: req.body.userId,
        });
        const savedReferral = await referral.save();
        res.json({ error: null, data: savedReferral });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

// Set Justification By ID
router.post('/setJustificationById', async(req, res) => {
    try {
        let referrals = await Referral.updateOne({_id: req.body.id},{justification:req.body.justification},function(err,result) {
                        if (err) {
                        res.send(err);
                        } else {
                        res.json(result);
                        }
                        });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Set Comment By ID
router.post('/setCommentById', async(req, res) => {
    try {
        let referrals = await Referral.findOneAndUpdate(
   { _id: req.body.id },
   { $push: { comments: req.body.comment  } },
  function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log(success);
        }
    });

    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router
