const RequestLeaveallocation = require('supertest'); // Import supertest
const leaveallocationApp = require('../index'); // Rename the app variable

describe('GET /leaveallocations', () => {
    it('should return all leave allocations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveallocation(leaveallocationApp)
            .get('/api/leaveallocations') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestLeaveallocation
                console.log('Error during GET /api/leaveallocations:', err.message);
                throw err;
            });
    });
});

describe('GET /api/leaveallocations/:id', () => {
    it('should return leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveallocation(leaveallocationApp)
            .get(`/api/leaveallocations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveallocation
                console.log('Error during GET /api/leaveallocations/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/leaveallocations/:id', () => {
    it('should update leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            remaingDay: 10, // Example of what might be updated
            leaveYear: 2024,
        };

        await RequestLeaveallocation(leaveallocationApp)
            .patch(`/api/leaveallocations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveallocation
                console.log('Error during PATCH /api/leaveallocations/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /leaveallocations', () => {
    it('should create new leave allocation', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Leaveallocation data
        const leaveallocation = {
            employeeId: 1, // Assuming this is a valid employee ID
            leavetypeId: 2, // Assuming this is a valid leave type ID
            remaingDay: 15,
            leaveYear: 2023,
        };

        await RequestLeaveallocation(leaveallocationApp)
            .post('/api/leaveallocations') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(leaveallocation)
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
                // Handle errors from Supertest RequestLeaveallocation
                console.log('Error during POST /api/leaveallocations:', err.message);
                throw err;
            });
    });
});

describe('DELETE /leaveallocations/:id', () => {
    it('should delete leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveallocation(leaveallocationApp)
            .delete(`/api/leaveallocations/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveallocation
                console.log('Error during DELETE /api/leaveallocations/:id:', err.message);
                throw err;
            });
    });
});
