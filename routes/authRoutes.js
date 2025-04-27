const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun!' });
  }


  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış!' });
  }

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu!' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun!' });
  }


  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Kullanıcı adı veya şifre hatalı!' });
  }


  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Kullanıcı adı veya şifre hatalı!' });
  }


  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    message: 'Giriş başarılı!',
    token,
  });
});

module.exports = router;
