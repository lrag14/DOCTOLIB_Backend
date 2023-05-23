const express = require('express');
const app = express();

app.use(express.json());

const mongoose = require('mongoose');
const router = express.Router();

const Consultation = require('./models/Consultation.js');
mongoose.connect('mongodb://localhost/doctolib');

////*******************VERIFIE DISPONIBILTE */

// const { name, tranche } = req.body;
app.get('/visits', async (req, res) => {
   const consultation = await Consultation.findOne({ date: req.query.date });

   if (consultation) {
      res.json(consultation);
   } else {
      // Si la date n'existe pas déjà.....
      const newElem = {
         date: req.query.date,
         tranche: {
            1000: { isAvailable: true, name: '' },
            1030: { isAvailable: true, name: '' },
            1100: { isAvailable: true, name: '' },
            1130: { isAvailable: true, name: '' },
            1500: { isAvailable: true, name: '' },
            1530: { isAvailable: true, name: '' },
            1600: { isAvailable: true, name: '' },
            1630: { isAvailable: true, name: '' },
            1700: { isAvailable: true, name: '' },
         },
      };
      // ...... alors on la créée et on sauvegarde
      const newDate = new Consultation(newElem);
      await newDate.save();
      res.json(newDate);
   }
});

// *********//////RESERVER////////

app.post('/visits', async (req, res) => {
   try {
      const consultation = await Consultation.findOne({ date: req.query.date });

      // Si la date existe, vérifiez si la tranche est libre
      if (consultation) {
         // console.log(consultation.tranche);
         // console.log(req.body.tranche);

         if (consultation.tranche[req.body.tranche].isAvailable === true) {
            consultation.tranche[req.body.tranche].name = req.body.name;

            consultation.tranche[req.body.tranche].isAvailable = false;
            await consultation.save();
            res.status(201).json({ message: 'réservation successfuly' });
         } else {
            res.status(400).json({
               error: { message: 'tranche already booked' },
            });
         }
      } else {
         // Si la date n'existe pas, créez-la et réservez la tranche
         const newElem = {
            date: req.query.date,
            tranche: {
               1000: { isAvailable: true, name: '' },
               1030: { isAvailable: true, name: '' },
               1100: { isAvailable: true, name: '' },
               1130: { isAvailable: true, name: '' },
               1500: { isAvailable: true, name: '' },
               1530: { isAvailable: true, name: '' },
               1600: { isAvailable: true, name: '' },
               1630: { isAvailable: true, name: '' },
               1700: { isAvailable: true, name: '' },
            },
         };
         // **********NOUVELLE TRANCHE AVE LE NOM
         newElem.tranche[req.body.tranche] = {
            name: req.body.name,
            isAvailable: false,
         };
         const newDate = new Consultation(newElem);
         await newDate.save();
         res.status(201).json({ message: 'réservation successfuly' });
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
   }
});

// ::::::**************************ANNULATION

app.post('/visits/cancel', async (req, res) => {
   try {
      const consultation = await Consultation.findOne({ date: req.query.date });
      if (req.body.name === consultation.tranche[req.body.tranche].name) {
         consultation.tranche[req.body.tranche].name = '';
         consultation.tranche[req.body.tranche].isAvailable = true;
         await consultation.save();
         res.status(200).json({ message: 'Successfuly unbooked.' });
      } else {
         res.status(401).json({
            error: { message: "You can't unbook a meeting which is not yours" },
         });
      }
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;
/////////////////////////////////////////////////////////
app.all('*', (req, res) => {
   res.status(404).json({ error: 'route not found' });
});
app.listen(3000, () => {
   console.log('server op');
});
