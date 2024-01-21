# GodAraden 的后端项目模板

**使用前请修改 package.json 文件中的*项目名称*与*版本号***

## Github Workflow

本模板通过 Github Workflow 实现 持续部署（CD），使用模板前请先在 Github 仓库 - Settings - Secerts and variables - Actions 中添加 私密变量：

```bash
SERVER_SSH_KEY # ssh 密钥对中的私钥
REMOTE_HOST # 服务器主机 ip
DATABASE_ENV # 【若启用数据库】数据库配置信息，格式见下
```

而后修改 `.github/workflows/main.yml` 文件中下列几条配置：

```yaml
env:
  TARGET_DIR: /www/wwwroot/ # 打包好的项目目录上传位置
  PROJECT_DIR: template-fe.araden.top # 打包好的项目目录要改成的名字
```

如果有将密钥之类的信息写入 local 文件的需求，请在 `.github/workflows/main.yml` 文件中自行添加

## 启用数据库

项目中使用 Prisma 作为 ORM 框架，相关命令已经在 package.json 中给出：

```json
{
  // ...
  "scripts": {
    // ...
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio --browser chrome"
  }
}
```

要安装 Prisma 到项目中，执行以下命令：

```bash
pnpm add prisma -S
pnpm dlx prisma init
```

执行上述命令之后，项目中会生成 `.env` 文件和 `prisma/` 文件夹，按照实际情况修改：

修改 .env 文件中的数据库连接信息：

```bash
# DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
DATABASE_URL="mysql://root:123456@localhost:3306/mydb"
```

将 prisma / schema.prisma 文件中的 provider 部分修改为 mysql：

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

安装 client：

```bash
pnpm add -D @prisma/client
```

而后将代码中与 Prisma 相关的代码取消注释，即可正常开始使用 Prisma

## 权限系统

本项目通过自定义元信息，配合自定义守卫可以实现 Method 级或者 Controller 级的权限控制，代码详见 `src/common/permission/`，使用方式：

```typescript
import { RolesGuard } from 'src/common/permission/roles.guard';
import { Roles } from 'src/common/permission/roles.decorator';

@Controller('controller')
@UseGuards(RolesGuard) // 权限守卫
export class SomeController {
  @Roles(Role.admin) // 定义何种角色能够访问此方法
  method() {}
}
```

目前项目中定义的角色仅有 `admin` 一种，相关代码详见 `src/global.d.ts`

## API 响应格式处理

项目 API 响应统一使用下面的格式：

```typescript
interface CustomResponse<T> {
  data: T;
  message: string;
  status: number;
}
```

处理格式相关代码在 `src/common/response` 文件夹下：

- httpException.filter.ts：处理正常请求的响应
- response.interceptor.ts 处理发生一般异常的请求的响应
- prismaException.filter.ts 处理发生 Prisma 异常的请求的响应

## 自定义日志记录

项目使用自定义中间件进行日志输出，相关逻辑在 `src/common/logger.middleware.ts`，可以根据业务需求自行修改

日志记录中间件已经默认集成到项目中，如需关闭请修改 `src/main.ts`

## 请求格式校验

项目使用自定义管道配合 `class-validator` 与 `class-transformer` 库进行格式校验，使用方式：

```typescript
import { MethodDto } from './dto/method.dto'; // 使用 class-validator 中装饰器修饰属性后的类，可以起到校验功能
import { ValidationPipe } from './common/validate.pipe';

@Controller()
export class SomeController {
  @Post('method')
  method(@Body(ValidationPipe) methodDto: MethodDto) {}
}
```
