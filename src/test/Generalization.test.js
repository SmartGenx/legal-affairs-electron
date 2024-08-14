const RequestGeneralization = require('supertest'); // Import supertest
const generalizationApp = require('../index'); // Rename the app variable

describe('GET /generalizations', () => {
    it('should return all generalizations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGeneralization(generalizationApp)
            .get('/api/generalizations') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestGeneralization
                console.log('Error during GET /api/generalizations:', err.message);
                throw err;
            });
    });
});

describe('GET /api/generalizations/:id', () => {
    it('should return a generalization by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGeneralization(generalizationApp)
            .get(`/api/generalizations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGeneralization
                console.log('Error during GET /api/generalizations/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/generalizations/:id', () => {
    it('should update a generalization by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            title: 'Updated Generalization Title', // Example of what might be updated
            description: 'Updated generalization description',
        };

        await RequestGeneralization(generalizationApp)
            .patch(`/api/generalizations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGeneralization
                console.log('Error during PATCH /api/generalizations/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/generalizations', () => {
    it('should create a new generalization', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Generalization data
        const generalization = {
            title: 'New Generalization',
            refrance: 'GEN123456',
            description: 'Generalization description goes here.',
            attachmentPath: '/path/to/attachment',
        };

        await RequestGeneralization(generalizationApp)
            .post('/api/generalizations') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(generalization)
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
                // Handle errors from Supertest RequestGeneralization
                console.log('Error during POST /api/generalizations:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/generalizations/:id', () => {
    it('should delete a generalization by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGeneralization(generalizationApp)
            .delete(`/api/generalizations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGeneralization
                console.log('Error during DELETE /api/generalizations/:id:', err.message);
                throw err;
            });
    });
});
