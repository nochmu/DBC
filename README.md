#node-dbc 
DBC(Database Connector) is an abstraction layer for database drivers.  

## Project goals

### One API to rule them all. 

### Simple to use 
```
# Hello World: 
Line 1: Load the driver 
Line 2: Connect to the database
Line 3: send Hello-World-Query to the database
Line 4: use ResultSet
=> max. 4 lines 

Line 6: send next query
Line 7: use ResultSet
=> max 2 lines per query
```

### Easy to extend
A new driver can be created with a minimum of work. But then, you can optimize the driver by implementing additional functions. 







#Drivers
## Plain Text
```$xslt
READ LINES(5) --> returns line 5 of text
READ LINES(5,+3) -> returns lines 5,6,7,8
READ LINES(5,8)  -> returns lines 5,6,7,8
WRITE LINES(5) VALUES("Hallo World!") 
```

## JSON
```$xslt
...
```

## SQL
