# Rhoda Lubalin Fellowship
### for graphic designers entering their senior year at The Cooper Union

# Intro
This project uses:
[Erin Sparling's Cooper Union CRUD Database Interface as a base](https://glitch.com/edit/#!/cooper-union-sqlite-json-storage): 
The CRUD Database uses SQLite.

The project also uses:
Passportjs to log in

## Ethos






# Login

Logging in can be accessed through the /login endpoint, and prompts the user to log in with credentials, once authenticated, this allows the active user to quickly edit the database entries via a user interface. The login information is stored in express-sessions and uses browser cookies to continue sessions.

You may change the username and passwords needed by editing the .env

## Code Sources and Hosts
This project is hosted and the code is viewable and open source on Glitch:
https://rhoda-lubalin-fellowship.glitch.me/

The code can be viewed and remixed at: https://glitch.com/edit/#!/rhoda-lubalin-fellowship

Of course, you can also clone [this GitHub Repo](https://github.com/yure-r/XHTML-Final) to make open source changes, to make fun of any other institution or organizaiton of your choice

## Notes
The Username and Password attributes are stored in the .env, if you'd like to change the login information, update the .env.