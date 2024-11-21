import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom'; // To navigate after saving
import { addUserToCommunity } from '../../../../services/communityService'; // Service for backend calls
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames'; // Fetch community names
import useUserContext from '../../../../hooks/useUserContext'; // Context for user data
import axios, { AxiosError } from 'axios'; // Properly import AxiosError


const ChooseCommunityPage = () => {
  const { communityNames } = useCommunityNames(); // Fetch communities
  const { user } = useUserContext(); // Get logged-in user details
  const navigate = useNavigate(); // For navigation
  const [selectedCommunity, setSelectedCommunity] = useState<string>(''); // Track selected community
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Debugging state changes for selectedCommunity
  useEffect(() => {
    console.log(`Selected Community: ${selectedCommunity}`);
  }, [selectedCommunity]);

  // Handle click on a community
  const handleCommunityClick = (communityName: string) => {
    console.log(`Clicked on community: ${communityName}`);
    setSelectedCommunity(prevCommunity =>
      prevCommunity === communityName ? '' : communityName
    );
    setError(null); // Clear previous errors
  };

  const saveCommunityAndContinue = async () => {
    if (!selectedCommunity) {
      setError('No community selected!');
      return;
    }
  
    if (!user?.username) {
      setError('User is not logged in!');
      return;
    }
  
    // Prevent multiple submissions
    if (loading) return;
  
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors
  
    try {
      console.log(`Adding user "${user.username}" to community "${selectedCommunity}"`);
      await addUserToCommunity(selectedCommunity, user.username); // Call the backend
      console.log('Community updated successfully in the backend');
      navigate('/home'); // Navigate to the home page or next step
    } catch (err) {
      // Type the error properly using AxiosError with a custom type
      const axiosError = err as AxiosError<{ error: string }>;
  
      console.error('Error adding user to community:', axiosError.response?.data || axiosError.message);
  
      // Set appropriate error message
      if (axiosError.response && axiosError.response.data?.error) {
        setError(axiosError.response.data.error);
      } else {
        setError('Failed to update community. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="community-container">
      <img src={logo} alt="Fake Stack Overflow Logo" className="logo-login" />
      <div className="recommendation-header">
        <h2>Recommended Communities:</h2>
      </div>
      <div className="community-list">
        {communityNames.map(community => (
          <li
            key={community.name}
            className={`community-pill ${
              selectedCommunity === community.name ? 'selected' : ''
            }`}
            onClick={() => handleCommunityClick(community.name)}
          >
            {community.name}
          </li>
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
        <button
          className={`next-button ${!selectedCommunity || loading ? 'disabled' : ''}`}
          disabled={!selectedCommunity || loading} // Disable while saving
          onClick={saveCommunityAndContinue}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ChooseCommunityPage;
