# **Scriptalium**

## **Overview**

This project is a monorepo containing a frontend application built with **Next.js** and a backend built with **Django**. It serves as a starting point for developing a complete web application with a clear separation between the frontend and the backend.

---

## **Project Structure**

![Project Structure Diagram](https://i.goopics.net/4hckgo.png)

---

## **Prerequisites**

### **Frontend:**

- Node.js (version 14 or higher)
- npm

### **Backend:**

- Python 3.x
- pip
- PostgreSQL 16.4

---

## **Installation Instructions**

### **Frontend**

**1. Navigate to the `frontend` directory:**

    cd frontend


**2. Install dependencies:**

    npm install

**3. Configure environment variables:**

    - Create a `.env.local` file in the `frontend` folder and add the necessary variables.

**4.Run the development server:**

    npm run dev

    The frontend is now accessible at [http://localhost:3000/](http://localhost:3000/).

---

### **Backend**

**1. Navigate to the `backend` directory:**

    cd backend

**2. Create and activate a virtual environment:**

    - On **Windows**:

        python -m venv env
        env\Scripts\activate

    - On **macOS/Linux**:

        python3 -m venv env
        source env/bin/activate


**3. Install dependencies**:

  
    pip install -r requirements.txt


---

## **Set up the PostgreSQL database**

- Ensure **PostgreSQL 16.4** is installed and running.

### Create a new PostgreSQL database and user

#### Using pgAdmin 4

**1. Create a new database:**

- Open pgAdmin 4 and connect to your PostgreSQL server.
- Right-click on Databases and select Create > Database....
- Enter a name for your database (e.g., `mydatabase`) and click Save.

**2. Create a new user with a password:**
- Right-click on **Login/Group Roles** and select **Create** > **Login/Group Role...**.
- Enter a username (e.g., `myuser`) and set a password in the **Definition** tab.
- In the **Privileges** tab, set **Can login?** to **Yes**.
- Click **Save**.

**3. Grant privileges to the user:**
- Right-click on your database and select **Properties**.
- Go to the **Privileges** tab.
- Click the **Add** button, select your user, and check all privileges.
- Click **Save**.

#### Using the command-line

**1. Run the following command to access PostgreSQL:**


    psql -U postgres


**2. Then, execute the following SQL commands:**

    CREATE DATABASE mydatabase;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
    \q


---

### **Configure environment variables**

- Create a `.env` file in the `backend` folder with the following content:

    ```ini
    SECRET_KEY=your_secret_key
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1

    DB_NAME=mydatabase
    DB_USER=myuser
    DB_PASSWORD=mypassword
    DB_HOST=localhost
    DB_PORT=5432
    ```

    - Replace `your_secret_key` with a secret key for your Django application.
    - Replace `mydatabase`, `myuser`, and `mypassword` with your PostgreSQL database name, user, and password.

---

## **Apply migrations and create a superuser**

**1. Apply migrations:**

    python manage.py migrate

**2. Create a superuser:**

    
    python manage.py createsuperuser

    - Follow the prompts to create an admin user.

**3. Run the development server:**


    python manage.py runserver

    The backend is now accessible at [http://localhost:8000/](http://localhost:8000/).

---

## **Usage**

- **Frontend:**

    Start the development server:

    ```bash
    cd frontend
    npm run dev
    ```

    Access the app at [http://localhost:3000/](http://localhost:3000/).

- **Backend:**

    Start the development server:

    ```bash
    cd backend
    python manage.py runserver
    ```

    Access the API at [http://localhost:8000/](http://localhost:8000/).

---

## **Environment Variables Configuration**

- **Backend:** Environment variables are stored in the `.env` file located in the `backend` folder.
- **Frontend:** Environment variables are stored in the `.env.local` file located in the `frontend` folder.

**Note:** Never share your `.env` files in a public repository, as they may contain sensitive information.

---

## **Database Setup**

**PostgreSQL 16.4** is used as the database for this project.

**1. Install PostgreSQL:**

- Download the installer from the official website: [PostgreSQL Downloads](https://www.postgresql.org/download/)
- Follow the installation instructions for your operating system.

**2. Create a Database and User:**

- Using pgAdmin 4:

- Follow the steps provided in the [Backend Installation](#backend) section.

**Using the Command-Line Interface:**


    psql -U postgres


Then execute the following SQL commands:

    CREATE DATABASE mydatabase;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
    \q


**3. Configure Django to Use PostgreSQL:**

- Update the `DATABASES` setting in `backend/myproject/settings.py`:


        from decouple import config

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config('DB_NAME'),
                'USER': config('DB_USER'),
                'PASSWORD': config('DB_PASSWORD'),
                'HOST': config('DB_HOST', default='localhost'),
                'PORT': config('DB_PORT', default='5432'),
            }
        }

**4. Apply Migrations and Create a Superuser:**

    python manage.py migrate
    python manage.py createsuperuser

