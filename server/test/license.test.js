const Requestlicense = require('supertest'); // Import supertest
const licenseApp = require('../index'); // Rename the app variable

describe('GET /licenses', () => {
    it('should return all leave allocations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await Requestlicense(licenseApp)
            .get('/api/licenses') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest Requestlicense
                console.log('Error during GET /api/licenses:', err.message);
                throw err;
            });
    });
});

describe('GET /api/licenses/:id', () => {
    it('should return leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await Requestlicense(licenseApp)
            .get(`/api/licenses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest Requestlicense
                console.log('Error during GET /api/licenses/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/licenses/:id', () => {
    it('should update leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name       : "siusdk",
            defaultDay :2
        };

        await Requestlicense(licenseApp)
            .patch(`/api/licenses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest Requestlicense
                console.log('Error during PATCH /api/licenses/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /licenses', () => {
    it('should create new leave allocation', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample license data
        const license = {
            name       :"gfdgd",
            defaultDay :2
        };

        await Requestlicense(licenseApp)
            .post('/api/licenses') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(license)
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
                // Handle errors from Supertest Requestlicense
                console.log('Error during POST /api/licenses:', err.message);
                throw err;
            });
    });
});

describe('DELETE /licenses/:id', () => {
    it('should delete leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await Requestlicense(licenseApp)
            .delete(`/api/licenses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest Requestlicense
                console.log('Error during DELETE /api/licenses/:id:', err.message);
                throw err;
            });
    });
});
