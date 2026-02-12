import {createClient} from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';


dotenv.config({path: '.env'});
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Xato: .env faylida Supabase kalitlari topilmadi!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function importData() {
    try {
        const invoicesData = JSON.parse(fs.readFileSync('./src/data/invoices.json', 'utf8'));
        console.log(`${invoicesData.length} ta invoice yuklanmoqda...`);

        const {error: invError} = await supabase.from('invoices').insert(invoicesData);
        if (invError) throw invError;
        console.log("Invoices muvaffaqiyatli yuklandi!");

        const ordersData = JSON.parse(fs.readFileSync('./src/data/orders.json', 'utf8'));
        console.log(`${ordersData.length} ta order yuklanmoqda...`);

        const {error: ordError} = await supabase.from('orders').insert(ordersData);
        if (ordError) throw ordError;
        console.log("Orders muvaffaqiyatli yuklandi!");

    } catch (error) {
        console.error("Xatolik yuz berdi:", error.message);
    }
}

importData();