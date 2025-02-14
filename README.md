# semdin.com-blog-next.js

semdin.com-blog-next.js is a simple blog platform for my personal sharings.

## Features

- **User Authentication**: Secure login with NextAuth and Google OAuth.
- **Role Management**: Separate user roles for authors and admins.
- **Rich Text Editing**: Create and edit posts with a powerful md-editor-rt editor.
- **Responsive Design**: Optimized for all devices.
- **Dark Mode**: Switch between light and dark themes and system default.

## TODO

- Responsive Footer (+)
- Responsive MD editor post content (+)
- Comments
- Social media share (+?)
- SEO (title and meta tags and searchable parameters) also SEO for AI LLMs (+?)
- Update README with required environment values
- Create dynamic OG file when user creates or updates a post.
- Next.js version update
- Optimize unused JS
- Daily thoughts side or updates page (MAYBE A FEATURE)
- Status shall be changed in update post and add post section.
- word-break: break-word; for post view (+)
- Login margin or padding top

## Installation

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm (package manager)
- Docker (optional, for running with Docker Compose)
- Docker Desktop (Required for running PostgreSQL & pgAdmin in Docker)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/semdin/semdin.com-blog-next.js.git
   cd semdin.com-blog-next.js
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.local` and configure as needed:

   ```bash
   cp .env.local.example .env.local
   ```

   ```env
   NEXTAUTH_URL=https://localhost:3000
   NEXT_PUBLIC_SITE_URL=https://localhost:3000
   DATABASE_URL=postgresql://root:pass@localhost:7777/semdincom

   AUTH_SECRET=""
   AUTH_GOOGLE_ID=""
   AUTH_GOOGLE_SECRET=""

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   NEXT_PUBLIC_UPLOAD_PRESET=ml_default
   ```

4. Start the PostgreSQL database and pgAdmin with Docker:

   ```bash
   docker-compose up -d
   ```

   This will start PostgreSQL and pgAdmin in detached mode. If you want to run it in the foreground, remove `-d`.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.

## Docker Compose Setup

The application uses a PostgreSQL database and pgAdmin for database management. The `docker-compose.yml` file sets up these services:

```yaml
services:
  postgres:
    image: postgres
    container_name: semdin.com
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: semdincom
    ports:
      - "7777:5432" # Map external port 7777 to internal port 5432
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@semdin.com
      PGADMIN_DEFAULT_PASSWORD: pass
    ports:
      - "5050:80"
    volumes:
      - ./pgdata:/var/lib/pgadmin
    depends_on:
      - postgres

volumes:
  pgdata:
```

### Accessing pgAdmin

Once the containers are running, access pgAdmin at:

- **URL**: [http://localhost:5050](http://localhost:5050)
- **Login Email**: `admin@semdin.com`
- **Password**: `pass`

### Syncing the Database Schema with Drizzle ORM

After setting up PostgreSQL, sync your schema with the database:

```bash
npx drizzle-kit push
```

To view the database schema visually, run:

```bash
npx drizzle-kit studio
```

## Usage

### Starting the Application

After starting the server, log in with your credentials or create a new account. You can:

- **Create New Posts**: Navigate to the "New Post" section and start writing.
- **Edit Existing Posts**: Edit your published posts easily via the "Edit Post" button.
- **Manage Profile**: Update your profile and preferences in the "Profile" section.

## Dependencies

- **Next.js**: Framework for server-rendered React applications.
- **TypeScript**: Strongly-typed language for safer development.
- **Tailwind CSS**: Utility-first CSS framework.
- **Drizzle ORM**: Lightweight TypeScript ORM for database management.
- **NextAuth.js**: Authentication for Next.js.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a Pull Request.

## License

Just use it, don't ask :)

## Contact

For questions or support, please contact:

- **Email**: mehmetsemdinaktay@gmail.com
- **GitHub Issues**: [GitHub Issues](https://github.com/semdin/semdin.com-blog-next.js/issues)
