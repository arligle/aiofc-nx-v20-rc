import { bootstrapBaseWebApp } from '@aiokit/bootstrap';
import { AppModule } from './app/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

// 初始化事务上下文
initializeTransactionalContext();

void bootstrapBaseWebApp(AppModule);
