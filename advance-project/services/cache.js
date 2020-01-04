const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');


const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

// Override exec function
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    // Generate unique key
    const key = JSON.stringify(
        Object.assign({},
            this.getQuery(), {
                collection: this.mongooseCollection.name
            }
        )
    );

    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        // Return model instance
        const docs = JSON.parse(cacheValue);
        return Array.isArray(docs) ? docs.map(d => new this.model(d)) : new this.model(docs);
    }

    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
}

//Custom cache function
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}