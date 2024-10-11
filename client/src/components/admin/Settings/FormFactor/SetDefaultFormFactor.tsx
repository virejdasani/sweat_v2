import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Tooltip,
  Input,
  Icon,
  Button,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  getDefaultFormFactor,
  saveFormFactor,
} from '../../../../services/admin/Settings';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SetDefaultFormFactorProps {
  onFormFactorChange: (value: number) => void;
}

const SetDefaultFormFactor: React.FC<SetDefaultFormFactorProps> = ({
  onFormFactorChange,
}) => {
  const [formFactor, setFormFactor] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFormFactor = async () => {
      try {
        const fetchedFormFactor = await getDefaultFormFactor();
        setFormFactor(fetchedFormFactor !== null ? fetchedFormFactor : 0);
        onFormFactorChange(fetchedFormFactor !== null ? fetchedFormFactor : 0);
      } catch (error) {
        console.error('Error fetching form factor', error);
        setFormFactor(0); // Default to 0 on error
        onFormFactorChange(0); // Default to 0 on error
        toast.error('Error fetching form factor');
      } finally {
        setLoading(false);
      }
    };

    fetchFormFactor();
  }, [onFormFactorChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormFactor(value);
    onFormFactorChange(value);
  };

  const handleSave = async () => {
    try {
      await saveFormFactor(formFactor);
      toast.success('Form factor saved successfully');
    } catch (error) {
      toast.error('Error saving form factor');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.location.href = '/';
        }}
      >
        Home
      </button>
      <Flex align="center">
        <Text mr={2}>Form Factor (%):</Text>
        <Tooltip
          label="Form Factor is the percentage of contact time that will be dedicated to all courseworks."
          aria-label="Form Factor Tooltip"
          hasArrow
          bg="black"
          color="white"
        >
          <Box as="span" display="inline-block">
            <Icon as={QuestionOutlineIcon} mr={2} cursor="pointer" />
          </Box>
        </Tooltip>
        <Input
          type="number"
          value={formFactor}
          onChange={handleChange}
          style={{ width: '80px' }}
        />
      </Flex>
      <Button onClick={handleSave} mt={4}>
        Save
      </Button>
    </Box>
  );
};

export default SetDefaultFormFactor;
