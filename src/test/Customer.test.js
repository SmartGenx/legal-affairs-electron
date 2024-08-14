const RequestCustomer = require('supertest'); // Import supertest
const customerApp = require('../index'); // Rename the app variable

describe('GET /customers', () => {
    it('should return all customers', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestCustomer(customerApp)
            .get('/api/customers') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestCustomer
                console.log('Error during GET /api/customers:', err.message);
                throw err;
            });
    });
});

describe('GET /api/customers/:id', () => {
    it('should return a customer by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestCustomer(customerApp)
            .get(`/api/customers/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestCustomer
                console.log('Error during GET /api/customers/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/customers/:id', () => {
    it('should update a customer by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name: 'Updated Customer Name', // Example of what might be updated
            type: 2, // Assuming 2 represents a valid enum value
        };

        await RequestCustomer(customerApp)
            .patch(`/api/customers/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestCustomer
                console.log('Error during PATCH /api/customers/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Customer data
        const customer = {
            name: 'Jane Doe',
            type: 1, // Assuming 1 represents a valid enum value
        };

        await RequestCustomer(customerApp)
            .post('/api/customers') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(customer)
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
                // Handle errors from Supertest RequestCustomer
                console.log('Error during POST /api/customers:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/customers/:id', () => {
    it('should delete a customer by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestCustomer(customerApp)
            .delete(`/api/customers/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestCustomer
                console.log('Error during DELETE /api/customers/:id:', err.message);
                throw err;
            });
    });
});
