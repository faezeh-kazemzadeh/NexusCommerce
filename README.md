# NexusCommerce

NexusCommerce is a robust, full-stack E-commerce ecosystem built with the **MERN Stack**. The project features a modular architecture, focusing on a dynamic **CMS** with granular **Role-Based Access Control (RBAC)**. The entire infrastructure is containerized using **Docker** for seamless development and deployment.

## 🛠 Tech Stack

*   **Frontend**: React.js (Vite)[cite: 1]
*   **Backend**: Node.js & Express.js[cite: 1]
*   **Database**: MongoDB with Mongoose ODM[cite: 1]
*   **State Management**: Redux Toolkit (Client-side state)[cite: 1]
*   **Data Fetching**: React Query (Server-state synchronization)[cite: 1]
*   **Authentication**: Custom JWT (JSON Web Tokens) implementation[cite: 1]
*   **DevOps**: Docker & Docker Compose (YAML)[cite: 1]
*   **Styling**: Tailwind CSS[cite: 1]

---

## 🚀 Current Development: CMS & Dynamic Content

The project is actively expanding on the `feature/cms-module` branch, with a focus on:

*   **Dynamic Form Engine**: Implementing a flexible system to create and manage website content (banners, sections, blocks) dynamically via the UI[cite: 1].
*   **Granular RBAC**: A sophisticated security layer where access is determined by specific **Roles** and **Permissions**, ensuring users only see and interact with authorized CMS modules[cite: 1].
*   **Scalable Infrastructure**: Using **YAML** configurations to manage multi-container Docker environments, ensuring consistency across different development machines[cite: 1].

---

## 🔐 Advanced Security

*   **Identity**: Custom JWT-based authentication system[cite: 1].
*   **Authorization**: Middleware-level checks for both Roles and specific Permissions to protect sensitive CMS endpoints[cite: 1].

---

## 🐳 Docker Integration

This project uses Docker to simplify environment management. The setup includes:
*   `Dockerfile`: Optimized images for both Client and Server.
*   `docker-compose.yml`: Orchestrates the Node.js API, React frontend, and MongoDB database.

### Running with Docker:
  bash
# Clone and switch to the CMS branch
git clone https://github.com/faezeh-kazemzadeh/NexusCommerce.git
cd NexusCommerce
git checkout feature/cms-module

# Start the entire stack
docker-compose up --build


## 📂 Project Structure


NexusCommerce/
├── client/                # React Application (Redux + React Query)
├── server/                # Express API (JWT + RBAC Middleware)
├── docker-compose.yml     # Infrastructure as Code (YAML)
├── .env                   # Environment variables
└── README.md




## 📈 Roadmap
- [ ] Finalize the Dynamic Content Form builder.
- [ ] Integrate complex permission logic into the UI dashboard.
- [ ] Optimize Docker images for production-grade deployment.
- [ ] Expand E-commerce features (Orders, Payments, and Inventory).
