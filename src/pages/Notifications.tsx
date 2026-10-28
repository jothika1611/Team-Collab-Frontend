import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notification';
import { Notification } from '../types';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getMyNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notifications</h2>
        <button className="btn btn-primary" onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted">No notifications</p>
      ) : (
        <div className="list-group">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`list-group-item ${!notification.read ? 'list-group-item-warning' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">{notification.message}</p>
                  <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
                {!notification.read && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => markAsRead(notification.id)}>
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
