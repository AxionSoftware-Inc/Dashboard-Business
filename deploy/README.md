# Production checklist

## Nginx and HTTPS

1. Copy `deploy/nginx-dashboard-business.conf` to `/etc/nginx/sites-available/dashboard-business`.
2. Replace `example.com` with the real domain.
3. Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/dashboard-business /etc/nginx/sites-enabled/dashboard-business
sudo nginx -t
sudo systemctl reload nginx
```

4. Add HTTPS:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

After this, expose only ports `80` and `443` publicly. Keep Next.js `3003` and Django `8000` behind nginx.

## PostgreSQL backup

Run once to test:

```bash
chmod +x deploy/backup-postgres.sh
PGPASSWORD=root ./deploy/backup-postgres.sh
```

Cron example for daily backup at 02:30:

```cron
30 2 * * * DATABASE_NAME=business DATABASE_USER=postgres PGPASSWORD=root /home/legion/Dashboard-Business/deploy/backup-postgres.sh >> /home/legion/backups/dashboard-business/backup.log 2>&1
```

Restore example:

```bash
pg_restore --clean --if-exists --dbname=business --username=postgres /home/legion/backups/dashboard-business/business-YYYYMMDD-HHMMSS.dump
```
