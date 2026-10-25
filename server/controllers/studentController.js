const Student = require('../models/studentModel');
const { validateStudent, validateId } = require('../middleware/studentValidation');

const missing = () => Object.assign(new Error('Student profile not found.'), { status: 404 });
const list = async (req, res) => res.json(await Student.list());
const get = async (req, res) => {
  const student = await Student.find(validateId(req.params.id));
  if (!student) throw missing();
  res.json(student);
};
const create = async (req, res) => {
  const student = await Student.create(validateStudent(req.body));
  res.status(201).location(`/api/students/${student.id}`).json(student);
};
const update = async (req, res) => {
  const id = validateId(req.params.id);
  const student = await Student.update(id, validateStudent(req.body));
  if (!student) throw missing();
  res.json(student);
};
const remove = async (req, res) => {
  if (!await Student.remove(validateId(req.params.id))) throw missing();
  res.status(204).end();
};
module.exports = { list, get, create, update, remove };
