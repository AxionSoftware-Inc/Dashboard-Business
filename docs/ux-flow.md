# Business Dashboard UX And Workflows

## Product Principle

Business Dashboard kichik biznes egasiga buxgalteriya tilida emas, tadbirkor tilida javob berishi kerak:

- Bugun qancha tushum bo'ldi?
- Sof foyda qancha?
- Pul qayerga ketdi?
- Kim qarz?
- Omborda nima kam qoldi?

Har bir sahifa bitta aniq ishni bajaradi. User qaysi joyda ekanini, keyin nima qilishini va yozgan ma'lumoti qayerga ta'sir qilishini ko'rishi kerak.

## Route Map

### Public

- `/`
  - Marketing landing page.
  - User mahsulot nima ekanini ko'radi.
  - Primary action: `Bepul boshlash`.
  - Secondary action: `Mening dashboardim`.

### Setup And App

- `/dashboard?setup=1`
  - Majburiy setup mode.
  - Active business tozalanadi.
  - Onboarding ochiladi.

- `/dashboard`
  - Agar active business bor bo'lsa dashboard ochiladi.
  - Agar active business yo'q bo'lsa onboarding ochiladi.

### Internal App Pages

- `/products`
  - Active business mahsulotlari va ombori.
  - Product create, search, low-stock filter, delete.

- `/transactions`
  - Active business kirim-chiqim jurnali.
  - Transaction create, search, type filter, delete.

- `/debts`
  - Active business qarz daftari.
  - Debt create, search, direction filter, close, delete.

- `/reports`
  - Active business summary hisobotlari.
  - Revenue, expenses, profit estimate, open debts.

- `/settings`
  - Active business profil sozlamalari.
  - Hozir read-only. Keyingi bosqichda update qo'shiladi.

## First-Time User Flow

1. User `/` landing pagega kiradi.
2. Landing page quyidagilarni ko'rsatadi:
   - mahsulot nomi
   - asosiy qiymat
   - dashboard preview
   - features: kirim-chiqim, sof foyda, ombor, qarzlar
3. User `Boshlash` yoki `Bepul boshlash` bosadi.
4. Browser `/dashboard?setup=1` ga o'tadi.
5. App active business ID ni localStorage'dan o'chiradi.
6. URL `/dashboard`ga tozalanadi.
7. Onboarding ochiladi.
8. User biznes ma'lumotlarini kiritadi:
   - biznes nomi
   - mas'ul yoki egasi
9. User template tanlaydi:
   - Minimarket
   - Kafe
   - Servis
   - Ulgurji savdo
10. User boshlang'ich kassa va to'lov turlarini tanlaydi.
11. User `Dashboardni ochish` bosadi.
12. Frontend `POST /api/businesses/` chaqiradi.
13. Backend business yaratadi.
14. Frontend business ID ni `business-dashboard-active-business-id` sifatida localStorage'ga yozadi.
15. Frontend shu business uchun dashboard data yuklaydi.
16. User dashboardni ko'radi.

Expected result: template tanlangandan va onboarding tugagandan keyin user albatta dashboard ko'rishi kerak.

## Returning User Flow

1. User `/dashboard` ga kiradi.
2. Frontend localStorage'dan `business-dashboard-active-business-id` o'qiydi.
3. Agar ID mavjud bo'lsa:
   - `GET /api/businesses/{id}/`
   - business topilsa dashboard data yuklanadi
4. Agar ID yo'q yoki backend businessni topmasa:
   - localStorage tozalanadi
   - onboarding ochiladi

## Active Business Rule

Butun app faqat bitta active business bilan ishlaydi.

Active business quyidagilarda ishlatiladi:

- dashboard summary
- transactions
- products
- debts
- reports
- settings

Hech qaysi ichki sahifa backenddagi "birinchi biznes"ni avtomatik tanlamasligi kerak. Faqat active business ID ishlatiladi.

## Template Rules

Template tanlovi birinchi konfiguratsiya vazifasini bajaradi.

### Minimarket

Primary modules:

- Savdo
- Ombor
- Qarzlar
- Kassa

Default shortcuts:

- Savdo qo'shish
- Ombor kirimi
- Qarz yopish
- Xarajat yozish

### Kafe

Primary modules:

- Menu
- Xarajat
- Foyda
- Yetkazuvchi

Default shortcuts:

- Kunlik savdo
- Ingredient xarajati
- Yetkazuvchi to'lovi
- Menu tannarxi

### Servis

Primary modules:

- Buyurtma
- Usta
- Detal
- To'lov

Default shortcuts:

- Buyurtma ochish
- Ehtiyot qism xarajati
- Usta ulushi
- Mijoz to'lovi

