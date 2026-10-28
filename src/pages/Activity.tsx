import { useState, useEffect } from 'react';
import { activityApi } from '../api/activity';
import { ActivityLog } from '../types';

const Activity = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityApi.getRecentActivity();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Activity History</h2>
      {activities.length === 0 ? (
        <p className="text-muted">No activity yet</p>
      ) : (
        <div className="list-group">
          {activities.map(activity => (
            <div key={activity.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{activity.user?.username || 'System'}</strong> {activity.details}
                </div>
                <small className="text-muted">{new Date(activity.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
