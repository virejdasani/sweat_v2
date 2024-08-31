import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Text } from '@chakra-ui/react';

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
    <Box
      width="100%"
      maxWidth="500px"
      margin="0 auto"
      padding="20px"
      border="1px solid #e2e8f0"
      borderRadius="8px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      backgroundColor="white"
      textAlign="center"
    >
      <Text fontSize="lg" fontWeight="bold" marginBottom="10px">
        Editing Status
      </Text>
      <Text marginBottom="20px">
        Editing is currently {editingStatus ? 'enabled' : 'disabled'}
      </Text>
      {editingStatus ? (
        <Button colorScheme="red" onClick={handleLockEditing}>
          Lock Editing
        </Button>
      ) : (
        <Button colorScheme="green" onClick={handleUnlockEditing}>
          Unlock Editing
        </Button>
      )}
    </Box>
  );
};

export default EditingStatus;
