
const supertestRequest = require('supertest'); // Import supertest
const bookOrderApp = require('../index'); // Rename the bookOrderApp variable
describe('GET /book-order', () => {
    it('should return all book-orders', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await supertestRequest(bookOrderApp)
            .get('/api/book-order') // Adjust the endpoint if necessary
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
                // Handle errors from Supertest supertestRequest
                console.log('Error during GET /api/book-order:', err.message);
                throw err;
            });
    });
});

describe('GET /api/book-order/:id', () => {
    it('should return a book-order by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await supertestRequest(bookOrderApp)
            .get(`/api/book-order/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest supertestRequest
                console.log('Error during GET /api/BookOrder/:id:', err.message);
                throw err;
            });
    });
});

describe('PATCH /api/book-order/:id', () => {
    it('should update a book-order by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';
        const updateData = {
            quantity: 5, // Example of what might be updated
            description: 'Updated order description',
        };

        await supertestRequest(bookOrderApp)
            .patch(`/api/book-order/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest supertestRequest
                console.log('Error during PATCH /api/book-order/:id:', err.message);
                throw err;
            });
    });
});

describe('POST /api/book-order', () => {
    it('should create a new book-order', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        // Sample BookOrder data
        const bookOrder = {
            bookId: 1,
            quantity: 2,
            customerId: 3,
            reference: 'ORD123456',
            description: 'Order for customer 3',
            sellingDate: new Date(),
            orderNumber: 7890,
        };

        await supertestRequest(bookOrderApp)
            .post('/api/book-order') // Adjust the endpoint if necessary
            .set('Authorization', `Bearer ${validJwtToken}`) // Set the Authorization header
            .send(bookOrder)
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
                // Handle errors from Supertest supertestRequest
                console.log('Error during POST /api/book-order:', err.message);
                throw err;
            });
    });
});

describe('DELETE /api/book-order/:id', () => {
    it('should delete a book-order by ID', async () => {
        // Mock a valid JWT token (adjust according to your authentication logic)
        const validJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNjE3MDc4LCJleHAiOjE3MjQyMjE4Nzh9.LtvKMUW-LwseInysv8jt_NqKiQOZXV4rJeRclxgDjtY';

        await supertestRequest(bookOrderApp)
            .delete(`/api/book-order/1`) // Adjust the ID to include a real ID
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
                // Handle errors from Supertest supertestRequest
                console.log('Error during DELETE /api/book-order/:id:', err.message);
                throw err;
            });
    });
});
