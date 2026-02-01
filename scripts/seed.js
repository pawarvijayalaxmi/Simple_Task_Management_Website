const db = require('../db/sqlite');

function makeId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

async function seed(){
  const rows = db.getAll();
  if(rows && rows.length > 0){
    console.log('DB already has tasks, skipping seed.');
    return;
  }

  const now = Date.now();
  const samples = [
    { id: makeId(), title: 'Buy groceries', description: 'Milk, eggs, bread', status: 'todo', created_at: now, updated_at: now },
    { id: makeId(), title: 'Finish assignment', description: 'Complete Global Trend task', status: 'in-progress', created_at: now, updated_at: now },
    { id: makeId(), title: 'Read book', description: 'Read a chapter after work', status: 'todo', created_at: now, updated_at: now }
  ];

  samples.forEach(s => db.create(s));
  console.log('Seeded', samples.length, 'tasks.');
}

seed().catch(err => { console.error(err); process.exit(1); });
