# Examiner

Welcome to Examiner – Your hub for effortless exam creation, giving, and grading.

## Table of Contents
- [Backend Setup](#backend-setup)
  - [Starting the Backend](#starting-the-backend)
  - [Environment Variables](#environment-variables-for-backend)
- [Client Setup](#client-setup)
  - [Starting the Client](#starting-the-client)
  - [Environment Variables](#environment-variables-for-client)
- [API Documentation](#api-documentation)

---

## Backend Setup

### Starting the Backend
To set up and run the backend, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node index.js
   ```

3. Create a `.env` file in the root of the backend project. Replace the placeholder values with the required information for deployment.

---

### Environment Variables for Backend
The `.env` file should include the following:

```env
# Example
DB_URL = "your_db_url_here"
PORT = <your_port_here>
SALT_ROUNDS = <for_hashing_salt_rounds>
JWT_SECRET = "Json_web_token_secret"
PUBLIC_FOLDER_PATH = "public_folder_path"
EXAMINER_USER = "for_reset_password_service_user"
EXAMINER_PASS = "for_reset_password_service_pass"
EXAMINER_MAIL = "for_reset_password_service_email"
MAIL_HOST = "mail_host_provider"
MAIL_PORT = <mail_port>
PAGE_SIZE = <for_paging_data>
```

Make sure to replace all with actual values.

---

## Client Setup

### Starting the Client
To set up and run the client, follow these steps:

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Create a `.env` file in the root of the client project. Replace the placeholder values with the required information.

---

### Environment Variables for Client
The `.env` file should include the following:

```env
# Example
REACT_APP_PUBLIC_URL = "Frontend_url"
REACT_APP_BACKEND_URL = "backend_url"
REACT_APP_PAGE_SIZE = <for_paging_data>
```

Replace the values with your actual configuration.

---

## API Documentation
For detailed API documentation, refer to the following link:

[Backend API Documentation](https://documenter.getpostman.com/view/27273594/2sAYHwKjyn)

---

Happy Coding! 🚀
