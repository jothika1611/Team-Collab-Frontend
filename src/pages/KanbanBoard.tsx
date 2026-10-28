import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { projectApi } from '../api/project';
import { taskApi } from '../api/task';
import { userApi } from '../api/user';
import { Project, Task, User } from '../types';

const columns = {
  TODO: { title: 'To Do', color: 'secondary' },
  IN_PROGRESS: { title: 'In Progress', color: 'warning' },
  IN_REVIEW: { title: 'In Review', color: 'info' },
  DONE: { title: 'Done', color: 'success' },
};

const KanbanBoard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: 0 });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getAllProjects();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId: number) => {
    try {
      const response = await taskApi.getTasksByProject(projectId);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId as Task['status'];
    
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null,
        projectId: selectedProject,
        status: 'TODO',
        assignedToId: taskForm.assignedToId === 0 ? null : taskForm.assignedToId,
      };
      await taskApi.createTask(payload);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: 0 });
      setShowTaskForm(false);
      fetchTasks(selectedProject);
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kanban Board</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select" 
            style={{ width: '200px' }}
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(parseInt(e.target.value))}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>
      </div>

      {showTaskForm && selectedProject && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleCreateTask}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={taskForm.assignedToId}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedToId: parseInt(e.target.value) })}
                  >
                    <option value={0}>Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {(user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username} (@{user.username}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">Create Task</button>
            </form>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="alert alert-info">
          No projects found. Create a project first in the Projects page.
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row">
            {Object.entries(columns).map(([status, column]) => (
              <div key={status} className="col-md-3">
                <div className="card">
                  <div className={`card-header bg-${column.color} text-white`}>
                    <h6 className="mb-0">{column.title} ({getTasksByStatus(status).length})</h6>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="card-body"
                        style={{ minHeight: '400px' }}
                      >
                        {getTasksByStatus(status).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="card mb-2"
                                style={{ ...provided.draggableProps.style }}
                                onClick={() => window.location.href = `/tasks/${task.id}`}
                              >
                                <div className="card-body p-2">
                                  <h6 className="card-title mb-1" style={{ color: 'white' }}>{task.title}</h6>
                                  <p className="card-text small mb-1" style={{ color: 'white' }}>
                                    {task.description?.substring(0, 60)}
                                    {task.description && task.description.length > 60 ? '...' : ''}
                                  </p>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className={`badge bg-${
                                      task.priority === 'CRITICAL' ? 'danger' :
                                      task.priority === 'HIGH' ? 'warning' :
                                      task.priority === 'MEDIUM' ? 'info' : 'secondary'
                                    }`} style={{ fontSize: '0.7rem' }}>
                                      {task.priority}
                                    </span>
                                    {task.assignedToUsername && (
                                      <small className="text-muted">@{task.assignedToUsername}</small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default KanbanBoard;
