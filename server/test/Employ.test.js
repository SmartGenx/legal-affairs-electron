const RequestEmploy = require('supertest'); // Import supertest
const employApp = require('../index'); // Rename the app variable

describe('GET /employs', () => {
    it('should return all employs', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestEmploy(employApp)
            .get('/api/employs') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestEmploy
                console.log('Error during GET /api/employs:', err.message);
                throw err;
            });
    });
});

describe('GET /api/employs/:id', () => {
    it('should return an employ by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestEmploy(employApp)
            .get(`/api/employs/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestEmploy
                console.log('Error during GET /api/employs/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/employs/:id', () => {
    it('should update an employ by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name: 'Updated Employ Name', // Example of what might be updated
            position: 'Updated Position',
            salary: 5500.00
        };

        await RequestEmploy(employApp)
            .patch(`/api/employs/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestEmploy
                console.log('Error during PATCH /api/employs/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/employs', () => {
    it('should create a new employ', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Employ data
        const employ = {
            name: 'John Doe',
            reference: 'EMP123456',
            phone: '1234567890',
            address: '123 Main St',
            dob: new Date('1990-01-01'),
            education: 'Bachelor\'s Degree',
            megor: 1, // Assuming 1 represents a valid enum value
            graduationDate: new Date('2012-05-15'),
            idtype: 2, // Assuming 2 represents a valid enum value
            idNumber: 'A1234567',
            issuerDate: new Date('2012-06-01'),
            issuerPlace: 'City Office',
            empLeaved: 'No',
            empDgree: 3, // Assuming 3 represents a valid degree
            position: 'Software Engineer',
            salary: 5000.00,
            firstEmployment: 'Yes',
            employmentDate: new Date('2013-07-01'),
            currentUnit: 1,
            currentEmploymentDate: new Date('2013-07-01'),
            legalStatus: 1, // Assuming 1 represents a valid enum value
            employeeStatus: 1, // Assuming 1 represents a valid enum value
            detailsDate: new Date('2023-01-01')
        };

        await RequestEmploy(employApp)
            .post('/api/employs') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(employ)
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
                // Handle errors from Supertest RequestEmploy
                console.log('Error during POST /api/employs:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/employs/:id', () => {
    it('should delete an employ by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestEmploy(employApp)
            .delete(`/api/employs/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestEmploy
                console.log('Error during DELETE /api/employs/:id:', err.message);
                throw err;
            });
    });
});
