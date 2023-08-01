document.addEventListener('DOMContentLoaded', () => {
    refreshTaskList();
  });
  
  function addTask() {
    const taskInput = document.getElementById('newTask');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
  
    const imageInput = document.getElementById('taskImage');
    const imageFile = imageInput.files[0];
  
    const formData = new FormData();
    formData.append('taskText', taskText);
  
    if (imageFile) {
      formData.append('taskImage', imageFile);
    }
  
    fetch('/addTask', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error adding task:', err));
  
    taskInput.value = '';
    imageInput.value = '';
  }
  
  
  function deleteTask(index) {
    fetch(`/deleteTask/${index}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error deleting task:', err));
  }
  
  function refreshTaskList() {
    const taskListDiv = document.getElementById('taskList');
    taskListDiv.innerHTML = '';
  
    fetch('/tasks')
      .then((res) => res.json())
      .then((data) => {
        data.tasks.forEach((task, index) => {
          const taskDiv = document.createElement('div');
          taskDiv.classList.add('task');
  
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task.completed;
          checkbox.addEventListener('change', () => {
            updateTaskCompletion(index, checkbox.checked);
          });
  
          const taskTextElement = document.createElement('span');
          taskTextElement.textContent = task.text;
          if (task.completed) {
            taskTextElement.classList.add('completed');
          }
  
          const deleteButton = document.createElement('span');
          deleteButton.classList.add('delete-task');
          deleteButton.textContent = 'X';
        
          
          deleteButton.addEventListener('click', () => {
            deleteTask(index);
          });
  
          
          

          taskListDiv.appendChild(taskDiv);
          taskDiv.appendChild(taskTextElement);
          if (task.image) {
            const imgElement = document.createElement('img');
            imgElement.src = task.image.path;
            imgElement.classList.add('task-image');
            taskDiv.appendChild(imgElement);
          }
          taskDiv.appendChild(checkbox);
  
          
          taskDiv.appendChild(deleteButton);
        });
      })
      .catch((err) => console.error('Error fetching tasks:', err));
  }
  
  
  function updateTaskCompletion(index, completed) {
    fetch(`/updateTask/${index}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error updating task:', err));
  }
  