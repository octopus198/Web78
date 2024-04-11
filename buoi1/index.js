import http from 'http';
import users from './data.js';
import url from 'url';
function generateRandomUser() {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const randomAge = Math.floor(Math.random() * 80) + 1;
    const randomUserName = `user_${randomId}`;
    const randomEmail = `user${randomId}@example.com`;
    const randomAddress = `${randomId} Random St, Random City`;
    
    return {
        id: randomId,
        userName: randomUserName,
        email: randomEmail,
        address: randomAddress,
        age: randomAge,
    };
}

const app = http.createServer((request, response) => {
    const { query } = url.parse(request.url, true);
    const endpoint = request.url
    const method = request.method
    switch(endpoint) {
        case '/':
            response.end(`Hello`);
            break;
        case '/users':
            if (method === "GET") {
                response.end(JSON.stringify(users));
            }
            break;
        case '/users/old':
            if (method === "GET") {
                const oldUsers = users.filter(user => user.age >= 50);
                response.end(JSON.stringify(oldUsers));
            }
            break;
        case '/users/add-random':
            if (method === "GET") {
                const newUser = generateRandomUser();
                users.push(newUser);
                response.end(JSON.stringify(users));
            }
            break;
        case '/users/add': 
            if (method === "GET") {
                const { userName, email, address, age } = query;
                const newUser = {
                    id: generateRandomUser().id,
                    userName: userName || '',
                    email: email || '',
                    address: address || '',
                    age: parseInt(age) || 0,
                };
                users.push(newUser);
                response.end(JSON.stringify(newUser));
            }
            break;
        default:
            response.end(`Error, not found API`);
            break;
    }
});

app.listen(4000, () => {
    console.log('Server is running');
})