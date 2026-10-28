import { useState, useEffect } from 'react';
import { teamApi, TeamMember } from '../api/team';
import { userApi } from '../api/user';
import { Team, User } from '../types';

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState<number | null>(null);
  const [showMembersList, setShowMembersList] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: TeamMember[] }>({});
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamApi.getMyTeams(),
        userApi.getAllUsers(),
      ]);
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: number) => {
    try {
      const response = await teamApi.getTeamMembers(teamId);
      setTeamMembers({ ...teamMembers, [teamId]: response.data });
    } catch (error) {
      console.error('Error fetching team members', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teamApi.createTeam(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating team', error);
    }
  };

  const handleAddMember = async (teamId: number) => {
    if (selectedUserId === 0) return;
    try {
      await teamApi.addMember(teamId, selectedUserId);
      alert('Member added successfully');
      setShowMemberForm(null);
      setSelectedUserId(0);
      fetchData();
      if (showMembersList === teamId) {
        fetchTeamMembers(teamId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId: number, memberId: number) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await teamApi.removeMember(teamId, memberId);
      alert('Member removed successfully');
      fetchTeamMembers(teamId);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleUpdateRole = async (teamId: number, memberId: number, role: string) => {
    try {
      await teamApi.updateMemberRole(teamId, memberId, role);
      alert('Role updated successfully');
      fetchTeamMembers(teamId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const toggleMembersList = (teamId: number) => {
    if (showMembersList === teamId) {
      setShowMembersList(null);
    } else {
      setShowMembersList(teamId);
      if (!teamMembers[teamId]) {
        fetchTeamMembers(teamId);
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Team'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">Create</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {teams.length === 0 ? (
          <div className="col-12">
            <p className="text-muted">No teams yet. Create your first team!</p>
          </div>
        ) : (
          teams.map(team => (
            <div key={team.id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: 'white' }}>{team.name}</h5>
                  <p className="card-text" style={{ color: 'white' }}>{team.description}</p>
                  <p className="text-muted small">
                    Members: {team.memberCount} | Created by: {team.createdByUsername}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setShowMemberForm(team.id)}>
                      Add Member
                    </button>
                    <button className="btn btn-sm btn-outline-info" onClick={() => toggleMembersList(team.id)}>
                      {showMembersList === team.id ? 'Hide Members' : 'View Members'}
                    </button>
                  </div>

                  {showMemberForm === team.id && (
                    <div className="mt-3">
                      <select
                        className="form-select mb-2"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                      >
                        <option value={0}>Select User</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.role})
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleAddMember(team.id)}>Add</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setShowMemberForm(null)}>Cancel</button>
                    </div>
                  )}

                  {showMembersList === team.id && (
                    <div className="mt-3">
                      <h6 className="mb-2">Team Members</h6>
                      {teamMembers[team.id] && teamMembers[team.id].length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teamMembers[team.id].map(member => (
                                <tr key={member.id}>
                                  <td>{member.username}</td>
                                  <td>
                                    <select
                                      className="form-select form-select-sm"
                                      value={member.role}
                                      onChange={(e) => handleUpdateRole(team.id, member.id, e.target.value)}
                                    >
                                      <option value="LEAD">LEAD</option>
                                      <option value="MEMBER">MEMBER</option>
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleRemoveMember(team.id, member.id)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted small">No members found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teams;
