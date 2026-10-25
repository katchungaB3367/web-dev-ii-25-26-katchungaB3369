const express = require('express');
const { getHealth } = require('../controllers/healthController');

const students = require('../controllers/studentController');
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

const router = express.Router();
router.get('/health', getHealth);
router.get('/students', asyncRoute(students.list));
router.get('/students/:id', asyncRoute(students.get));
router.post('/students', asyncRoute(students.create));
router.put('/students/:id', asyncRoute(students.update));
router.delete('/students/:id', asyncRoute(students.remove));

module.exports = router;
