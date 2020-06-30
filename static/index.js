// Fetch
const form = document.getElementById('form');
form.onsubmit = function (e) {
  e.preventDefault();
  const todoDescription = document.getElementById('description').value;
  if (todoDescription != '') {
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
        // Create list element
        const listElement = document.createElement('li');
        listElement.id = `li${data.id}`;
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.id = data.id;
        addCheckboxOnchange(checkbox);
        // Append checkbox
        listElement.append(checkbox);
        listElement.append(' ');
        // Create text
        const text = document.createElement('p');
        text.className = 'todo';
        text.innerHTML = data.description;
        // Append checkbox
        listElement.append(text);
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.id = data.id;
        addDeleteBtnOnclick(deleteBtn);
        // Append delete button
        listElement.append(deleteBtn);
        // Append list element to the list
        document.getElementById('todo-list').appendChild(listElement);
        // Set error element to hidden
        document.getElementById('error').className = 'hidden';
        // Reset description input field
        document.getElementById('description').value = '';
      })
      .catch((err) => {
        const error = document.getElementById('error');
        error.className = 'error';
        error.innerHTML = JSON.stringify(err.message);
      });
  }
};

// Checked-Box
const checkboxes = document.querySelectorAll('.checkbox');
const numberOfCheckboxes = checkboxes.length;
for (let i = 0; i < numberOfCheckboxes; i++) {
  const checkbox = checkboxes[i];
  addCheckboxOnchange(checkbox);
}

function addCheckboxOnchange(checkbox) {
  const funcionalCheckbox = checkbox;
  funcionalCheckbox.onchange = function (e) {
    const isCompleted = e.target.checked;
    const id = e.target.id;
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

// Delete-Box
const deleteBtns = document.querySelectorAll('.delete-btn');
const numberOfDeleteBtns = deleteBtns.length;
for (let i = 0; i < numberOfDeleteBtns; i++) {
  const deleteBtn = deleteBtns[i];
  addDeleteBtnOnclick(deleteBtn);
}

function addDeleteBtnOnclick(deleteBtn) {
  deleteBtn.onclick = function (e) {
    const id = e.target.id;

    const isDeleted = document.querySelector(`#li${id}`);
    isDeleted.remove();

    fetch(`/todos/${id}/delete`, {
      method: 'DELETE',
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
