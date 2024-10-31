import { Injectable, StreamableFile } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { ICvDataModel } from './models/cvData.model';
import * as process from 'process';
import * as puppeteer from 'puppeteer';
import { helpers } from './templates/helpers.js';

@Injectable()
export class CvService {
  readonly FILE_DIR = path.join(process.cwd(), 'src/cv-pdfs');

  private saveFile(file: Uint8Array, fileId: string): void {
    if (!fs.existsSync(this.FILE_DIR)) {
      fs.mkdirSync(this.FILE_DIR);
    }
    const filePath = path.join(this.FILE_DIR, fileId);
    fs.writeFileSync(`${filePath}.pdf`, file);
  }

  getFileFromFS(fileId: string, returnedFileName) {
    const filePath = `${this.FILE_DIR}/${fileId}.pdf`;
    if (!fs.existsSync(filePath)) {
      throw new Error(`No such file ${fileId}`);
    }
    const file = fs.createReadStream(filePath);
    return new StreamableFile(file, {
      type: 'application/pdf',
      disposition: `attachment; filename="${returnedFileName}.pdf"`,
    });
  }
  async getPreviewHtml(
    data: ICvDataModel,
    file: Express.Multer.File,
  ): Promise<string> {
    const dirPath = path.join(process.cwd(), 'src/cv/templates');
    const templatePath = path.resolve(dirPath, 'Rotterdam/tmp.ejs');

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file '${templatePath}' not found.`);
    }
    const photo = file?.size
      ? `data:image/jpeg;base64,${file.buffer.toString('base64')}`
      : '';
    return ejs.renderFile(templatePath, {
      data,
      photo,
      helpers,
    });
  }

  async htmlToPdf(data: ICvDataModel, file: Express.Multer.File) {
    const template = await this.getPreviewHtml(data, file);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
      ],
    });
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: 'networkidle0' });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
      },
    });
    await browser.close();
    return buffer;
  }

  async create(
    file: Express.Multer.File,
    jsonStr: string,
    data: ICvDataModel,
  ): Promise<string> {
    const buffer = await this.htmlToPdf(data, file);
    const fileId = 'testFile';
    this.saveFile(buffer, fileId);
    return fileId;
  }
}
