import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/task';
import { projectApi } from '../api/project';
import { teamApi } from '../api/team';
import { Task, Project } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          taskApi.getMyTasks(),
          projectApi.getAllProjects(),
        ]);
        setMyTasks(tasksRes.data);
        setProjects(projectsRes.data);

        if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
          const teamsRes = await teamApi.getMyTeams();
          setTeams(teamsRes.data);
          try {
            const allTasksRes = await Promise.all(
              projectsRes.data.map(p => taskApi.getTasksByProject(p.id))
            );
            const flatTasks = allTasksRes.flatMap(r => r.data);
            setAllTasks(flatTasks);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const todoCount = myTasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneCount = myTasks.filter(t => t.status === 'DONE').length;
  const reviewCount = myTasks.filter(t => t.status === 'IN_REVIEW').length;

  const adminTodoCount = allTasks.filter(t => t.status === 'TODO').length;
  const adminInProgressCount = allTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const adminDoneCount = allTasks.filter(t => t.status === 'DONE').length;
  const adminReviewCount = allTasks.filter(t => t.status === 'IN_REVIEW').length;
  const totalAdminTasks = allTasks.length;

  if (loading) {
    return <div className="text-center mt-5" style={{ color: 'var(--text-primary)' }}>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4" style={{ animation: 'fadeIn 0.6s ease-in' }}>
        <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: '700' }}>
          {isAdmin ? '👑 Admin Dashboard' : '🚀 My Workspace'}
        </h2>
        <p className="text-muted">Welcome back, <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{user?.username}</span>!</p>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card mb-3" style={{ background: 'var(--gradient-primary)', border: 'none', animationDelay: '0.1s' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1" style={{ color: 'white', opacity: 0.9 }}>My Tasks</h6>
                  <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>{myTasks.length}</h2>
                </div>
                <div style={{ fontSize: '2rem', animation: 'pulse 2s ease-in-out infinite' }}>📋</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card mb-3" style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', border: 'none', animationDelay: '0.2s' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1" style={{ color: 'white', opacity: 0.9 }}>To Do</h6>
                  <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>{todoCount}</h2>
                </div>
                <div style={{ fontSize: '2rem' }}>📝</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card mb-3" style={{ background: 'var(--gradient-warning)', border: 'none', animationDelay: '0.3s' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1" style={{ color: 'white', opacity: 0.9 }}>In Progress</h6>
                  <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>{inProgressCount}</h2>
                </div>
                <div style={{ fontSize: '2rem' }}>⚡</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card mb-3" style={{ background: 'var(--gradient-success)', border: 'none', animationDelay: '0.4s' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1" style={{ color: 'white', opacity: 0.9 }}>Completed</h6>
                  <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>{doneCount}</h2>
                </div>
                <div style={{ fontSize: '2rem' }}>✅</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card" style={{ animationDelay: '0.5s' }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">📌 My Recent Tasks</h5>
              <span className="badge" style={{ background: 'var(--gradient-primary)' }}>{myTasks.length}</span>
            </div>
            <div className="card-body">
              {myTasks.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem', opacity: 0.5 }}>📭</div>
                  <p className="text-muted mt-2 mb-0">No tasks assigned yet</p>
                </div>
              ) : (
                <ul className="list-group">
                  {myTasks.slice(0, 5).map((task, idx) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ animation: `slideIn 0.3s ease-out ${0.6 + idx * 0.1}s backwards` }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{task.title}</strong>
                        <br />
                        <small className="text-muted">📁 {task.projectName}</small>
                      </div>
                      <span className={`badge`} style={{
                        background: task.status === 'DONE' ? 'var(--gradient-success)' : 
                                   task.status === 'IN_PROGRESS' ? 'var(--gradient-warning)' : 
                                   task.status === 'IN_REVIEW' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 
                                   'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                        color: 'white'
                      }}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card" style={{ animationDelay: '0.6s' }}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">{isAdmin ? '🏢 All Projects' : '📂 My Projects'}</h5>
              <span className="badge" style={{ background: 'var(--gradient-success)' }}>{projects.length}</span>
            </div>
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem', opacity: 0.5 }}>🗂️</div>
                  <p className="text-muted mt-2 mb-0">No projects yet</p>
                </div>
              ) : (
                <ul className="list-group">
                  {projects.slice(0, 5).map((project, idx) => (
                    <li key={project.id} className="list-group-item" style={{ animation: `slideIn 0.3s ease-out ${0.7 + idx * 0.1}s backwards` }}>
                      <div className="d-flex align-items-center">
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          fontSize: '1.2rem'
                        }}>
                          📁
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{project.name}</strong>
                          <br />
                          <small className="text-muted">👥 {project.teamName}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="row mt-4 mb-4">
            <div className="col-12">
              <div className="card" style={{ animationDelay: '0.7s' }}>
                <div className="card-header">
                  <h5 className="mb-0">📊 Overall Project Analytics</h5>
                </div>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                      <svg width="200" height="200" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-surface)" strokeWidth="3"></circle>
                        {totalAdminTasks > 0 && (
                          <>
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray={`${(adminDoneCount/totalAdminTasks)*100} ${(100 - (adminDoneCount/totalAdminTasks)*100)}`} strokeDashoffset="25" style={{ transition: 'stroke-dasharray 1s ease' }}></circle>
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${(adminInProgressCount/totalAdminTasks)*100} ${(100 - (adminInProgressCount/totalAdminTasks)*100)}`} strokeDashoffset={25 - (adminDoneCount/totalAdminTasks)*100} style={{ transition: 'stroke-dasharray 1s ease' }}></circle>
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06b6d4" strokeWidth="3" strokeDasharray={`${(adminReviewCount/totalAdminTasks)*100} ${(100 - (adminReviewCount/totalAdminTasks)*100)}`} strokeDashoffset={25 - ((adminDoneCount+adminInProgressCount)/totalAdminTasks)*100} style={{ transition: 'stroke-dasharray 1s ease' }}></circle>
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#64748b" strokeWidth="3" strokeDasharray={`${(adminTodoCount/totalAdminTasks)*100} ${(100 - (adminTodoCount/totalAdminTasks)*100)}`} strokeDashoffset={25 - ((adminDoneCount+adminInProgressCount+adminReviewCount)/totalAdminTasks)*100} style={{ transition: 'stroke-dasharray 1s ease' }}></circle>
                          </>
                        )}
                        <text x="21" y="23" textAnchor="middle" style={{ fill: 'white', fontSize: '8px', fontWeight: '700' }}>{totalAdminTasks}</text>
                        <text x="21" y="28" textAnchor="middle" style={{ fill: 'var(--text-secondary)', fontSize: '4px' }}>Total</text>
                      </svg>
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center p-2" style={{ background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginRight: '10px' }}></div>
                            <div>
                              <div style={{ color: 'white', fontWeight: '600' }}>{adminDoneCount}</div>
                              <small style={{ color: 'var(--text-secondary)' }}>Completed</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center p-2" style={{ background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', marginRight: '10px' }}></div>
                            <div>
                              <div style={{ color: 'white', fontWeight: '600' }}>{adminInProgressCount}</div>
                              <small style={{ color: 'var(--text-secondary)' }}>In Progress</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center p-2" style={{ background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06b6d4', marginRight: '10px' }}></div>
                            <div>
                              <div style={{ color: 'white', fontWeight: '600' }}>{adminReviewCount}</div>
                              <small style={{ color: 'var(--text-secondary)' }}>In Review</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center p-2" style={{ background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#64748b', marginRight: '10px' }}></div>
                            <div>
                              <div style={{ color: 'white', fontWeight: '600' }}>{adminTodoCount}</div>
                              <small style={{ color: 'var(--text-secondary)' }}>To Do</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {teams.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="card" style={{ animationDelay: '0.8s' }}>
                  <div className="card-header">
                    <h5 className="mb-0">👑 Admin Control - Teams Overview</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {teams.map((team, idx) => (
                        <div key={team.id} className="col-md-4 mb-3" style={{ animation: `fadeIn 0.4s ease-out ${0.9 + idx * 0.1}s backwards` }}>
                          <div className="p-3" style={{ 
                            background: 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(99, 102, 241, 0.1) 100%)', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }} onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                          }} onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 style={{ color: 'white', marginBottom: '0', fontWeight: '600' }}>{team.name}</h6>
                              <span className="badge" style={{ background: 'var(--gradient-primary)' }}>👥 {team.memberCount}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{team.description || 'No description'}</p>
                            <div style={{ height: '4px', background: 'var(--bg)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: '70%', background: 'var(--gradient-primary)', animation: 'pulse 2s ease-in-out infinite' }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
