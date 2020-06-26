// Fetch
const form = document.getElementById('form');
form.onsubmit = function (e) {
  e.preventDefault();
  fetch('/todos/create', {
    method: 'POST',
    body: JSON.stringify({
      description: document.getElementById('description').value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const listElement = document.createElement('li');
      listElement.innerHTML = data.description;
      document.getElementById('todo-list').appendChild(listElement);
      document.getElementById('error').className = 'hidden';
      document.getElementById('description').value = '';
    })
    .catch((err) => {
      const error = document.getElementById('error');
      error.className = 'error';
      error.innerHTML = JSON.stringify(err.message);
    });
};
