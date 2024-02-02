import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import * as process from "process";
import { UserEntity } from "./users/user.entity";
import { ReportEntity } from "./reports/report.entity";
const cookieSession = require("cookie-session");



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath : `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "sqlite",
          database: config.get<string>("DB_NAME"),
          entities: [UserEntity, ReportEntity],
          synchronize: config.get<boolean>('SYNCHRONIZE')
        };
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: "sqlite",
    //   database: "db.sqlite",
    //   entities: [UserEntity, ReportEntity],
    //   synchronize: true
    // }),
    UsersModule,
    ReportsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }]
})
export class AppModule {
  constructor(private configService: ConfigService) {
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes("*");
  }
}
