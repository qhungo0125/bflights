const router = require('express').Router();
const { client } = require('../config/mongodb');
const { createDebug } = require('../untils/DebugHelper');
const debug = new createDebug('/auth/register');
const validator = require('validator');

// register user
// input: email, phone (global), full name, password
// ouput: success/ fail

router.post('/register', async (req, res) => {
  const { email, phone, fullname, password } = req.body;
  debug(req.body);
  if (!email || !phone || !fullname || !password) {
    return res.status(500).json({ error: 'Missing required value' });
  }

  debug('validated email');
  if (!validator.isEmail(email)) {
    return res.status(500).json({ error: 'Invalid email' });
  }

  debug('validated mobile phone');
  if (!validator.isMobilePhone(phone)) {
    return res.status(500).json({ error: 'Invalid mobile phone' });
  }

  const regexValidateFullName = /^[a-zA-Z ]+$/;
  debug(regexValidateFullName.test(fullname));
  if (!regexValidateFullName.test(fullname)) {
    return res.status(500).json({ error: 'Invalid full name' });
  }

  debug(password.length);
  if (password.length < 8) {
    return res
      .status(500)
      .json({ error: 'Password must be at least 8 characters' });
  }

  // save info to database

  return res.status(200).json(req.body);
});

module.exports = router;
