<h1 align="center">📁 Drive - File Management App</h1>

## 📜 Introduction

A **Google Drive** like application designed to offer a seamless experience for uploading, managing, and sharing files. This project utilizes Next.js and TypeScript for efficient development, Appwrite for backend services, and Clerk for secure user authentication.

---

## ✨ Features

- **File Management**: Upload, download, and manage files effortlessly with an intuitive UI.
- **Search and Filter**: Easily find files with advanced search and sorting options.
- **Appwrite Integration**:  
  - **Database Management**: Efficiently store and retrieve user files with Appwrite's database services.  
  - **Storage**: Securely upload and manage files using Appwrite's storage feature.  
  - **Serverless Functions**: Extend functionality with Appwrite’s custom serverless functions.  
  - **Access Control**: Granular permission management for users and their files, allowing secure sharing and collaboration with specific users or groups.



---

## ⚙️ Installation Guide

Follow these steps to set up and run the application locally:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Vikash-thak12/Drive.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd Drive
    ```

3. **Install dependencies**:

    ```bash
    npm install
    
4. **Set Up Environment Variables**:

   Create a new file named .env in the root of your project and add the following content:

   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=
   NEXT_PUBLIC_APPWRITE_PROJECT=
   NEXT_PUBLIC_APPWRITE_DATABASE=
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION
   NEXT_PUBLIC_APPWRITE_FILES_COLLECTION
   NEXT_PUBLIC_APPWRITE_BUCKET=
   NEXT_APPWRITE_KEY=
    ```
5. **Start the development server**:

    ```bash
    npm run dev
    ```
6. **Access the app**:


    Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.


7. **Edit the code**:


    Start editing by modifying files inside the `app` directory, such as `app/page.tsx`. Changes will auto-update in the browser.
   
   
---

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Your feedback and contributions are welcome!

---

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
