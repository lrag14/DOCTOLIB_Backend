const mongoose = require('mongoose');
const Consultation = mongoose.model('Consultation', {
   date: String,
   tranche: {
      1000: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1030: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1100: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1130: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1500: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1530: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1600: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1630: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
      1700: {
         isAvailable: Boolean,
         name: {
            type: String,
            default: '',
         },
      },
   },
});

module.exports = Consultation;
