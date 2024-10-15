import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidJSON } from '../validators/cvData.validator';

export class CreateCvDto {
  photo: File;

  @IsString()
  @IsNotEmpty()
  @IsValidJSON({
    message: 'cvData should be JSON',
  })
  cvData: string;
}
