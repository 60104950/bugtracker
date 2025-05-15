const bugForm = document.getElementById('bugForm');
const bugList = document.getElementById('bugList');
const filterSeverity = document.getElementById('filterSeverity');
const filterStatus = document.getElementById('filterStatus');

let bugs = JSON.parse(localStorage.getItem('bugs')) || [];

function saveBugs() {
  localStorage.setItem('bugs', JSON.stringify(bugs));
}

function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function renderBugs() {
  const severity = filterSeverity.value;
  const status = filterStatus.value;

  bugList.innerHTML = '<h2>All Bugs</h2>';

  bugs
    .filter(bug => (!severity || bug.severity === severity) && (!status || bug.status === status))
    .forEach(bug => {
      const div = document.createElement('div');
      div.className = 'bug';
      div.innerHTML = `
        <strong>${bug.title}</strong>
        <p>${bug.description}</p>
        <p>Severity: ${bug.severity}</p>
        <p>Status: 
          <select data-id="${bug.id}" class="statusSelect">
            <option ${bug.status === 'open' ? 'selected' : ''}>open</option>
            <option ${bug.status === 'in progress' ? 'selected' : ''}>in progress</option>
            <option ${bug.status === 'resolved' ? 'selected' : ''}>resolved</option>
          </select>
        </p>
      `;
      bugList.appendChild(div);
    });

  document.querySelectorAll('.statusSelect').forEach(select => {
    select.addEventListener('change', e => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      bugs = bugs.map(bug => bug.id === id ? { ...bug, status: newStatus } : bug);
      saveBugs();
      renderBugs();
    });
  });
}

bugForm.addEventListener('submit', e => {
  e.preventDefault();
  const newBug = {
    id: generateID(),
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    severity: document.getElementById('severity').value,
    status: document.getElementById('status').value
  };
  bugs.push(newBug);
  saveBugs();
  bugForm.reset();
  renderBugs();
});

filterSeverity.addEventListener('change', renderBugs);
filterStatus.addEventListener('change', renderBugs);

// Initial render
renderBugs();