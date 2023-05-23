const express = require('express');
const app = express();

app.use(express.json());
const mongoose = require('mongoose');
const Consultation = require('./models/Consultation.js');
mongoose.connect('mongodb://localhost/doctolib');

////*******************VERIFIE DISPONIBILTE */
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
         if (consultation.tranche[req.body.tranche].isAvailable === true) {
            consultation.tranche[req.body.tranche].name = req.body.name;

            consultation.tranche[req.body.tranche].isAvailable = false;
            await consultation.save();

            res.json({ message: 'réservation successfuly' });
         } else {
            res.json({ error: { message: 'tranche already booked' } });
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
      res.status(400).json({ error: error.message });
   }
});

/////////////////////////////////////////////////////////
app.all('*', (req, res) => {
   res.status(404).json({ error: 'route not found' });
});
app.listen(3000, () => {
   console.log('server op');
});
