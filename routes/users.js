'use strict';

const express = require('express');
const knex = require('../knex');
const boom = require('boom');
const bcyrpt = require('bcrypt-as-promised');
const { camelizeKeys, decamlizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  knex('users')
    .where('email', email)
    .then((rows) => {
      if (rows.length) {
        return next(boom.create(400, 'Email already exists'));
      }

      bcrypt.hash(password, 12)
        .then((hashedPassword) => {
          const insertUser = { email, hashedPassword };

          return knex('users').insert(decamelizeKeys(insertUser), '*');
        })
      .then((rows) => {
        const user = camelizeKeys(rows[0]);

        delete user.hashedPassword;

        res.send(user);
      })
      .catch(err) => {
        next(err);
      });
    });
});


module.exports =  router;
