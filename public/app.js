const apiBase = '/api/tasks';

const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

async function fetchTasks() {
  const res = await fetch(apiBase);
  return res.json();
}

function renderTasks(tasks){
  const list = qs('#tasks');
  list.innerHTML = '';
  const filter = qs('#filter-status').value;
  const q = qs('#search').value.trim().toLowerCase();
  const shown = tasks.filter(t => {
    if(filter !== 'all' && t.status !== filter) return false;
    if(!q) return true;
    return (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
  });
  if(shown.length === 0){ list.innerHTML = '<li class="task empty">No tasks found</li>'; return }
  shown.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task';
    const timeText = timeAgo(t.createdAt);
    const updatedText = t.updatedAt && t.updatedAt !== t.createdAt ? ` · updated ${timeAgo(t.updatedAt)}` : '';
    const chipClass = t.status === 'todo' ? 'chip todo' : (t.status === 'done' ? 'chip done' : 'chip in-progress');
    li.innerHTML = `
      <div style="flex:1 1 60%">
        <strong>${escapeHtml(t.title)}</strong>
        <div class="meta">${escapeHtml(t.description || '')}
          <span class="time">created ${timeText}${updatedText}</span>
        </div>
      </div>
      <div style="text-align:right;min-width:150px">
        <div class="${chipClass}">${t.status}</div>
        <div class="actions">
          <button data-id="${t.id}" class="btn-ghost edit">Edit</button>
          <button data-id="${t.id}" class="btn-ghost delete">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

function timeAgo(ms){
  if(!ms) return '';
  const diff = Date.now() - Number(ms);
  const s = Math.floor(diff/1000);
  if(s < 60) return `${s}s ago`;
  const m = Math.floor(s/60);
  if(m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if(h < 24) return `${h}h ago`;
  const d = Math.floor(h/24);
  return `${d}d ago`;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

async function loadAndRender(){
  const tasks = await fetchTasks();
  renderTasks(tasks);
}

// Toast helper
const pendingDeletes = {}; // id -> { timer, task }

function showToast(text, type = 'success', timeout = 3000, opts = {}){
  const ctr = document.getElementById('toast-container');
  if(!ctr) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const txt = document.createElement('div'); txt.className = 'txt'; txt.innerHTML = escapeHtml(text);
  t.appendChild(txt);
  if(opts.actionLabel){
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = opts.actionLabel;
    btn.addEventListener('click', () => {
      try{ opts.onAction && opts.onAction(); }catch(e){}
      // remove immediately
      try{ ctr.removeChild(t); }catch(e){}
    });
    t.appendChild(btn);
  }
  ctr.appendChild(t);
  setTimeout(()=>{ if(t.parentNode){ t.style.opacity = '0'; t.style.transform = 'translateY(6px)'; } }, timeout-300);
  setTimeout(()=>{ try{ if(t.parentNode) ctr.removeChild(t); }catch(e){} }, timeout);
}

qs('#filter-status').addEventListener('change', loadAndRender);
qs('#search').addEventListener('input', () => { debounce(loadAndRender, 150)(); });
qs('#new-task').addEventListener('click', () => { resetForm(); window.scrollTo({ top: 0, behavior: 'smooth' }); qs('#title').focus(); });

function debounce(fn, ms){
  let t;
  return function(){ clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), ms); };
}

qs('#task-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = qs('#task-id').value.trim();
  const payload = {
    title: qs('#title').value.trim(),
    description: qs('#description').value.trim(),
    status: qs('#status').value
  };
  if(!payload.title) return alert('Title required');
  if(id){
    await fetch(`${apiBase}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    showToast('Task updated', 'success');
  } else {
    await fetch(apiBase, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    showToast('Task created', 'success');
  }
  resetForm();
  loadAndRender();
});

qs('#cancel-btn').addEventListener('click', resetForm);

function resetForm(){
  qs('#form-title').textContent = 'Add Task';
  qs('#task-id').value = '';
  qs('#title').value = '';
  qs('#description').value = '';
  qs('#status').value = 'todo';
}

qs('#tasks').addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if(!id) return;
  if(e.target.classList.contains('delete')){
    if(!confirm('Delete this task?')) return;
    // fetch task data so we can restore if needed
    let task;
    try{
      const r = await fetch(`${apiBase}/${id}`);
      if(!r.ok) throw new Error('Not found');
      task = await r.json();
    }catch(err){ showToast('Could not get task', 'error'); return; }

    // remove element from DOM immediately
    const li = e.target.closest('.task');
    if(li) li.remove();

    // schedule a real delete after timeout
    const DELAY = 4000;
    const timer = setTimeout(async () => {
      try{
        const del = await fetch(`${apiBase}/${id}`, { method:'DELETE' });
        if(!del.ok) showToast('Delete failed', 'error');
        else showToast('Task deleted', 'warn');
      }catch(e){ showToast('Delete failed', 'error'); }
      delete pendingDeletes[id];
      loadAndRender();
    }, DELAY);

    pendingDeletes[id] = { timer, task };

    showToast('Task will be deleted', 'warn', DELAY, {
      actionLabel: 'Undo',
      onAction: async () => {
        // cancel scheduled delete
        clearTimeout(pendingDeletes[id].timer);
        delete pendingDeletes[id];
        // re-render (server still has the task)
        await loadAndRender();
        showToast('Delete undone', 'success');
      }
    });
  } else if(e.target.classList.contains('edit')){
    const res = await fetch(`${apiBase}/${id}`);
    const task = await res.json();
    qs('#form-title').textContent = 'Edit Task';
    qs('#task-id').value = task.id;
    qs('#title').value = task.title;
    qs('#description').value = task.description || '';
    qs('#status').value = task.status || 'todo';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    qs('#title').focus();
  }
});

// Initial load
loadAndRender();
