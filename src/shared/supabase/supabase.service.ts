import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID, UUID } from 'crypto';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  private bucket: any;

  constructor(private configService: ConfigService) {
    const { url, secretKey } = configService.get('supabase');

    this.supabaseClient = createClient(url, secretKey);
    this.supabaseClient.storage
      .getBucket('linkedin-clone-files')
      .then((res) => (this.bucket = res.data));
  }

  async uploadOneFile(file: Express.Multer.File, folder: string) {
    const { buffer, mimetype, originalname } = file;

    const finalPath = folder + '/' + randomUUID() + '-' + originalname;

    const {
      data: { path },
    } = await this.supabaseClient.storage
      .from(this.bucket.id)
      .upload(finalPath, buffer, { contentType: mimetype });

    const {
      data: { publicUrl },
    } = this.getPublicUrl(path);

    return { path, publicUrl };
  }

  getPublicUrl(filePath: string) {
    const result = this.supabaseClient.storage
      .from(this.bucket.id)
      .getPublicUrl(filePath);

    return result;
  }

  async deleteManyFiles(paths: string[]) {
    await this.supabaseClient.storage.from(this.bucket.id).remove(paths);
  }
}
