// Fetch
const form = document.getElementById('form');
form.onsubmit = function (e) {
  e.preventDefault();
  const todoDescription = document.getElementById('description').value;
  // if (todoDescription != '') {
  fetch('/todos/create', {
    method: 'POST',
    body: JSON.stringify({
      description: todoDescription.toLowerCase(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const listElement = document.createElement('li');
      listElement.innerText = data.description;
      document.getElementById('todo-list').appendChild(listElement);
      document.getElementById('error').className = 'hidden';
      document.getElementById('description').value = '';
    })
    .catch((err) => {
      const error = document.getElementById('error');
      error.className = 'error';
      error.innerHTML = JSON.stringify(err.message);
    });
  // }
};

// Checked-Box
const checkboxes = document.querySelectorAll('.checkbox');
const numberOfCheckboxes = checkboxes.length;
let i = 0;
for (i; i < numberOfCheckboxes; i++) {
  const checkbox = checkboxes[i];
  checkbox.onchange = function (e) {
    const isCompleted = e.target.checked;
    const id = e.target.dataset.id;
    fetch(`/todos/${id}/set-completed`, {
      method: 'POST',
      body: JSON.stringify({
        completed: isCompleted,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => (document.getElementById('error').className = 'hidden'))
      .catch(() => {
        const error = document.getElementById('error');
        error.className = 'error';
        error.innerHTML = JSON.stringify(err.message);
      });
  };
}
