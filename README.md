# semdin.com-blog-next.js

semdin.com-blog-next.js is a simple blog platform for my personal sharings.

## Features

- **User Authentication**: Secure login with NextAuth and Google OAuth.
- **Role Management**: Separate user roles for authors and admins.
- **Rich Text Editing**: Create and edit posts with a powerful md-editor-rt editor.
- **Responsive Design**: Optimized for all devices.
- **Dark Mode**: Switch between light and dark themes.

## TODO
- Responsive Footer
- Responsive MD editor post content
- Comments
- Social media share
- SEO (title and meta tags and searchable parameters) also SEO for AI LLMs

## Installation

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm (package manager)
- Docker (optional, for running with Docker Compose)

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

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.

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

Just use it don't ask :)

## Contact

For questions or support, please contact:

- **Email**: mehmetsemdinaktay@gmail.com
- **GitHub Issues**: [GitHub Issues](https://github.com/semdin/semdin.com-blog-next.js/issues)
