import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MovieSeeder } from '../database/seeders/movie.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(MovieSeeder);

  const command = process.argv[2];
  const pages = parseInt(process.argv[3]) || 5;

  try {
    switch (command) {
      case 'seed':
        console.log(`Seeding ${pages} page(s) of movies...`);
        await seeder.seed(pages);
        break;
      case 'clear':
        console.log('Clearing all movies...');
        await seeder.clear();
        break;
      case 'reseed':
        console.log('Clearing and reseeding movies...');
        await seeder.clear();
        await seeder.seed(pages);
        break;
      default:
        console.log('Usage:');
        console.log('  npm run seed          - Seed 5 pages of movies');
        console.log('  npm run seed [pages]  - Seed specified number of pages');
        console.log('  npm run seed:clear    - Clear all movies');
        console.log('  npm run seed:reseed   - Clear and reseed movies');
    }
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

void bootstrap();
