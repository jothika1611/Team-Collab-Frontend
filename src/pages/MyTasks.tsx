import { useState, useEffect } from 'react';
import { taskApi } from '../api/task';
import { Task } from '../types';

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">My Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-muted">No tasks assigned to you yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    <br />
                    <small className="text-muted">{task.description?.substring(0, 80)}...</small>
                  </td>
                  <td>{task.projectName}</td>
                  <td>
                    <span className={`badge bg-${
                      task.priority === 'CRITICAL' ? 'danger' :
                      task.priority === 'HIGH' ? 'warning' :
                      task.priority === 'MEDIUM' ? 'info' : 'secondary'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${
                      task.status === 'DONE' ? 'success' : 
                      task.status === 'IN_PROGRESS' ? 'warning' : 
                      task.status === 'IN_REVIEW' ? 'info' : 'secondary'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.dueDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
