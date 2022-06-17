import { Inject, Controller, Get, Query, Body, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { UserLoginDTO } from '../dto/user.dto';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { ReportMiddleware } from '../middleware/report.middleware';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUserById(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }

  @Post('/user/login', { middleware: [ReportMiddleware, JwtMiddleware] })
  @Validate()
  async getUserByDTO(@Body() userLogin: UserLoginDTO) {
    const username = userLogin.username;
    const password = userLogin.password;

    const user = await this.userService.getUserByUsernameAndPassword(
      username, password
    );

    if (user.id == 0) {
      return {
        code: 400,
        result: "error",
        message: "账号或密码不正确",
        data: null
      }
    } else {
      const responseHeader = this.ctx.response.header;
      const authorization = responseHeader.authorization;
      return {
        code: 200,
        result: "success",
        message: "登录成功",
        data: {
          token: authorization,
        }
      }
    }
  }
}
