const RequestLeaveType = require('supertest'); // Import supertest
const LeaveTypeApp = require('../index'); // Rename the app variable

describe('GET /LeaveTypes', () => {
    it('should return all leave allocations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveType(LeaveTypeApp)
            .get('/api/LeaveTypes') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestLeaveType
                console.log('Error during GET /api/LeaveTypes:', err.message);
                throw err;
            });
    });
});

describe('GET /api/LeaveTypes/:id', () => {
    it('should return leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveType(LeaveTypeApp)
            .get(`/api/LeaveTypes/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveType
                console.log('Error during GET /api/LeaveTypes/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/LeaveTypes/:id', () => {
    it('should update leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name       : "siusdk",
            defaultDay :2
        };

        await RequestLeaveType(LeaveTypeApp)
            .patch(`/api/LeaveTypes/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveType
                console.log('Error during PATCH /api/LeaveTypes/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /LeaveTypes', () => {
    it('should create new leave allocation', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample LeaveType data
        const LeaveType = {
            name       :"gfdgd",
            defaultDay :2
        };

        await RequestLeaveType(LeaveTypeApp)
            .post('/api/LeaveTypes') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(LeaveType)
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
                // Handle errors from Supertest RequestLeaveType
                console.log('Error during POST /api/LeaveTypes:', err.message);
                throw err;
            });
    });
});

describe('DELETE /LeaveTypes/:id', () => {
    it('should delete leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestLeaveType(LeaveTypeApp)
            .delete(`/api/LeaveTypes/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestLeaveType
                console.log('Error during DELETE /api/LeaveTypes/:id:', err.message);
                throw err;
            });
    });
});
