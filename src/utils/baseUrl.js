const baseUrl = process.env.NODE_ENV === "production" 
    ? 'https://waterfall-server.herokuapp.com'
    : 'http://127.0.0.1:4001';

export default baseUrl;