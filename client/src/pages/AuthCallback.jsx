import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      loginWithToken(token)
        .then(() => {
          showToast('Google login successful! Welcome.', 'success');
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          showToast('Authentication failed. Please try again.', 'error');
          navigate('/login', { replace: true });
        });
    } else {
      showToast('No authentication token received.', 'error');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;
