export const courseworkSetupStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '1rem',
    borderRadius: '2rem',
  },
  th: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #e0e0e0',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #e0e0e0',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    '&:focus': {
      outline: 'none',
      borderColor: '#3182ce',
      boxShadow: '0 0 0 1px #3182ce',
    },
  },
  select: {
    width: '150px',
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#fff',
    '&:focus': {
      outline: 'none',
      borderColor: '#3182ce',
      boxShadow: '0 0 0 1px #3182ce',
    },
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#3182ce',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#2c5282',
    },
    '&:disabled': {
      backgroundColor: '#e0e0e0',
      color: '#a0aec0',
      cursor: 'not-allowed',
    },
  },
  addButton: {
    marginTop: '1rem',
  },
  totalWeight: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    '&:focus': {
      outline: 'none',
      borderColor: '#3182ce',
      boxShadow: '0 0 0 1px #3182ce',
    },
  },
};
