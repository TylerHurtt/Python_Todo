// Create tofolist element
function createListElement(todo) {
  console.log('inside CLE');
  // Create list element
  const listElement = document.createElement('li');
  listElement.id = `li${todo.id}`;
  listElement.className = 'list-item';
  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  checkbox.id = todo.id;
  addCheckboxOnchange(checkbox);
  // Append checkbox
  listElement.append(checkbox);
  listElement.append(' ');
  // Create text
  const text = document.createElement('p');
  text.className = 'todo';
  text.innerHTML = todo.description;
  // Append checkbox
  listElement.append(text);
  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'X';
  deleteBtn.className = 'delete-btn';
  deleteBtn.id = todo.id;
  addDeleteBtnOnclick(deleteBtn);
  // Append delete button
  listElement.append(deleteBtn);
  // Append list element to the list
  document.getElementById('todo-list').appendChild(listElement);
  // Set error element to hidden
  document.getElementById('error').className = 'hidden';
  // Reset description input field
  document.getElementById('description').value = '';
  addCheckAllButton();
}

// Add Todo
function addTodo() {
  const form = document.getElementById('form');
  form.onsubmit = function (e) {
    e.preventDefault();
    const todoDescription = document.getElementById('description').value;
    const listId = document.querySelector('.selected').dataset.id;
    if (todoDescription != '') {
      console.log('about to fetch', todoDescription, listId);
      fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
          description: todoDescription.toLowerCase(),
          listId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((todo) => {
          console.log('creating element');
          createListElement(todo);
        })
        .catch((err) => {
          const error = document.getElementById('error');
          error.className = 'error';
          error.innerHTML = JSON.stringify(err.message);
        });
    }
  };
}

// Checked-Box
function addCheckBoxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  const numberOfCheckboxes = checkboxes.length;
  for (let i = 0; i < numberOfCheckboxes; i++) {
    const checkbox = checkboxes[i];
    addCheckboxOnchange(checkbox);
  }
}

// Add checkbox onchange
function addCheckboxOnchange(checkbox) {
  checkbox.onchange = function (e) {
    const checkbox = e.target;
    const checked = checkbox.checked;
    checkBoxFetch(checkbox, checked);
  };
}

// Delete-Box
function addDeleteButtons() {
  const deleteBtns = document.querySelectorAll('.delete-btn');
  const numberOfDeleteBtns = deleteBtns.length;
  for (let i = 0; i < numberOfDeleteBtns; i++) {
    const deleteBtn = deleteBtns[i];
    if (deleteBtn.name) {
      addTodoListDeleteBtnOnclick(deleteBtn);
    } else {
      addDeleteBtnOnclick(deleteBtn);
    }
  }
}

// add delete button onClick fro list element
function addDeleteBtnOnclick(deleteBtn) {
  deleteBtn.onclick = function (e) {
    const id = e.target.id;

    const isDeleted = document.querySelector(`#li${id}`);
    isDeleted.remove();
    addCheckAllButton();
    fetch(`/todos/${id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => (document.getElementById('error').className = 'hidden'))
      .catch((err) => {
        const error = document.getElementById('error');
        error.className = 'error';
        error.innerHTML = JSON.stringify(err.message);
      });
  };
}

// add delete butoon to todolist
function addTodoListDeleteBtnOnclick(deleteBtn) {
  deleteBtn.onclick = function (e) {
    const id = e.target.id;
    const listOfTodos = document.querySelector('#todo-list');
    removeAllChildNodes(listOfTodos);
    fetch(`/todolist/${id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        document.getElementById('error').className = 'hidden';
        window.location.replace('/');
      })
      .catch((err) => {
        const error = document.getElementById('error');
        error.className = 'error';
        error.innerHTML = JSON.stringify(err.message);
      });
  };
}

