import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Goals() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to /plan immediately
    navigate('/plan', { replace: true });
  }, [navigate]);
  
  return (
    <div>
      <p>Redirecting to Plan...</p>
    </div>
  );
}


