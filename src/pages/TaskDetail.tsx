import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { taskApi } from '../api/task';
import { commentApi } from '../api/comment';
import { Task, CommentDto } from '../types';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTaskAndComments(parseInt(id));
    }
  }, [id]);

  const fetchTaskAndComments = async (taskId: number) => {
    try {
      const [taskRes, commentsRes] = await Promise.all([
        taskApi.getTaskById(taskId),
        commentApi.getComments(taskId),
      ]);
      setTask(taskRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Error fetching task details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    
    try {
      await commentApi.addComment(parseInt(id), newComment);
      setNewComment('');
      fetchTaskAndComments(parseInt(id));
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!task) return <div className="alert alert-danger">Task not found</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <div className="card mb-4">
        <div className="card-body">
          <p className="card-text">{task.description}</p>
          <div className="row">
            <div className="col-md-3">
              <strong>Project:</strong> {task.projectName}
            </div>
            <div className="col-md-3">
              <strong>Status:</strong> <span className="badge bg-secondary">{task.status}</span>
            </div>
            <div className="col-md-3">
              <strong>Priority:</strong> <span className="badge bg-info">{task.priority}</span>
            </div>
            <div className="col-md-3">
              <strong>Assigned To:</strong> {task.assignedToUsername || 'Unassigned'}
            </div>
          </div>
        </div>
      </div>

      <h4>Comments</h4>
      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleAddComment}>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Comment</button>
          </form>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <strong>{comment.firstName} {comment.lastName} (@{comment.username})</strong>
                <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
              <p className="mt-2 mb-0">{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskDetail;