// remove all child nodes helper
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Add Todolist
function addTodoList() {
  const addList = document.querySelector('#add-list-form');
  const modal = addTodolistModal();
  addList.onsubmit = function (e) {
    e.preventDefault();
    const newListInput = document.querySelector('#new-list');
    const name = newListInput.value;
    if (name != '') {
      modal.style.display = 'none';
      fetch('/todolist/create', {
        method: 'POST',
        body: JSON.stringify({
          name,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((todoList) => {
          window.location.replace(`/todolist/${todoList.id}`);
          document.getElementById('error').className = 'hidden';
        })
        .catch((err) => {
          const error = document.getElementById('error');
          error.className = 'error';
          error.innerHTML = JSON.stringify(err.message);
        });
    }
  };
}

// Add rename form
function addRenameForm() {
  const renameForm = document.querySelector('#rename-form');
  const modal = addRenameModal();
  renameForm.onsubmit = function (e) {
    e.preventDefault();
    const renameInput = document.querySelector('#rename-input');
    const newName = renameInput.value;
    const selected = document.querySelector('.selected');
    const id = selected.dataset.id;
    renameInput.value = '';
    modal.style.display = 'none';
    if (newName != '') {
      fetch(`/todolist/${id}/rename`, {
        method: 'PATCH',
        body: JSON.stringify({
          newName,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((todolist) => {
          console.log(todolist);
          const listName = document.querySelector('.selected');
          listName.innerText = todolist.name;
        })
        .catch((err) => {
          const error = document.getElementById('error');
          error.className = 'error';
          error.innerHTML = JSON.stringify(err.message);
        });
    }
  };
}

// Check all
function addCheckAllButton() {
  const checkAllBtn = document.querySelector('#check-all');
  const checkboxes = document.querySelectorAll('.checkbox');
  const numCheckboxes = checkboxes.length;

  if (numCheckboxes <= 1) {
    checkAllBtn.style.display = 'none';
  } else {
    checkAllBtn.style.display = '';
    for (let i = 0; i < numCheckboxes; i++) {
      const checkbox = checkboxes[i];
      addCheckboxOnchange(checkbox);
    }
  }
  checkAllBtn.onclick = function (e) {
    const checkboxesArray = Array.from(document.querySelectorAll('.checkbox'));
    const checkAllToggle = checkboxesArray.reduce(
      (acc, curr, i, arr) => {
        console.log(curr.checked);
        if (!curr.checked) acc.toggleTrue.push(curr);
        else acc.toggleFalse.push(curr);
        return acc;
      },
      { toggleTrue: [], toggleFalse: [] }
    );
    if (checkAllToggle.toggleTrue.length > 0) {
      console.log('toggleTrue', checkAllToggle.toggleTrue);
      for (let i = 0; i < checkAllToggle.toggleTrue.length; i++) {
        const checkbox = checkAllToggle.toggleTrue[i];
        checkbox.checked = !checkbox.checked;
        const checked = checkbox.checked;
        checkBoxFetch(checkbox, checked);
      }
    } else {
      console.log('toggleFalse', checkAllToggle.toggleFalse);
      for (let i = 0; i < checkAllToggle.toggleFalse.length; i++) {
        const checkbox = checkAllToggle.toggleFalse[i];
        checkbox.checked = !checkbox.checked;
        const checked = checkbox.checked;
        checkBoxFetch(checkbox, checked);
      }
    }
  };
}

// checkBox fetch
function checkBoxFetch(checkbox, checked) {
  const id = checkbox.id;
  fetch(`/todos/${id}/set-completed`, {
    method: 'POST',
    body: JSON.stringify({
      completed: checked,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => (document.getElementById('error').className = 'hidden'))
    .catch(() => {
      const error = document.getElementById('error');
      error.className = 'error';
      error.innerHTML = JSON.stringify(error.message);
    });
}

// renamelist modal
function addRenameModal() {
  const renameButton = document.querySelector('#rename-list');
  const modal = document.querySelector('#rename-list-modal');
  renameButton.onclick = function () {
    modal.style.display = 'block';
    console.log(modal.style.display);
    const renameInput = document.querySelector('#rename-input');
    const closeButton = document.querySelector('#rename-close');
    window.onclick = function (e) {
      if (e.target == modal) {
        modal.style.display = 'none';
      }
    };

    closeButton.onclick = function () {
      renameInput.value = '';
      modal.style.display = 'none';
    };
  };
  return modal;
}

// todolist modal
function addTodolistModal() {
  const addModalButton = document.querySelector('#add-list');
  const modal = document.querySelector('.modal');
  addModalButton.onclick = function () {
    modal.style.display = 'block';
    const newListInput = document.querySelector('#new-list');
    const closeButton = document.querySelector('.close-modal');

    window.onclick = function (e) {
      if (e.target == modal) {
        modal.style.display = 'none';
      }
    };

    closeButton.onclick = function () {
      newListInput.value = '';
      modal.style.display = 'none';
    };
  };
  return modal;
}
addTodo();
addTodoList();
addTodolistModal();
addDeleteButtons();
addCheckBoxes();
addRenameForm();
