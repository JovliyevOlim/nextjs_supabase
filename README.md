## 🚀 Loyihani ishga tushirish (Step-by-Step)

Loyihani yangi (fresh) Supabase loyihasida ishga tushirish uchun quyidagi ketma-ketlikka amal qiling:

## 1. Supabase loyihasini tayyorlash

      Supabase Dashboard orqali yangi loyiha oching.

Loyihaning URL, Anon Key va Service Role Key ma'lumotlarini nusxalab oling.

## 2. Muhit o'zgaruvchilarini sozlash

Loyiha ildiz papkasida .env faylidagi ma'lumotlarni o'zingizniki bilan almashtiring:

NEXT_PUBLIC_SUPABASE_URL=https://sizning-loyiha-id.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sizning-anon-public-key

SUPABASE_SERVICE_ROLE_KEY=sizning-service-role-key # Ma'lumotlarni import qilish uchun shart

## 3. Kutubxonalarni o'rnatish

Terminalda quyidagi buyruqni bering:

```bash
npm install
```

## 4. Ma'lumotlar bazasini sozlash (Yagona buyruq)

Jadvallarni yaratish va JSON ma'lumotlarni bazaga yuklash uchun quyidagi avtomatlashtirilgan buyruqni bering:

```bash
npm run db:setup
```

Bu buyruq ketma-ket ikkita ishni bajaradi:

db:push: supabase/migrations ichidagi SQL fayllar orqali jadvallar va RLS qoidalarini bazada quradi.

db:seed: import-data.js skriptini ishga tushirib, ./src/data/*.json fayllaridagi ma'lumotlarni bazaga yuklaydi.

## 5. Loyihani yurgizish

Barcha sozlamalar tugagach, loyihani mahalliy serverda ishga tushiring:

```bash
npm run dev
```

Endi brauzerda http://localhost:3000 manziliga kiring.

## 📂 Loyiha tuzilishi

supabase/migrations/ — Bazani noldan qurish uchun SQL skriptlar.

src/data/ — Loyiha uchun test JSON ma'lumotlari.

src/components/grid/ — Asosiy AGGridTable komponenti.

import-data.js — Ma'lumotlarni bazaga yuklovchi avtomatlashtirilgan script.