# API DataBase

### Today we have to connect SQLite database to our previously created API.

- Using the library [sqlite for NodeJS](https://www.npmjs.com/package/sqlite) connect the database.
- Create the "todo" table in the database.
- Move existing data into the database.
- Write, read, delete and update operations should be implemented using the database.

* * `Notice that you can use Express.`

#### For those who are not familiar with SQLite, here are some queries that you can use:
- 'CREATE TABLE IF NOT EXISTS todo (title TEXT UNIQUE, content TEXT, id INTEGER NOT NULL PRIMARY KEY)'
- \`INSERT INTO todo(title, content) values(${title}, ${content})\`
- 'UPDATE todo SET title=?, content=? WHERE id=?' (You can create query using the template string or like that, both are ok)
- 'SELECT * FROM todo'
- 'SELECT title, content, id FROM todo WHERE id=?' or \`SELECT title, content, id FROM todo WHERE id=${id}\`
- 'DELETE FROM todo WHERE id=?'

[SQLite docs](https://www.sqlite.org/index.html)
[DB management tool](https://dbeaver.io/download/)