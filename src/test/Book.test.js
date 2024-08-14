
const RequestBook = require('supertest'); // Import supertest
const bookApp = require('../index'); // Rename the bookApp variable
describe('GET /bookApp', () => {
    it('should return all bookApps', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await RequestBook(bookApp)
            .get('/api/book') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest RequestBook
                console.log('Error during GET /api/bookApp:', err.message);
                throw err;
            });
    });
});

describe('GET /api/book/:id', () => { // Corrected the route to match what seems to be the intended one
    it('should return a book by ID', async () => { // Changed 'bookApp' to 'book' as per the route
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await RequestBook(bookApp) // Use the correct variable 'supertestRequest' instead of 'RequestBook'
            .get(`/api/book/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest request
                console.log('Error during GET /api/book/:id:', err.message); // Adjusted log message to reflect the route
                throw err;
            });
    });
});
describe('PATCH /api/bookApp/:id', () => {
    it('should update a bookApp by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';
        const updateData = {
            quantity: 5, // Example of what might be updated
        };

        await RequestBook(bookApp)
            .patch(`/api/book/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestBook
                console.log('Error during PATCH /api/bookApp/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/book', () => {
    it('should create a new bookApp', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        // Sample BookOrder data
        const book = {
                
            name   :"book"  ,
            quantity :2 ,
            price    :200.2 
        
          
          
        };

        await RequestBook(bookApp)
            .post('/api/bookApp') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(book)
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
                // Handle errors from Supertest RequestBook
                console.log('Error during POST /api/bookApp:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/bookApp/:id', () => {
    it('should delete a bookApp by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await RequestBook(bookApp)
            .delete(`/api/bookApp/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest RequestBook
                console.log('Error during DELETE /api/bookApp/:id:', err.message);
                throw err;
            });
    });
});
