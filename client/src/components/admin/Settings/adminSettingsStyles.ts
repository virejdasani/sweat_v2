const adminSettingsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  formFactorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default adminSettingsStyles;
