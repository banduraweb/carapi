import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}
  async create(reportDto: CreateReportDto, user: User) {
    const report = await this.reportRepository.create(reportDto);
    report.user = user;
    return await this.reportRepository.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.reportRepository.save(report);
  }
  async getEstimate(query: GetEstimateDto) {
    return (
      this.reportRepository
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        // .select('*')
        .where('make = :make', { make: query.make })
        .andWhere('model = :model', { model: query.model })
        .andWhere('lon - :lon BETWEEN -5 AND 5', { lon: query.lon })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: query.lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year: query.year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage: query.mileage })
        .limit(3)
        .getRawOne()
    );
  }
}
