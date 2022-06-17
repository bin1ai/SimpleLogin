import { AppDataSource } from "./data-source"
import { UserEntity } from "./entity/user.entity"

AppDataSource.initialize().then(async () => {
    console.log("插入一条记录到数据库...");
    const user = new UserEntity();
    user.username = "jack";
    user.password = "redballoon";

    await AppDataSource.manager.save(user);
    console.log("已经插入数据的用户id是: " + user.id);

    console.log("从数据库加载用户数据...");
    const users = await AppDataSource.manager.find(UserEntity);
    console.log("已经加载的用户: ", users);
}).catch(error => console.log(error))