import {createClient} from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Supabase keys are missing in .env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function importData() {
  try {
    const invoicesData = JSON.parse(fs.readFileSync('./src/data/invoices.json', 'utf8'));
    console.log(`Importing ${invoicesData.length} invoice rows...`);

    const {error: invoiceError} = await supabase.from('invoices').insert(invoicesData);
    if (invoiceError) {
      throw invoiceError;
    }
    console.log('Invoices imported successfully.');

    const ordersData = JSON.parse(fs.readFileSync('./src/data/orders.json', 'utf8'));
    console.log(`Importing ${ordersData.length} order rows...`);

    const {error: orderError} = await supabase.from('orders').insert(ordersData);
    if (orderError) {
      throw orderError;
    }
    console.log('Orders imported successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Import failed:', message);
  }
}

void importData();
