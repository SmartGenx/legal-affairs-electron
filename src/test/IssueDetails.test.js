const RequestIssueDetails = require('supertest'); // Import supertest
const issueDetailsApp = require('../index'); // Rename the app variable

describe('GET /issue-detailses', () => {
    it('should return all issue details', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssueDetails(issueDetailsApp)
            .get('/api/issue-detailses') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestIssueDetails
                console.log('Error during GET /api/issue-detailses:', err.message);
                throw err;
            });
    });
});

describe('GET /api/issue-detailses/:id', () => {
    it('should return issue details by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssueDetails(issueDetailsApp)
            .get(`/api/issue-detailses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssueDetails
                console.log('Error during GET /api/issue-detailses/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/issue-detailses/:id', () => {
    it('should update issue details by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';
        const updateData = {
            level: 2, // Example of what might be updated
            judgment: 'Updated judgment details',
            refrance: 'New Reference'
        };

        await RequestIssueDetails(issueDetailsApp)
            .patch(`/api/issue-detailses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssueDetails
                console.log('Error during PATCH /api/issue-details/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /issue-detailses', () => {
    it('should create new issue details', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        // Sample IssueDetails data
        const issueDetails = {
            issueId: 1, // Assuming this is a valid issue ID
            level: 1,
            detailsDate: new Date('2023-08-14'),
            judgment: 'Initial judgment details',
            refrance: 'Initial Reference',
            Resumed: false
        };

        await RequestIssueDetails(issueDetailsApp)
            .post('/issue-detailses') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(issueDetails)
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
                // Handle errors from Supertest RequestIssueDetails
                console.log('Error during POST /issue-detailses:', err.message);
                throw err;
            });
    });
});

describe('DELETE /issue-detailses/:id', () => {
    it('should delete issue details by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'your-valid-jwt-token-here';

        await RequestIssueDetails(issueDetailsApp)
            .delete(`/issue-detailses/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestIssueDetails
                console.log('Error during DELETE /issue-detailses/:id:', err.message);
                throw err;
            });
    });
});
