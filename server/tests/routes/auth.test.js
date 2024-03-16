const request = require('supertest');
const app = require('../app');

// Import the necessary modules

// Describe the test suite
describe('Auth API', () => {
  // Test case 1: Describe the behavior you want to test
  it('should return a 200 status code when logging in', async () => {
    // Make a request to the login endpoint
    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'testpassword',
    });

    // Assert that the response has a 200 status code
    expect(response.status).toBe(200);
  });

  // Test case 2: Describe another behavior you want to test
  it('should return a 401 status code when providing incorrect credentials', async () => {
    // Make a request to the login endpoint with incorrect credentials
    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'incorrectpassword',
    });

    // Assert that the response has a 401 status code
    expect(response.status).toBe(401);
  });
});
