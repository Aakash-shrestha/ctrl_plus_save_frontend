# CTRL+SAVE

CTRL+SAVE is a modern, user-friendly cloud file management application inspired by Google Drive. Built with React, TypeScript, and Tailwind CSS, it allows users to upload, organize, and manage files and folders with features like search, starred items, government-verified documents, and storage tracking. The app also supports a premium upgrade flow with Khalti payment integration.

---

## Features

- **File & Folder Management:** Upload, create, delete, and organize files and folders.
- **Search:** Quickly find files and folders by name.
- **Starred & Recent:** Mark important files as starred and view recently accessed items.
- **Government Verified Documents:** Special section for files marked as government-verified.
- **Trash:** Deleted files and folders are moved to Trash for recovery.
- **Storage Tracking:** Visualize your storage usage and upgrade to premium for more space.
- **Premium Upgrade:** Buy premium storage using Khalti (QR code or direct link).
- **Responsive Design:** Works well on desktop and mobile.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ctrl_plus_save.git
   cd ctrl_plus_save
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:5173
   ```

---

## Usage

- **Upload Files:** Click the "New" button and select "Upload files" to add files.
- **Create Folders:** Click "New" > "New Folder" to organize your files.
- **Navigate:** Use the sidebar to switch between My Drive, Starred, Recent, Trash, and Government Verified sections.
- **Search:** Use the search bar at the top to find files and folders.
- **Star/Unstar:** Mark files as important by starring them.
- **Delete/Restore:** Move files/folders to Trash and restore or permanently delete them.
- **Upgrade Storage:** Click "Buy Premium" in the header to access more storage via Khalti.

---

## Project Structure

- `src/components/` — Reusable React components (Sidebar, FileList, ImageViewer, etc.)
- `src/assets/` — Static assets like the app logo.
- `src/types.ts` — TypeScript type definitions.
- `src/App.tsx` — Main application logic.

---

## License

This project is for educational/demo purposes.

---

## Credits

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Khalti](https://khalti.com/)

---
