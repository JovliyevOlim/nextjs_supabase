import {createClient} from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = "https://xrsbwonctwaoidtzhvcm.supabase.co"
const supabaseAnonKey = 'sb_publishable_wAlSj3ki1SlZzqiC5tYawQ_DjQoKpvg'

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Xato: .env faylida Supabase kalitlari topilmadi!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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