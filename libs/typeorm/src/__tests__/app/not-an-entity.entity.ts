import { ClsPreset } from '../../lib/subscribers/decorator/cls-preset.decorator';
import { TenantClsStore } from '@aiokit/persistence-api';

/**
 * Test adding cls preset decorator to a class that is not an entity
 * */
export class NotAnEntity {
  @ClsPreset<TenantClsStore>({
    clsFieldName: 'tenantId',
  })
  id!: string;
}
