declare const process: any;
import { seedSupabaseDatabase } from './lib/seed';

seedSupabaseDatabase().then(() => {
  console.log('Seeding finished.');
  process.exit(0);
}).catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

