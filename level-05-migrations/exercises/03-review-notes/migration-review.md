1. What does each migration do?
    - Migration applies the schema to the database.
2. Did Prisma generate any risky operations?
    - No, it did not as I migrated safely by adding a column that is nullable at first, backfilling it, then only making it required in the last migration.
3. What could lock/slow down production?
    - One example the could lock/slow down a production database as altering a column, like changing its type or making it not null.
4. What would your rollback/recovery plan be?
    - My rollback/recovery plan would be creating a forward-fix migration in which I will create a migration that will fix the issue. Like when I accidentally made email nullable instead of required, I would backfill it and create a new migration that will make it required.