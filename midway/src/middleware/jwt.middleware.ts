// import { Inject, Middleware, Options } from '@midwayjs/decorator';
// import { HttpCode, Inject, Middleware } from '@midwayjs/decorator';
import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';

@Middleware()
export class JwtMiddleware {

  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      console.log("打印头部信息: ", ctx.header);
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError();
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');

      if (parts.length === 2) {
        const scheme = parts[0];
        const token = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          try {
            //jwt.verify方法验证token是否有效
            await this.jwtService.verify(token, {
              complete: true
            });
          } catch (error) {
            //token无效或者过期，生成新的token
            const newToken = getToken();
            //将新token放入Authorization中返回给前端
            ctx.set('Authorization', newToken);
            console.log("新Token: ", newToken);
            const result = await next();
            return result;
          }
        }
      }
    }
  }

  static getName(): string {
    return 'jwt';
  }
}

function getToken() {
  // this.app.useMiddleware([JwtMiddleware]);
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
}