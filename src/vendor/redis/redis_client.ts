import { createClient } from 'redis';

//eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81

export class RedisClient {
  public async redisClientSetwWithExpire(
    key: string,
    value: string,
    expireTime: number
  ) {
    const client = createClient({
      url: 'redis://localhost:6379',
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    });
    client.on('error', (err) => console.error('Redis Error on: ' + err));
    await client.connect();

    await client.setEx(key, expireTime, value);
    await client.disconnect();
  }

  public async redisClientGet(value: string) {
    const client = createClient({
      url: 'redis:localhost:6379',
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    });
    client.on('error', (err) => console.error('Redis Error On: ' + err));
    await client.connect();

    const dbValue = await client.get(value);
    await client.disconnect();
    return dbValue;
  }

  public async redisDelete(key: string) {
    const client = createClient({
      url: 'redis:localhost:6379',
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    });
    client.on('error', (err) => console.error('Redis Error On: ' + err));
    await client.connect();

    await client.del(key);
  }
}