### Ulgurji Savdo

Primary modules:

- Narx list
- Mijozlar
- Ombor
- Hisobot

Default shortcuts:

- Ulgurji savdo
- Mijoz qarzi
- Ombor kirimi
- Narx yangilash

Current implementation: template key businessda saqlanadi va dashboard template card/active modules sifatida ko'rinadi. Next implementation: template shortcutlar va kategoriya defaultlari ham shu key bo'yicha o'zgaradi.

## Dashboard Workflow

Dashboard userga birinchi holatni beradi.

Data sources:

- `GET /api/businesses/{id}/`
- `GET /api/reports/dashboard/summary/?business={id}`
- `GET /api/transactions/?business={id}`
- `GET /api/products/?business={id}`
- `GET /api/debts/?business={id}`

Dashboard blocks:

1. Template cards
   - current template ko'rinadi
   - keyingi bosqichda template switch business update qiladi
2. KPI cards
   - tushum
   - sof foyda
   - xarajat
   - olinadigan qarz
3. Kirim-chiqim jurnali
   - recent transactions
   - search/filter
4. Foyda formulasi
   - tushum
   - tannarx
   - xarajat
   - sof foyda
5. Ombor nazorati
   - products
   - low stock signal
6. Right sidebar
   - bugungi xulosa
   - tezkor amallar
   - qarz daftari
   - hisobot signallari

## Operation Create Workflow

1. User `Operatsiya` yoki mobile `Qo'shish` bosadi.
2. Drawer ochiladi.
3. User type tanlaydi:
   - Savdo
   - Kirim
   - Chiqim
   - Qarz
   - Ombor
4. User nom, summa, to'lov turi, bog'lash va izoh kiritadi.
5. Drawer preview ko'rsatadi:
   - summa
   - qaysi bo'limga ulanadi
   - foyda/kassa ta'siri
6. User `Saqlash` bosadi.
7. Frontend `POST /api/transactions/` qiladi.
8. Backend transaction yaratadi.
9. Frontend jurnalga yangi transaction qo'shadi.
10. Summary qayta yuklanadi.
11. Toast chiqadi.

## Products Workflow

Route: `/products`

Purpose: omborni boshqarish.

Actions:

- product create
- product search
- low stock filter
- product delete

Data:

- `GET /api/products/?business={id}`
- `POST /api/products/`
- `DELETE /api/products/{id}/`

Next improvements:

- product edit
- stock movement
- import from Excel
- category filters

## Transactions Workflow

Route: `/transactions`

Purpose: barcha pul harakatlarini ko'rish va boshqarish.

Actions:

- transaction create
- search
- type filter
- transaction delete

Data:

- `GET /api/transactions/?business={id}`
- `POST /api/transactions/`
- `DELETE /api/transactions/{id}/`

Next improvements:

- date range
- payment method filter
- export
- transaction edit

## Debts Workflow

Route: `/debts`

Purpose: qarzlarni nazorat qilish.

Actions:

- debt create
- search
- receivable/payable filter
- close debt
- delete debt

Data:

- `GET /api/debts/?business={id}`
- `POST /api/debts/`
- `PATCH /api/debts/{id}/`
- `DELETE /api/debts/{id}/`

Next improvements:

- partial payment
- due date reminders
- Telegram/SMS reminder

## Reports Workflow

Route: `/reports`

Purpose: rahbar uchun umumiy xulosa.

Data:

- `GET /api/reports/dashboard/summary/?business={id}`

Current report cards:

- tushum
- xarajat
- taxminiy foyda
- ochiq qarzlar

Next improvements:

- date range
- category profit
- top products
- cash/bank split

## Settings Workflow

Route: `/settings`

Purpose: active business konfiguratsiyasi.

Current:

- business name
- owner name
- template
- currency
- payment methods

Next improvements:

- edit business profile
- switch business
- create another business
- re-enable auth

## Empty And Error States

### Backend unavailable

Show message:

`Backend API bilan aloqa bo'lmadi. Server ishlayotganini tekshiring.`

### No active business on internal pages

Show `Avval biznes turini tanlang`.

Primary action: `/dashboard?setup=1`.

### Empty products

Show first product prompt.

### Empty transactions

Show first transaction prompt.

### Empty debts

Show debt explanation and create form.

## Test Mode

Auth hozir majburiy emas.

Reason: product flow va CRUD test qilish oson bo'lishi kerak.

When production auth returns:

1. Login/register UI qo'shiladi.
2. JWT token storage qo'shiladi.
3. Backend default permission `IsAuthenticated` bo'ladi.
4. All queries owner scoped bo'ladi.
5. Active business user businesses ichidan tanlanadi.
