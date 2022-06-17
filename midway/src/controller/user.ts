import { Controller, Get } from '@midwayjs/decorator';

@Controller('/user')
export class HomeController {
  @Get('/user')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
