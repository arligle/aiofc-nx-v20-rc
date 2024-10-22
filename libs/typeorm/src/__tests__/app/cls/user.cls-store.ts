import { TenantClsStore } from '@aiokit/persistence-api';

export interface UserAndTenantClsStore extends TenantClsStore {
  userId: string;
}
