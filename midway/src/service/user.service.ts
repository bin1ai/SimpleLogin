import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import { UserModel } from '../model/user.model';

@Provide()
export class UserService {
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  async getUserByUsernameAndPassword(username: string, password: string) {
    const user = new UserModel;
    const dbUser = user.getUserByUsernameAndPassword(username, password);
    return dbUser;
  }
}
