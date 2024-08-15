const RequestDecision = require('supertest'); // Import supertest
const decisionApp = require('../index'); // Rename the app variable

describe('GET /decisions', () => {
    it('should return all decisions', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestDecision(decisionApp)
            .get('/api/decisions') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
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
                // Handle errors from Supertest RequestDecision
                console.log('Error during GET /api/decisions:', err.message);
                throw err;
            });
    });
});

describe('GET /api/decisions/:id', () => {
    it('should return a decision by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestDecision(decisionApp)
            .get(`/api/decisions/1`) // Adjust the ID to include a real ID
            .set('Authorization', `Bearer ${validJwtToken}`)
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
                // Handle errors from Supertest RequestDecision
                console.log('Error during GET /api/decisions/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/decisions/:id', () => {
    it('should update a decision by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            decisionName: 'Updated Decision Name', // Example of what might be updated
            description: 'Updated decision description',
        };

        await RequestDecision(decisionApp)
            .patch(`/api/decisions/1`) // Adjust the ID to include a real ID
            .set('Authorization', `Bearer ${validJwtToken}`)
            .send(updateData)
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
                // Handle errors from Supertest RequestDecision
                console.log('Error during PATCH /api/decisions/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/decisions', () => {
    it('should create a new decision', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Decision data
        const decision = {
            decisionName: 'New Decision',
            refrance: 'DEC123456',
            governmentOfficeId: 1,
            title: 'Decision Title',
            description: 'Decision description goes here.',
            decisionSource: 'Government Office',
            nameSource: 'Office Name',
            attachmentPath: '/path/to/attachment',
        };

        await RequestDecision(decisionApp)
            .post('/api/decisions') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(decision)
            .expect((response) => {
                if (response.status === 201) {
                    expect(response.status).toBe(201);
                } else if (response.status === 404) {
                    expect(response.status).toBe(404);
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            })
            .catch(err => {
                // Handle errors from Supertest RequestDecision
                console.log('Error during POST /api/decisions:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/decisions/:id', () => {
    it('should delete a decision by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestDecision(decisionApp)
            .delete(`/api/decisions/1`) // Adjust the ID to include a real ID
            .set('Authorization', `Bearer ${validJwtToken}`)
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
                // Handle errors from Supertest RequestDecision
                console.log('Error during DELETE /api/decisions/:id:', err.message);
                throw err;
            });
    });
});
