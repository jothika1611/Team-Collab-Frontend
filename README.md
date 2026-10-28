# Team Collab Frontend

A modern, responsive frontend for the Team Collaboration & Task Management Platform built with React, TypeScript, and Vite. Features role-based dashboards, Kanban board with drag-and-drop, real-time notifications, and a sleek dark UI with animations.

## 🔗 Repository
[https://github.com/jothika1611/Team-Collab-Frontend.git](https://github.com/jothika1611/Team-Collab-Frontend.git)

## 🚀 Features

- **Authentication** - JWT-based login/register with forgot password flow
- **Role-Based Access** - Different dashboards for Admin/Manager vs Developer
- **Team Management** - Create teams, add/remove members, manage roles
- **Project Management** - Organize work by projects within teams
- **Kanban Board** - Drag-and-drop task management across TODO, IN_PROGRESS, IN_REVIEW, DONE
- **Task Management** - Create, assign, update tasks with priorities and due dates
- **Comments** - Collaborate on tasks with comments
- **Notifications** - Real-time notifications for assignments and updates
- **Activity Log** - Track all team activities
- **Modern UI** - Dark theme with gradients, animations, and responsive design

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Beautiful DnD** - Drag and drop
- **Bootstrap 5** - Styling framework
- **STOMP.js & SockJS** - WebSocket for real-time updates

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend server running (see [Team-Collab-Backend](https://github.com/jothika1611/Team-Collab-Backend.git))

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/jothika1611/Team-Collab-Frontend.git
cd Team-Collab-Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
   
   Update the API base URL in `src/api/axios.ts` if needed:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  ...
});
```

4. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

## 🐳 Docker Setup

Build and run with Docker:
```bash
docker build -t team-collab-frontend .
docker run -p 3000:80 team-collab-frontend
```

Or use with docker-compose from the root project directory.

## 📁 Project Structure

```
src/
├── api/           # API service calls
├── components/    # Reusable components (Navbar)
├── context/       # React Context (Auth)
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── App.tsx        # Main app component
```

## 🎨 UI Features

- **Dark Theme** - Modern dark UI with gradient accents
- **Animations** - Smooth transitions and hover effects
- **Admin Dashboard** - Analytics charts and team overview
- **Responsive Design** - Works on desktop and mobile
- **Role-Based Views** - Different UI elements based on user role

## 🔐 Default Roles

- **ADMIN** - Full access to all features
- **MANAGER** - Team and project management
- **DEVELOPER** - Task-focused access

## 📄 License

This project is for educational purposes.

## 👥 Contributing

Feel free to fork and submit pull requests.
