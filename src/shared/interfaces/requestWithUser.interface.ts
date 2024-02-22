import { Request } from 'express';
import { SiteUser } from 'src/modules/users/entities/site-user.entity';

export interface RequestWithUser extends Request {
  user: SiteUser;
}
