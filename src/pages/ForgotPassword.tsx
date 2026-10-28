import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

const ForgotPassword = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(usernameOrEmail);
      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Forgot Password</h2>
              <p className="text-muted text-center">Enter your username or email to get a reset token</p>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              
              {!resetToken && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username or Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="Enter username or email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Generating...' : 'Get Reset Token'}
                  </button>
                </form>
              )}
              
              {resetToken && (
                <div className="mt-3">
                  <div className="alert alert-warning">
                    <strong>Your Reset Token:</strong>
                    <div className="mt-2 p-2 bg-light border rounded text-break">
                      <code>{resetToken}</code>
                    </div>
                    <small className="d-block mt-2">Copy this token. It expires in 30 minutes.</small>
                  </div>
                  <Link to={`/reset-password?token=${resetToken}`} className="btn btn-success w-100">
                    Go to Reset Password
                  </Link>
                </div>
              )}
              
              <div className="text-center mt-3">
                <Link to="/login">Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
