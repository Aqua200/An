import got from 'got';

const stringify = obj => JSON.stringify(obj, null, 2);
const parse = str => JSON.parse(str, (_, v) => {
    if (
        v !== null &&
        typeof v === 'object' &&
        'type' in v &&
        v.type === 'Buffer' &&
        'data' in v &&
        Array.isArray(v.data)
    ) {
        return Buffer.from(v.data);
    }
    return v;
});

class CloudDBAdapter {
    constructor(url, {
        serialize = stringify,
        deserialize = parse,
        fetchOptions = {}
    } = {}) {
        this.url = url;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.fetchOptions = fetchOptions;
    }

    async read() {
        try {
            let res = await got(this.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;q=0.9,text/plain'
                },
                ...this.fetchOptions
            });
            if (res.statusCode !== 200) throw new Error(res.statusMessage);
            return this.deserialize(res.body);
        } catch (e) {
            console.error('Error reading from cloud DB:', e);
            return null;
        }
    }

    async write(obj) {
        try {
            let res = await got(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                ...this.fetchOptions,
                body: this.serialize(obj)
            });
            if (res.statusCode !== 200) throw new Error(res.statusMessage);
            return res.body;
        } catch (e) {
            console.error('Error writing to cloud DB:', e);
            return null;
        }
    }
}

export default CloudDBAdapter;
