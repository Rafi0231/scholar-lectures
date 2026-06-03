- When Creating a data base, if a default is off, leave it as off, and always put a sensitive password in an ".env" file, and make sure it is a ".env*" inside a .gitignore file
If we run git satatus, the .env file shouldn't print anything
To check if the secret is safe, the terminal will print "Reload env: .env" and when we print git status, the .env should NOT print
We use an ORM (Object Relational Mapper) which bridges the database with the actual coding langage

@id - primary key
userId - foreign key
@unique - makes sure whatever the object is, that there's no duplicates
String vs String?; String? is nullable, and can be changed if needed
onDelete; if the user is deleted, delete the account