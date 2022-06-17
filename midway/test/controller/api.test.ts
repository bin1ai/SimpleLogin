import { createApp, close, createHttpRequest, mockHeader } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

const assert = require('assert');

const fn = async x => {
  return new Promise(resolve => {
    setTimeout(resolve, 3000, 2 * x);
  });
};

describe('test/controller/api.test.ts', () => {
  // it('should POST /api/get_user', async () => {
  //   // create app
  //   const app = await createApp<Framework>();

  //   // make request
  //   const result = await createHttpRequest(app).get('/api/get_user').query({ uid: 123 });

  //   // use expect by jest
  //   expect(result.status).toBe(200);
  //   expect(result.body.message).toBe('OK');

  //   // close app
  //   await close(app);
  // });

  // 正常登录测试
  it('should POST /api/user/login', async () => {
    console.log(' 正常登录测试...');
    // 数据库还在初始化，等待3秒
    await fn(3);

    // create app
    const app = await createApp<Framework>();

    mockHeader(app, 'authorization', 'Bearer 8E2FEB9C16A74257ADE9CA8E9E327EB2');

    // make request
    const result = await createHttpRequest(app)
      .post('/api/user/login')
      .send({ username: 'jack', password: 'redballoon' });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('登录成功');

    // close app
    await close(app);
  });

  // 异常登录测试
  it('should POST /api/user/login', async () => {
    const startTime = Date.now();

    console.log(' 异常登录测试...');

    // create app
    const app = await createApp<Framework>();

    mockHeader(app, 'authorization', 'Bearer 8E2FEB9C16A74257ADE9CA8E9E327EB2');

    // make request
    const result = await createHttpRequest(app)
      .post('/api/user/login')
      .send({ username: 'jack83993', password: 'redballoon' });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('登录成功');

    const interval = Date.now() - startTime;
    if (interval > 1000) {
      // 请求时间超过1秒
      it(`期望超时值：${interval}`, function () {
        assert.strictEqual(interval, 1000);
      });
    } else {
      // 请求时间小于等于1秒
      if (result.status != 200) {
        console.log('接口返回值格式不正确');
        assert.string(result.body.message);
      }
    }

    // close app
    await close(app);
  });

});
