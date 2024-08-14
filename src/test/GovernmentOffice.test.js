const RequestGovernmentOffice = require('supertest'); // Import supertest
const governmentOfficeApp = require('../index'); // Rename the app variable

describe('GET /government-offices', () => {
    it('should return all government offices', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGovernmentOffice(governmentOfficeApp)
            .get('/api/government-offices') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestGovernmentOffice
                console.log('Error during GET /api/government-offices:', err.message);
                throw err;
            });
    });
});

describe('GET /api/government-offices/:id', () => {
    it('should return a government office by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGovernmentOffice(governmentOfficeApp)
            .get(`/api/government-offices/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGovernmentOffice
                console.log('Error during GET /api/government-offices/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/government-offices/:id', () => {
    it('should update a government office by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name: 'Updated Government Office Name', // Example of what might be updated
        };

        await RequestGovernmentOffice(governmentOfficeApp)
            .patch(`/api/government-offices/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGovernmentOffice
                console.log('Error during PATCH /api/government-offices/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/government-offices', () => {
    it('should create a new government office', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample GovernmentOffice data
        const governmentOffice = {
            name: 'New Government Office',
        };

        await RequestGovernmentOffice(governmentOfficeApp)
            .post('/api/government-offices') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(governmentOffice)
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
                // Handle errors from Supertest RequestGovernmentOffice
                console.log('Error during POST /api/government-offices:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/government-offices/:id', () => {
    it('should delete a government office by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestGovernmentOffice(governmentOfficeApp)
            .delete(`/api/government-offices/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestGovernmentOffice
                console.log('Error during DELETE /api/government-offices/:id:', err.message);
                throw err;
            });
    });
});
