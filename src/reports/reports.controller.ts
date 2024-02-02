import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { UserEntity } from "../users/user.entity";
import { Serialize } from "../interceptors/serialize.interceptor";
import { ReportDto } from "./dtos/report.dto";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { AdminGuard } from "../guards/admin.guard";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Controller("reports")
export class ReportsController {

  constructor(private reportService: ReportsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: UserEntity) {
    return this.reportService.create(body, user);
  }

  @Get("/:id")
   getReport(@Param("id") id: string) {
    return  this.reportService.getReport(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param("id") id: string, @Body() body: ApproveReportDto){
    return this.reportService.approveReport(id, body.approve)
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto){

    return this.reportService.getEstimate(query)
  }
}
