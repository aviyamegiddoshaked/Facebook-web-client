
# Facebook Web Client

## Technologies Used (Entire Project)

### Frontend:
The client-side of the application is built using modern web technologies to deliver a seamless and responsive experience. Key technologies include:

- **JavaScript**: Enables dynamic functionality and interactivity for the application.
- **React**: Provides reusable components and efficient state management.
- **HTML & CSS**: Structures and styles the interface for a clean and mobile-friendly design.

### Backend:
The server-side is designed to handle requests, manage data storage, and provide efficient communication with the frontend. Key technologies include:

- **Node.js**: Non-blocking, event-driven architecture for high-performance server handling.
- **Express.js**: Simplifies server creation and routing, ideal for building RESTful APIs.
- **MongoDB**: Flexible NoSQL database for storing user data and application content.
- **jsonwebtoken**: Implements secure user authentication and authorization using JSON Web Tokens.
- **WebSockets**: Enables real-time communication for instant updates between client and server.
- **Multithreading**: Supports concurrent request handling for better performance.
- **TCP**: Ensures reliable and ordered data communication between systems.
- **RESTful API**: Structures communication between the frontend and backend using REST principles.

---

## Features

### User Authentication:
- **Sign-Up**: Users can register with a unique username and password. Passwords must meet security requirements (minimum 8 characters, including letters and numbers).
- **Log-In**: Users can log in securely to access the application features.

### Feed:
The feed is the central feature, providing users with a space to view and interact with content:
- **Posts**: Users can create, edit, and view posts.
- **Interactions**: Like and comment on posts to engage with content.
- **Search**: A search bar allows users to locate specific posts quickly.
- **Additional Features**:
  - **Log Out**: Securely logs the user out.
  - **Night Mode**: Switches the site between light and dark themes.

### Profile Page:
The profile page allows users to manage their personal information and social connections:
- **Edit Profile**: Update your display name, profile picture, and other personal details.
- **View Friends**: Access a list of your current connections.
- **Manage Friend Requests**: Accept or decline friend requests to manage your social circle.

---

## Running the Client-Side Application

### Prerequisites:
The application requires the [Bloom Filter Server](https://github.com/aviyamegiddoshaked/Bloom-Filter.git) for backend communication. Follow the instructions in the linked repository to set it up.

# Running the Client with Docker

To run the client application using Docker, follow the steps below:

### 1. Build the Docker Image

First, navigate to the directory containing the `Dockerfile`. Then, run the following command to build the Docker image:

```bash
docker build -t facebook-clone-client .
This will create a Docker image named facebook-clone-client based on the instructions in the Dockerfile.

### 2. Run the Docker Container
After building the Docker image, you can run the container using the following command:
docker run -p 3000:3000 --env-file .env facebook-clone-client

Once the Docker container is running, open your browser and navigate to http://localhost:3000. You should be able to see and interact with the client application

# Running the Client without Docker

## Dependencies

**Frontend:**
- React.js
- React Router
- Bootstrap

## Clone the Repositories

Clone the client and server repositories:

```bash
git clone https://github.com/aviyamegiddoshaked/Facebook-web-client.git
git clone *** server ***

## Install Dependencies

Install the dependencies for both the client and server:

### Client
```bash
cd Facebook-web-client
npm install


### Server

To install the dependencies for the server, run:

```bash
cd ../Facebook_clone-Server
npm install

## Build the Client-Side Code

To build the client-side code, run:

```bash
npm run build

## Set Up Configuration

In the `config` folder of both the client and server, modify the `config.js` file to include the appropriate IP address and port. 

Additionally, update the `App.js` file in the client to ensure it points to the correct server configuration.











   
