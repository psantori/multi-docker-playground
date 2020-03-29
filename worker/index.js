const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redistHost,
    port: keys.redistPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 2) + fib(index - 1);
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', parseInt(message, 10), fib(parseInt(message, 10)));
});

sub.subscribe('insert');