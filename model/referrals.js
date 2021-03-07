var mongoose = require('mongoose');

// Referrals Schema
var ReferralsSchema = mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  justification:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type:[String]
  }
});

module.exports = mongoose.model('Referral', ReferralsSchema);
