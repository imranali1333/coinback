import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import prisma from '../utilities/prismaclient';

dotenv.config({ path: path.join(__dirname, '../.variables.env') });

interface Admin {
  email: string;
  password: string;
  name: string;
  surname: string;
  removed?: boolean;
  enabled?: boolean;
  createdAt?: Date;
  isLoggedIn?: boolean;
}

const admins: Admin[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'admins.json'), 'utf-8'));

async function loadData() {
  try {
    await prisma.admin.createMany({ data: admins });
    console.log('👍 Done!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error →! The Error info is below but if you are importing sample data make sure to drop the existing database first.\n');
    console.error(e);
    process.exit();
  }
}

loadData();
