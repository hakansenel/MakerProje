const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();


app.use(express.json());


app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
