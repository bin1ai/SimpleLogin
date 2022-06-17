// 用户model

import { attachClassMetadata } from "@midwayjs/decorator";
import { isNull } from "@midwayjs/decorator/dist/util";
// import { stringify } from "querystring";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entity/user.entity";

export const ORM_MODEL_KEY = '__orm_model_key__';

export class UserModel {
  @InjectEntityModel(UserEntity)
  userRepo: Repository<UserEntity>;

  /**
   * 根据用户名和密码获取用户信息
   * @param username {String} 用户名
   * @param password {String} 用户密码
   */
  async getUserByUsernameAndPassword(username: string, password: string): Promise<UserEntity> {
    // 将不存在的用户id定义为0
    const noUser = new UserEntity();
    noUser.id = 0;
    noUser.username = "";
    noUser.password = "";

    const validUser = await AppDataSource.manager.getRepository(UserEntity)
    .createQueryBuilder("user_entity")
    .where("user_entity.username = :stringUser and user_entity.password = :stringPass",
    {stringUser: username, stringPass: password})
    .getOne();

    console.log("数据查询结果: ", validUser);

    if (isNull(validUser)) {
      return noUser;
    } else {
      return validUser;
    }
  }
}

// 在类中使用@InjectEntityModel装饰器将Repository实例注入到属性
export function InjectEntityModel(
  modelKey?: any,
  connectionName = 'default'
): PropertyDecorator {
  return (target, propertyKey) => {
    // 将元数据添加到类上, 这里的类即使用了此装饰器的类
    // 后续的registerDataHandler逻辑会使用此元数据来实例化Repository
    attachClassMetadata(
      ORM_MODEL_KEY,
      {
        key: {
          modelKey,
          connectionName,
        },
        propertyName: propertyKey,
      },
      target
    );
  };
}