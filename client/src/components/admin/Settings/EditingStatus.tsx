// EditingStatus.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL + 'settings/editing-status/';

const EditingStatus: React.FC = () => {
  const [editingStatus, setEditingStatus] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the initial editing status from the server
    const fetchEditingStatus = async () => {
      try {
        const response = await axios.get(baseURL);
        setEditingStatus(response.data.editingStatus);
      } catch (error) {
        console.error('Error fetching editing status:', error);
      }
    };

    fetchEditingStatus();
  }, []);

  const handleLockEditing = async () => {
    try {
      await axios.put(baseURL, { editingStatus: false });
      setEditingStatus(false);
    } catch (error) {
      console.error('Error updating editing status:', error);
    }
  };

  const handleUnlockEditing = async () => {
    try {
      await axios.put(baseURL, { editingStatus: true });
      setEditingStatus(true);
    } catch (error) {
      console.error('Error updating editing status:', error);
    }
  };

  return (
    <div>
      <p>Editing is currently: {editingStatus ? 'Enabled' : 'Disabled'}</p>
      <button onClick={handleLockEditing} disabled={!editingStatus}>
        Lock Editing
      </button>
      <button onClick={handleUnlockEditing} disabled={editingStatus}>
        Unlock Editing
      </button>
    </div>
  );
};

export default EditingStatus;
