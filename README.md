# Cascella Music Club (CMC)

Self-hosted site for hosting a Music Club 

## Architecture

The application consists of a [React](https://react.dev/) front-end, built using [Vite](https://vite.dev/), that interfaces with a Python [Connexion](https://connexion.readthedocs.io/en/latest/) based Rest API backend.
The Rest API interacts with a separately hosted [MariaDB](https://mariadb.com/) database which must be manually configured beforehand.

## Setup

The most straight-forward way to setup is to follow these below section in order

### Database Creation

Stage a MariaDB instance that is accessible from where the Rest API backend will be hosted. For the currently active version, the database is running on a RaspberryPi.

Once MariaDB is installed a database should be created to store all CMC related data. A user should also be created with appropriate permissions within the newly created database - the REST API will connect to the database as this user to perform the necessary operations.

While connected to the RPi via SSH, run `sudo mariadb` to access the SQL console and perform the following commands:

Create database:
```sql
  CREATE DATABASE your_database_name;
```

Create user:
```sql
  CREATE USER 'your_username'@'%' IDENTIFIED BY 'your_password';
```

Grant permissions:
```sql
  GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'%';
```

Make permissions effective immediately:
```sql
  FLUSH PRIVILEGES;
```

To test that this worked attempt to login using the following:

```bash
  mariadb -u your_username -p your_database_name
```
After entering your password, should receive access to the console with a `MariaDB [(your_database_name)]` prompt.

### Rest API Installation

When the Rest API is started, it initially attempts to connect to the database and creates the necessary tables if they do not exist. Therefore, the next step is to install and run the Rest API once to generate the empty tables in the database:

Clone the repository in your desired location as follows:

```bash
  git clone https://github.com/johnentrieri/cascella-music-club.git
```

After extracting/cloning, create a virtual environment within this folder:

```bash
  python3 -m venv .venv
```

Establish environment variables for database connection in one of several ways:
 - (current implementation) Create a `.env` file within the server directory.
 - Manually add the variables in the droplet's `/etc/environment`

Environment Variables required:
```bash
DB_HOST='localhost'
DB_PORT=3306
DB_USER='your_username'
DB_PASSWORD='your_password'
DB_DBNAME='your_database_name'
```

Install the Python dependencies within the virtual environment:
```bash
  .venv/bin/python3 -m pip install -r requirements.txt
```

Run server.py
```bash
.venv/bin/python3 server.py
```

By default the REST API runs on Port 4000. If not blocked by the [Firewall](#firewall-configuration), then the Swagger UI should be accessible by navigating to *http://raspberry_pi_ip:4000/ui*.

Another indicator the server is running successfully is that the tables within the database should have been created. Login to the MariaDB instance:
```bash
  mariadb -u your_username -p your_database_name
```

Show all tables:
```sql
  SHOW TABLES;
```

Output should appear similiar to the below:
```
+----------------+
| Tables_in_db   |
+----------------+
| draft_results  |
| draft_settings |
| event_results  |
| events         |
| marbles        |
| marbleteams    |
| teams          |
| users          |
+----------------+
```

### Data Initialization

In it's current iteration, there is no way to initialize the first user within the database so it must be manually injected via a SQL command.

First login to the database using:
```bash
  mariadb -u your_username -p your_database_name
```

#### User Initialization

User Fields:
 - username: Site-wide Username 
 - email: Email Address (not currently utilized for anything)
 - password: Argon2 Password Hash (see [Password Hashing](#password-hashing))
 - is_admin: Flag to allow access to admin panel which allows adding of more users and creating of discussions.

 Example SQL Command:
 ```sql
  INSERT INTO users (username,email,password,is_admin) VALUES
    ('user1','user1@example.com','$argon2id$...',1);
 ```

 Can verify user was created by running:
 ```sql
  SELECT * FROM users;
 ```

### Rest API Quick Test

To confirm everything is in working order so fat, the Swagger UI can be used to test specific Rest API endpoints prior to getting the React frontend up and running - the Swagger UI should be accessible at *http://raspberry_pi_ip:4000/ui*.

### React Client Setup & Installation

React Client can be installed and run during development by running the below commands after navigating into the `cmc-client` directory.:

Install Required Dependencies ([NodeJS](https://nodejs.org/en) is required):
```bash
  npm install
```

Run in development mode:
```bash
  npm run dev
```

At this point the React Client should be running at http://localhost:5173

Logins & any other calls to the API will fail as the REST API URL needs to be configured. Recommendation is to have two files `.env.development.local` and `.env.production.local` and to specify the URL to the REST API as `VITE_CMC_API_URL` in each. Specifying each separately allows for development on a separate REST API than the production REST API. Vite automatically loads the correct environment variables based on whether `npm run dev` is used vs. `npm run build`. If deploying the server externally (See [React Application Auto-Deployment](#react-application-auto-deployment)), be sure to set environment variables up in the deployed environment.

Modifying this variable to the REST API's Address/Port (e.g. http://localhost:4000 or http://your_api_subdomain:4000) should correct this issue.

Use Developer Console and/or output within `server.log` to troubleshoot any remaining issues.

## Miscellaneous

### Firewall Configuration

Enable the uncomplicated firewall (ufw) to only allow SSH connections and HTTP/HTTPS connections:

Enable OpenSSH:
```bash
  sudo ufw allow OpenSSH
```

Enable Nginx HTTP & HTTPS:
```bash
  sudo ufw allow 'Nginx Full'
```

Enable the Firewall:
```bash
  sudo ufw enable
```

Check status:
```bash
  sudo ufw status verbose
```

For development purposes, to enable ports for other services:
```bash
  sudo ufw enable 4000/tcp
```

To delete any rules after development is complete:
```bash
  sudo ufw status numbered
  sudo ufw delete RULE_NUMBER
```

### Routine Updates / Maintenance

- [ ] MariaDB Security Updates
- [ ] Backup MariaDB Databases
- [ ] NPM Audit / Security Updates
- [ ] Log Checks & Cleanup

### Password Hashing

In the future, better methods to reset and handle initial passwords for each user - However, current iteration requires manual hashing of an initial password and manual injection of that hash into the database via SQL commands.

The simplest way to generate a Argon2 Password hash within this repository is to straight from the virtual environment's python interpreter:

Access the Python interpreter:
```bash
  ./server/.venv/bin/python3
```

Within the Python interpreter, first import the `argon2` library:
```python
  import argon2
```

Manually generate a hash for a plaintext password:
```python
  argon2.PasswordHasher().hash('your_password')
```

Output string generated should match the format: `'$argon2id$v=19$m=65536,t=3,p=4$daGlLY2oXSAde6H/B/iaFw$31NFCWtr4ZQrk6xryyKItyE267x74K+VOC6hYcFqLk8'`

This can be manually injected into the SQL database by logging into MariaDB:
```bash
  mariadb -u your_username -p your_database_name
```

Update the desired user's password within the database's users table:
```sql
  UPDATE users
  SET password = 'your_password_hash'
  WHERE username = 'your_username'; 
```
The user should now be able to login with the plaintext password that was used to generate the hash.

After this initial setup, the user has the ability to modify their password at any time using the Profile tab.

### Reverse Proxies

Whenever hosting locally, it is recommended to only port-forward the necessary HTTP/HTTPS ports (80/443) on the router side and use a reverse proxy to route traffic internally using subdomains.

This was done on the Raspberry Pi using the [steps within this guide](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)

The steps within the above guide can also be followed to enable HTTPS using Let's Encrypt.

### React Application Auto-Deployment

An App Platform (e.g. DigitalOcean) may be utilized and linked to a specific branch of this repository (e.g. `release`) so that any change to this repo will automatically rebuild (`npm run build`) and redeploy.

Development can then be done on a development branch (e.g. `dev`) using locally hosted, non-public facing servers - then pushed to `release` after extensive testing for automatic deployment.