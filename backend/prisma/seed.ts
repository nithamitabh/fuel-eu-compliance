// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.route.deleteMany();

  // Seed 5 sample routes
  const routes = await prisma.route.createMany({
    data: [
      {
        vessel_type: 'Container Ship',
        fuel_type: 'HFO',
        year: 2024,
        ghg_intensity: 91.5,
        fuel_consumption: 120.5,
        distance: 5000,
        total_emissions: 11025.75,
        is_baseline: true,
      },
      {
        vessel_type: 'Container Ship',
        fuel_type: 'LNG',
        year: 2025,
        ghg_intensity: 82.3,
        fuel_consumption: 115.0,
        distance: 5000,
        total_emissions: 9464.5,
        is_baseline: false,
      },
      {
        vessel_type: 'Tanker',
        fuel_type: 'VLSFO',
        year: 2025,
        ghg_intensity: 88.7,
        fuel_consumption: 95.2,
        distance: 4200,
        total_emissions: 8443.24,
        is_baseline: false,
      },
      {
        vessel_type: 'Bulk Carrier',
        fuel_type: 'MDO',
        year: 2025,
        ghg_intensity: 85.1,
        fuel_consumption: 78.5,
        distance: 3500,
        total_emissions: 6680.35,
        is_baseline: false,
      },
      {
        vessel_type: 'RoRo',
        fuel_type: 'Methanol',
        year: 2025,
        ghg_intensity: 75.2,
        fuel_consumption: 65.3,
        distance: 2800,
        total_emissions: 4910.56,
        is_baseline: false,
      },
    ],
  });

  console.log(`Created ${routes.count} routes`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
