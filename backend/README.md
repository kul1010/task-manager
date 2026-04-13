# Backend – Team Task Manager

This is the Node.js + Express (TypeScript) backend for the Team Task Manager application.  
It exposes a RESTful API to manage tasks with properties: **ID, Title, Description, Priority, Status**.

---

## 🚀 Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
2. Initialize the project (creates package.json):
    npm init -y
3. npm install express cors
4.  npm install --save-dev typescript ts-node @types/node @types/express
5. Create a tsconfig.json file with below JSON:
    {
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

6. Start the Server
    npx ts-node src/server.ts
7. The API will be available at
    http://localhost:4000
    