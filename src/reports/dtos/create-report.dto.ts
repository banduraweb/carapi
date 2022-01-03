import {
  IsString,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  price: number;
  @IsString()
  model: string;
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;
  @IsLatitude()
  lon: number;
  @IsLongitude()
  lat: number;
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;
  @IsString()
  make: string;
}
