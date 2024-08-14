const RequestPostion = require('supertest'); // Import supertest
const PostionApp = require('../index'); // Rename the app variable

describe('GET /Postions', () => {
    it('should return all leave allocations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestPostion(PostionApp)
            .get('/api/Postions') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestPostion
                console.log('Error during GET /api/Postions:', err.message);
                throw err;
            });
    });
});

describe('GET /api/Postions/:id', () => {
    it('should return leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestPostion(PostionApp)
            .get(`/api/Postions/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestPostion
                console.log('Error during GET /api/Postions/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/Postions/:id', () => {
    it('should update leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name       : "siusdk",
            defaultDay :2
        };

        await RequestPostion(PostionApp)
            .patch(`/api/Postions/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestPostion
                console.log('Error during PATCH /api/Postions/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /Postions', () => {
    it('should create new leave allocation', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Postion data
        const Postion = {
            name       :"gfdgd",
            defaultDay :2
        };

        await RequestPostion(PostionApp)
            .post('/api/Postions') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(Postion)
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
                // Handle errors from Supertest RequestPostion
                console.log('Error during POST /api/Postions:', err.message);
                throw err;
            });
    });
});

describe('DELETE /Postions/:id', () => {
    it('should delete leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestPostion(PostionApp)
            .delete(`/api/Postions/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestPostion
                console.log('Error during DELETE /api/Postions/:id:', err.message);
                throw err;
            });
    });
});
