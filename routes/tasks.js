const express = require('express');
const router = express.Router();
const db = require('../db/sqlite');

function makeId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function rowToTask(r){
  if(!r) return null;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

// List tasks
router.get('/', (req, res) => {
  try{
    const rows = db.getAll();
    const tasks = rows.map(rowToTask);
    res.json(tasks);
  }catch(e){
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single
router.get('/:id', (req, res) => {
  try{
    const row = db.getById(req.params.id);
    const task = rowToTask(row);
    if(!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  }catch(e){
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Create
router.post('/', (req, res) => {
  try{
    const { title, description = '', status = 'todo' } = req.body;
    if(!title || typeof title !== 'string') return res.status(400).json({ error: 'Title required' });
    const now = Date.now();
    const task = { id: makeId(), title, description, status, created_at: now, updated_at: now };
    db.create(task);
    const created = db.getById(task.id);
    res.status(201).json(rowToTask(created));
  }catch(e){
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update
router.put('/:id', (req, res) => {
  try{
    const row = db.getById(req.params.id);
    if(!row) return res.status(404).json({ error: 'Task not found' });
    const updates = req.body;
    // derive updated values
    const title = updates.title !== undefined ? updates.title : row.title;
    const description = updates.description !== undefined ? updates.description : row.description;
    const status = updates.status !== undefined ? updates.status : row.status;
    const now = Date.now();
    db.update({ id: req.params.id, title, description, status, updated_at: now });
    const updated = db.getById(req.params.id);
    res.json(rowToTask(updated));
  }catch(e){
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Delete
router.delete('/:id', (req, res) => {
  try{
    const row = db.getById(req.params.id);
    if(!row) return res.status(404).json({ error: 'Task not found' });
    db.remove(req.params.id);
    res.json({ message: 'Task deleted' });
  }catch(e){
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;
