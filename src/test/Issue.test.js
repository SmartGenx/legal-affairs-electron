const RequestIssue = require('supertest'); // Import supertest
const issueApp = require('../index'); // Rename the app variable

describe('GET /issues', () => {
    it('should return all issues', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssue(issueApp)
            .get('/api/issues') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestIssue
                console.log('Error during GET /api/issues:', err.message);
                throw err;
            });
    });
});

describe('GET /api/issues/:id', () => {
    it('should return issue by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssue(issueApp)
            .get(`/api/issues/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssue
                console.log('Error during GET /api/issues/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/issues/:id', () => {
    it('should update issue by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            name: 'Updated Issue Name', // Example of what might be updated
            title: 'Updated Issue Title',
            type: 2, // Example of updating type
        };

        await RequestIssue(issueApp)
            .patch(`/api/issues/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssue
                console.log('Error during PATCH /api/issues/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /issues', () => {
    it('should create a new issue', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample Issue data
        const issue = {
            name: 'New Issue',
            postionId: 1, // Assuming this is a valid position ID
            governmentOfficeId: 2, // Assuming this is a valid government office ID
            title: 'Issue Title',
            type: 1, // Assuming this is a valid type
            invitationType: 3, // Assuming this is a valid invitation type
        };

        await RequestIssue(issueApp)
            .post('/api/issues') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(issue)
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
                // Handle errors from Supertest RequestIssue
                console.log('Error during POST /api/issues:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/issues/:id', () => {
    it('should delete an issue by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssue(issueApp)
            .delete(`/api/issues/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssue
                console.log('Error during DELETE /api/issues/:id:', err.message);
                throw err;
            });
    });
});
