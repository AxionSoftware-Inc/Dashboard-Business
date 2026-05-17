# Business Dashboard Backend

DRF backend for the small business dashboard.

## Local Setup

```powershell
cd D:\Programming\business_dashboard
backend\.venv\Scripts\python.exe backend\manage.py migrate
backend\.venv\Scripts\python.exe backend\manage.py seed_demo
backend\.venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000
```

Default local database settings are in `backend/.env.example`:

- database: `business`
- user: `postgres`
- password: `root`

## API

All business data endpoints require JWT auth. Use:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

- `GET /api/businesses/`
- `GET /api/products/?business=1`
- `GET /api/transactions/?business=1`
- `GET /api/debts/?business=1`
- `GET /api/reports/dashboard/summary/?business=1`

## Checks

```powershell
backend\.venv\Scripts\python.exe backend\manage.py test businesses catalog operations
backend\.venv\Scripts\python.exe backend\manage.py check
```
