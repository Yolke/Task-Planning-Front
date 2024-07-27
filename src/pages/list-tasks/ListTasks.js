import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListTasks.css';

const ListTasks = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://127.0.0.1:8000/task/')
      .then(response => {
        const tasksData = response.data;
        const groupedTasks = {
          todo: [],
          inProgress: [],
          done: []
        };

        tasksData.forEach(task => {
          if (groupedTasks[task.status]) {
            groupedTasks[task.status].push(task);
          }
        });

        setTasks(groupedTasks);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des tâches:', error);
      });
  };

  const moveTask = (taskId, currentStatus, direction) => {
    const statusOrder = ['todo', 'inProgress', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    let newStatus = currentStatus;

    if (direction === 'left' && currentIndex > 0) {
      newStatus = statusOrder[currentIndex - 1];
    } else if (direction === 'right' && currentIndex < statusOrder.length - 1) {
      newStatus = statusOrder[currentIndex + 1];
    }

    if (newStatus !== currentStatus) {
      const taskToMove = tasks[currentStatus].find(task => task.id === taskId);

      axios.put(`http://127.0.0.1:8000/task/${taskId}/`, {
        ...taskToMove,
        status: newStatus
      })
      .then(() => {
        fetchTasks(); // Recharger les tâches après mise à jour
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
      });
    }
  };

  const getTaskStyle = (task) => {
    const today = new Date();
    const dueDate = new Date(task.due_date);
    const isOverdue = dueDate < today;

    let backgroundColor = '';

    switch (task.status) {
      case 'todo':
        backgroundColor = isOverdue ? 'lightcoral' : 'white'; // Rouge clair pour en retard
        break;
      case 'done':
        backgroundColor = 'lightgreen'; // Vert clair pour terminé
        break;
      case 'inProgress':
        backgroundColor = 'lightyellow'; // Jaune clair pour en cours
        break;
      default:
        backgroundColor = 'white'; // Couleur par défaut
        break;
    }

    return { backgroundColor };
  };

  return (
    <div className="list-tasks-container">
      {['todo', 'inProgress', 'done'].map(status => (
        <div key={status} className="column">
          <h2>
            {status === 'todo' ? 'À faire' : status === 'inProgress' ? 'En cours' : 'Terminé'}
          </h2>
          {tasks[status].map(task => (
            <div key={task.id} className="task-card" style={getTaskStyle(task)}>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <small>Due: {task.due_date}</small>
              <div className="task-buttons">
                {status === 'todo' && (
                  <button onClick={() => moveTask(task.id, status, 'right')} className="arrow-button">
                    &gt;
                  </button>
                )}
                {status === 'inProgress' && (
                  <>
                    <button onClick={() => moveTask(task.id, status, 'left')} className="arrow-button">
                      &lt;
                    </button>
                    <button onClick={() => moveTask(task.id, status, 'right')} className="arrow-button">
                      &gt;
                    </button>
                  </>
                )}
                {status === 'done' && (
                  <button onClick={() => moveTask(task.id, status, 'left')} className="arrow-button">
                    &lt;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ListTasks;
