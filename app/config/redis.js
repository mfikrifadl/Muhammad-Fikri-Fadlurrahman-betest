const RedisClient = require("ioredis");

const RedisCon = RedisClient.createClient({
  host: "redis-18821.c265.us-east-1-2.ec2.cloud.redislabs.com",
  port: 18821,
  username: "",
  password: "8Zto3XJIBhAnlVxJdwzU0O41tTapQ1Uc",
});

function get(redis_key) {
  return new Promise((resolve) => {
    RedisCon.get(redis_key, (err, reply) => {
      if (err) console.log(err);
      resolve({ reply });
    });
  });
}

function set(redis_key, redis_value) {
  console.log("Success set redis");
  RedisCon.set(redis_key, redis_value);
}

module.exports.get = get;
module.exports.set = set;
