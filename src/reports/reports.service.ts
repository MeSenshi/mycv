import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportEntity } from "./report.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../users/user.entity";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(ReportEntity) private repo: Repository<ReportEntity>) {
  }

  create(body: CreateReportDto, user: UserEntity) {
    const report = this.repo.create(body);
    report.user = user;
    return this.repo.save(report);
  }

  getReport(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async approveReport(id: string, approve: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException("No Report Found");
    }

    report.approved = approve;
    return this.repo.save(report);
  }

  getEstimate(estimateDto: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select("AVG(price)", "price")
      .where("make=:make", { make: estimateDto.make })
      .andWhere("model=:model", { model: estimateDto.model })
      .andWhere("lng-:lng BETWEEN -5 AND 5", { lng: estimateDto.lng })
      .andWhere("lat-:lat BETWEEN -5 AND 5", { lat: estimateDto.lat })
      .andWhere("year-:year BETWEEN -3 AND 3", { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy("ABS(mileage-:mileage)", "DESC")
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }

}
