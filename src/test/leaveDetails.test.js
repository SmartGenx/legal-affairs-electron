const RequestleaveDetails = require('supertest'); // Import supertest
const leaveDetailsApp = require('../index'); // Rename the app variable

describe('GET /leaveDetailss', () => {
    it('should return all leave allocations', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestleaveDetails(leaveDetailsApp)
            .get('/api/leaveDetailss') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestleaveDetails
                console.log('Error during GET /api/leaveDetailss:', err.message);
                throw err;
            });
    });
});

describe('GET /api/leaveDetailss/:id', () => {
    it('should return leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestleaveDetails(leaveDetailsApp)
            .get(`/api/leaveDetailss/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestleaveDetails
                console.log('Error during GET /api/leaveDetailss/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/leaveDetailss/:id', () => {
    it('should update leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            remaingDay: 10, // Example of what might be updated
            leaveYear: 2024,
        };

        await RequestleaveDetails(leaveDetailsApp)
            .patch(`/api/leaveDetailss/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestleaveDetails
                console.log('Error during PATCH /api/leaveDetailss/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /leaveDetailss', () => {
    it('should create new leave allocation', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample leaveDetails data
        const leaveDetails = {
            employeeeId :1,
            leaveTypeId :1,
            dayNumber   :1,
            startDate   :new Date(),
            endDate     :new Date(),
            leaveNote   :"hfdoihfoih",
        };

        await RequestleaveDetails(leaveDetailsApp)
            .post('/api/leaveDetailss') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(leaveDetails)
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
                // Handle errors from Supertest RequestleaveDetails
                console.log('Error during POST /api/leaveDetailss:', err.message);
                throw err;
            });
    });
});

describe('DELETE /leaveDetailss/:id', () => {
    it('should delete leave allocation by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestleaveDetails(leaveDetailsApp)
            .delete(`/api/leaveDetailss/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestleaveDetails
                console.log('Error during DELETE /api/leaveDetailss/:id:', err.message);
                throw err;
            });
    });
});
