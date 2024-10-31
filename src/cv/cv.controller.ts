import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCvDto } from './dto/create-cv.dto';
import { createCvModel } from './helpers/createCvModel';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('preview')
  @UseInterceptors(FileInterceptor('photo'))
  async preview(
    @Body() body: CreateCvDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const html = await this.cvService.getPreviewHtml(
      createCvModel(body.cvData),
      file,
    );
    return html;
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() body: CreateCvDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ fileId: string }> {
    const data = createCvModel(body.cvData);
    const fileId = await this.cvService.create(file, body.cvData, data);
    return { fileId };
  }

  @Get('/:id/download')
  async downloadFile(@Param('id') id: string) {
    return this.cvService.getFileFromFS(id, 'downloadedTestPdf');
  }
}
