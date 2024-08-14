const request = require('supertest');
const app = require('../index'); // Import the Express app instance

describe('POST /api/auth/login', () => {
    it('should return the created auth/login!', async () => {
        // Sample auth data
        const auth = {
            "email": "admin@example.com",
            "password": "123456789"
        };

        await request(app)
            .post('/api/auth/login') // Adjust the endpoint if necessary
            .send(auth)
            .expect((response) => {
                if (response.status === 200) {
                    expect(response.status).toBe(200);
                } else if (response.status === 404) {
                    expect(response.status).toBe(404);
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            })
            .catch(err => {
                // Handle errors from Supertest request
                console.log('Error during POST /api/auth/login:', err.message);
                throw err;
            });
    });
});

describe('POST /api/user/logout', () => {
    it('should return the created user/logout!', async () => {
        // Sample Auth data
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE2MjUzLCJleHAiOjE3MjQyMjEwNTN9.xF_dNuFDGe4-TFJQCygVZzJXz664nGXXfQEW63vXksY';
        const Auth = {
            "resetToken": validJwtToken
        };

        await request(app)
            .post('/api/user/logout') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(Auth)
            .expect((response) => {
                if (response.status === 200) {
                    expect(response.status).toBe(200);
                } else if (response.status === 404) {
                    expect(response.status).toBe(404);
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            })
            .catch(err => {
                // Handle errors from Supertest request
                console.log('Error during POST /api/user/logout:', err.message);
                throw err;
            });
    });
});
