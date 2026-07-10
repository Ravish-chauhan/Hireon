Development Environment Setup

1.Prerequisites

Node.js v20.x
Git
MongoDB Community Edition
Redis (later)
VS Code (extensions: ESLint, Prettier, REST Client)

2. Clone Repo
git clone https://github.com/Ravish-chauhan/edunia-project.git
cd edunia-project

3. Install Dependencies
npm install

4. Setup Environment Variables
cp .env.example .env

Open .env and configure values. Example:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mba_dev
JWT_SECRET=your_jwt_secret_here

5. Start MongoDB

6. Run Development Server
npm run dev

If successful, you’ll see:
MongoDB connected
Server running on port 5000
