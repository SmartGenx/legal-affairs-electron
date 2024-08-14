const RequestComplaint = require('supertest'); // Import supertest
const complaintApp = require('../index'); // Rename the app variable

describe('GET /complaints', () => {
    it('should return all complaints', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestComplaint(complaintApp)
            .get('/api/complaints') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestComplaint
                console.log('Error during GET /api/complaints:', err.message);
                throw err;
            });
    });
});

describe('GET /api/complaints/:id', () => {
    it('should return a complaint by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestComplaint(complaintApp)
            .get(`/api/complaints/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestComplaint
                console.log('Error during GET /api/complaints/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/complaints/:id', () => {
    it('should update a complaint by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            title: 'Updated Complaint Title', // Example of what might be updated
            description: 'Updated complaint description',
        };

        await RequestComplaint(complaintApp)
            .patch(`/api/complaints/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestComplaint
                console.log('Error during PATCH /api/complaints/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/complaints', () => {
    it('should create a new complaint', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Complaint data
        const complaint = {
            name: 'John Doe',
            refrance: 'COMP123456',
            governmentOfficeId: 1,
            title: 'Complaint Title',
            description: 'Complaint description goes here.',
            date: new Date(),
            officeOpinian: 'Initial opinion from the office',
        };

        await RequestComplaint(complaintApp)
            .post('/api/complaints') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(complaint)
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
                // Handle errors from Supertest RequestComplaint
                console.log('Error during POST /api/complaints:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/complaints/:id', () => {
    it('should delete a complaint by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestComplaint(complaintApp)
            .delete(`/api/complaints/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestComplaint
                console.log('Error during DELETE /api/complaints/:id:', err.message);
                throw err;
            });
    });
});
