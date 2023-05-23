const express = require('express');
const mongoose = require('mongoose');

const app = express(); // Créer un serveur
app.use(express.json());

mongoose.connect('mongodb://localhost/doctolib');

// Obtenir les dispos
app.get('/visits', async (req, res) => {
   // Est-ce que la date existe déjà ?
   const booking = await Booking.findOne({ date: req.query.date });

   if (booking) {
      res.json(booking);
   } else {
      // Si la date n'existe pas déjà
      const newElem = {
         date: req.query.date,
         slots: {
            1000: { isAvailable: true, name: '' },
            1030: { isAvailable: true, name: '' },
            1100: { isAvailable: true, name: '' },
            1130: { isAvailable: true, name: '' },
            1400: { isAvailable: true, name: '' },
            1430: { isAvailable: true, name: '' },
            1500: { isAvailable: true, name: '' },
            1530: { isAvailable: true, name: '' },
            1600: { isAvailable: true, name: '' },
            1630: { isAvailable: true, name: '' },
            1700: { isAvailable: true, name: '' },
            1730: { isAvailable: true, name: '' },
         },
      };
      const newDate = new Booking(newElem);
      await newDate.save();
      res.json(newDate);
   }
});

// Réserver un créneau
app.post('/visits', async (req, res) => {
   try {
      // Est-ce que la date existe déjà ?
      const booking = await Booking.findOne({ date: req.query.date });

      // si la date existe déjà
      if (booking) {
         // si le créneau est disponible
         if (booking.slots[req.body.slot].isAvailable === true) {
            booking.slots[req.body.slot].isAvailable = false;
            booking.slots[req.body.slot].name = req.body.name;
            await booking.save();
            res.json({ message: 'Successfuly booked' });
         } else {
            // créneau indisponible
            res.json({
               error: {
                  message: 'Slot already booked',
               },
            });
         }
      } else {
         // on crée la date et on réserve
         const newElem = {
            date: req.query.date,
            slots: {
               1000: { isAvailable: true, name: '' },
               1030: { isAvailable: true, name: '' },
               1100: { isAvailable: true, name: '' },
               1130: { isAvailable: true, name: '' },
               1400: { isAvailable: true, name: '' },
               1430: { isAvailable: true, name: '' },
               1500: { isAvailable: true, name: '' },
               1530: { isAvailable: true, name: '' },
               1600: { isAvailable: true, name: '' },
               1630: { isAvailable: true, name: '' },
               1700: { isAvailable: true, name: '' },
               1730: { isAvailable: true, name: '' },
            },
         };
         newElem.slots[req.body.slot] = {
            name: req.body.name,
            isAvailable: false,
         };

         const newDate = new Booking(newElem);
         await newDate.save();
         res.status(201).json({
            message: 'Successfuly booked',
         });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

app.listen(3000, () => {
   console.log('Server started');
});
