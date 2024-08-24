## Database diagram (postgresql)

```database
DatabaseType: postgresql
ConnectionString: Host=localhost;Port=5432;Database=mydatabase;Username=user;Password=secret
Schema: public
Tables: 
  - Offers
  - Orders
  - Passes
Detail: keys
```

## Database diagram (mssql)

```database
DatabaseType: mssql
ConnectionString: Server=localhost,1433; Database=OrderManagementDb; User Id=sa; Password=yourStrong(!)Password;
Schema: dbo
Tables: 
  - OrderStates
  - OrderHeaders
  - OrderItems
  - StockItems
Detail: keys
```

## Database diagram (mysql)

```database
DatabaseType: mysql
ConnectionString: mysql://root:admin@localhost:3306
Schema: hospital_db
Detail: keys
```
