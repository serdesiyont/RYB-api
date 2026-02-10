import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CampusService } from '../campus/campus.service';
import * as fs from 'fs';
import * as path from 'path';

interface UniversityData {
  name: string;
  address: {
    city: string;
    region: string;
    zone: string;
  };
  description: string;
}

async function seedUniversities() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const campusService = app.get(CampusService);

  try {
    // Read universities data from JSON file
    const universitiesPath = path.join(__dirname, '../../universities.json');
    const fileContent = fs.readFileSync(universitiesPath, 'utf-8');
    const universitiesData = JSON.parse(fileContent) as UniversityData[];

    console.log(`Found ${universitiesData.length} universities to seed`);

    let successCount = 0;
    let errorCount = 0;

    // Seed each university
    for (const university of universitiesData) {
      try {
        await campusService.create({
          name: university.name,
          address: university.address.city,
          description: university.description,
        });

        successCount++;
        console.log(`✓ Added: ${university.name}`);
      } catch (error) {
        errorCount++;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ Failed to add ${university.name}:`, errorMessage);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Total universities: ${universitiesData.length}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seedUniversities()
  .then(() => {
    console.log('\nSeeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
