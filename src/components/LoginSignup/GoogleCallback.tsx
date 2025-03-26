// src/components/LoginSignup/GoogleCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store/hook';
import { setUserDetails } from '../../redux/slices/userSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get token from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Store token
      localStorage.setItem('token', token);

      // Fetch user profile using the token
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('https://backend.wavezgoa.com/customer/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userData = await response.json();

          // Update Redux state
          dispatch(setUserDetails({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: 'customer'
          }));

          // Navigate to home page
          navigate('/discover');
        } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/login');
        }
      };

      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [navigate, dispatch]);

  return (
    <div>Processing login...</div>
  );
};

export default GoogleCallback;