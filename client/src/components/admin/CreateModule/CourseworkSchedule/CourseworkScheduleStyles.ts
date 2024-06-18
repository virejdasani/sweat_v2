export const courseworkScheduleStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '1rem',
    size: 'sm',
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
  totalTime: {
    fontWeight: 'bold',
  },
};
