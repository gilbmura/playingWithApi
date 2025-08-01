# GitHub Repository Finder 🔍

A powerful, modern web application for exploring GitHub users and their repositories with advanced analytics and visualizations. This full-stack project demonstrates professional web development skills, API integration, and scalable deployment practices.

## 🚀 What This Application Does

**GitHub Repository Finder** is an interactive web application that allows you to:

- **🔍 Search GitHub Users**: Enter any GitHub username to explore their profile and repositories
- **📊 Advanced Language Analytics**: View detailed programming language breakdowns with beautiful visualizations
- **📈 Repository Insights**: Get comprehensive stats including stars, forks, size, and last updated dates
- **🎨 Modern UI/UX**: Enjoy a responsive design with dark/light theme toggle
- **⚡ Smart Loading**: Pagination system to efficiently browse through repositories
- **🔗 Direct Integration**: Seamless links to GitHub repositories and profiles

## ✨ Key Features

### Core Functionality
- **User Search**: Real-time GitHub user lookup with instant results
- **Repository Display**: Comprehensive repository information with clean, organized layout
- **Language Analytics**: 
  - Individual repository language breakdowns with percentages
  - Global language statistics across all user repositories
  - Color-coded visualizations matching GitHub's official language colors
  - Progress bars showing language distribution

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Theme Toggle**: Switch between light and dark modes with preference persistence
- **Smart Pagination**: Load more repositories efficiently without overwhelming the interface
- **Error Handling**: Graceful handling of API limits and network issues
- **Loading States**: Smooth loading animations and feedback

### Technical Excellence
- **Pure JavaScript**: Built with vanilla JS showcasing fundamental web development skills
- **GitHub API Integration**: Efficient use of GitHub REST API with rate limit awareness
- **Performance Optimized**: Concurrent API calls and smart data caching
- **Containerized**: Production-ready Docker deployment

## 🎨 Application Preview

### **Main Interface**
The application features a clean, modern interface with:
- **Prominent search bar** for entering GitHub usernames
- **Theme toggle** in the navigation for light/dark mode switching
- **Responsive layout** that works on all devices

### **Search Results Display**
When you search for a user, you'll see:
- **Global Language Statistics** at the top showing overall programming language distribution
- **Repository cards** with comprehensive information:
  - Repository name with direct GitHub link
  - Description and metadata (stars, forks, size)
  - **Visual language breakdown** with color-coded progress bars
  - **Individual language percentages** for each repository
  - Last updated timestamps and repository topics

### **Interactive Features**
- **Load More**: Pagination system to browse through all repositories
- **Theme Switching**: Instant toggle between light and dark themes
- **Error Handling**: User-friendly messages for network issues or invalid usernames
- **Loading States**: Smooth animations while fetching data

### **Try These Example Users:**
- `octocat` - GitHub's mascot account with diverse repositories
- `torvalds` - Linux creator with interesting projects
- `gilbmura` - The developer's own repositories showcasing this and other projects

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom styling with CSS Grid/Flexbox, responsive design, theme system
- **Vanilla JavaScript**: ES6+ features, async/await, modern DOM manipulation
- **Font Awesome**: Professional icon library for enhanced UI

### Backend & Infrastructure
- **GitHub REST API**: Primary data source with efficient rate limit management
- **Docker**: Containerized deployment with nginx web server
- **HAProxy**: Load balancing for high-availability production deployment
- **nginx**: Static file serving and reverse proxy capabilities

### Development Tools
- **Docker Compose**: Multi-container orchestration
- **Git**: Version control with professional workflow
- **CSS Variables**: Dynamic theming system

## 🚀 Quick Start

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <this-repo-url>
   cd playingWithApi
   ```

2. **Open the application:**
   You can open `HR/index.html` directly in your browser for quick development and testing.

## 🏗️ Production Deployment with Load Balancer

For production environments requiring high availability, this application includes a complete load-balanced infrastructure setup.

### Architecture Overview

The production deployment consists of:
- **2 Web Servers** (`web-01`, `web-02`): Running the GitHub Repository Finder application
- **1 Load Balancer** (`lb-01`): HAProxy with round-robin distribution
- **Custom Network**: Isolated Docker network for secure communication

### Deploy with Load Balancing

1. **Navigate to infrastructure directory:**
   ```bash
   cd web_infra
   ```

2. **Start the full infrastructure:**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application:**
   - **Load Balanced**: http://localhost:8082 (Recommended)
   - **Direct Access**: http://localhost:8080, http://localhost:8081

### Infrastructure Details

The services are deployed on a custom Docker network (`lablan`) with the following configuration:

   | Container | IP           | Exposed Ports | Service |
   |---------- |------------- |---------------|---------|
   | web-01    | 172.20.0.11  | 2211 (SSH), 8080 (HTTP) | GitHub Repo Finder App |
   | web-02    | 172.20.0.12  | 2212 (SSH), 8081 (HTTP) | GitHub Repo Finder App |
   | lb-01     | 172.20.0.10  | 2210 (SSH), 8082 (HTTP) | HAProxy Load Balancer |

## 📖 How to Use the Application

### Getting Started
1. **Open the application** in your web browser
2. **Enter a GitHub username** in the search box (try 'octocat', 'torvalds', or any GitHub user)
3. **Click Search** or press Enter
4. **Explore the results**:
   - View repository details with descriptions, stars, and forks
   - See programming language breakdowns with visual percentages
   - Check out the global language statistics at the top
   - Click repository names to visit them on GitHub

### Key Features in Action

#### 🔍 **Smart Search**
- Search any public GitHub user
- Real-time validation and error handling
- Automatic loading states and feedback

#### 📊 **Language Analytics**
- **Global Stats**: See overall programming language distribution across all repositories
- **Per-Repository**: Individual language breakdowns with percentages
- **Visual Progress Bars**: Color-coded language indicators
- **GitHub Official Colors**: Authentic language color scheme

#### 🎨 **Theme System**
- **Toggle Themes**: Click the theme button in the top navigation
- **Persistent Preference**: Your theme choice is remembered
- **Smooth Transitions**: Elegant animations between light and dark modes

#### ⚡ **Performance Features**
- **Pagination**: Load repositories in batches for better performance
- **Concurrent Loading**: Language data fetched efficiently
- **Rate Limit Awareness**: Smart handling of GitHub API limits

## 🔧 Advanced Configuration

### HAProxy Load Balancer Setup

For production deployments requiring high availability, configure HAProxy on `lb-01` to load balance requests between `web-01` and `web-02` using the **roundrobin** algorithm.

### Prerequisites: Install Required Tools

Before configuring HAProxy, make sure you have the necessary tools installed in the `lb-01` container:

1. **Check if vim and curl are installed:**
   ```bash
   which vim curl
   ```

2. **If vim or curl are missing, install them:**
   ```bash
   sudo apt update
   sudo apt install -y vim curl
   ```

   **Alternative text editors** if you prefer:
   ```bash
   sudo apt install -y nano    # For nano editor
   sudo apt install -y emacs   # For emacs editor
   ```

Steps to complete the activity:

1. Install HAProxy inside `lb-01`:
   ```bash
   sudo apt update && sudo apt install -y haproxy
   ```
2. Edit `/etc/haproxy/haproxy.cfg` so that the frontend listens on port `80` and forwards to the two backends. Use vim (or your preferred editor):
   ```bash
   sudo vim /etc/haproxy/haproxy.cfg
   ```
   
   **Important:** While configuring HAProxy, comment out the following line in `/etc/haproxy/haproxy.cfg` if it exists:
   ```
   # stats socket /run/haproxy/admin.sock mode 660 level admin
   ```
   
   add this configuration at the end of the .cfg:
   ```
   frontend http-in
       bind *:80
       default_backend servers

   backend servers
       balance roundrobin
       server web01 172.20.0.11:80 check
       server web02 172.20.0.12:80 check
       http-response set-header X-Served-By %[srv_name]
   ```
3. Restart HAProxy to apply your configuration:
   ```bash
   sudo service haproxy restart
   ```

### Verifying the Load Balancer

From your host machine run (make sure curl is installed as mentioned in the prerequisites):
```bash
curl -I http://localhost:8082
```
Repeated requests should alternate between `web-01` and `web-02` and the `X-Served-By` header in the output will reveal which server handled each request.

**Additional testing commands:**
```bash
# Test multiple requests to see load balancing
curl -I http://localhost:8082
curl -I http://localhost:8082
curl -I http://localhost:8082

# Test with full response (not just headers)
curl http://localhost:8082
```

### Important Note About Container Restarts

If you stop and restart the Docker containers (using `docker compose stop` and `docker compose start`), you will need to restart the HAProxy service on the `lb-01` container:

```bash
# SSH into the load balancer
ssh ubuntu@localhost -p 2210

# OR use docker exec if SSH is not working
docker exec -it lb-01 /bin/sh

# Then restart HAProxy service
sudo service haproxy restart
```

This is because HAProxy doesn't automatically restart when the container restarts - only the SSH daemon starts automatically.

## 🔌 API Integration & Technical Details

### GitHub REST API Integration

This application efficiently integrates with the **GitHub REST API** to provide comprehensive repository data:

#### **Core API Endpoints Used:**
- **User Repositories**: `GET /users/{username}/repos` - Fetches user's repositories
- **Repository Languages**: `GET /repos/{owner}/{repo}/languages` - Gets language breakdown
- **Repository Details**: Comprehensive repo metadata including stars, forks, descriptions

#### **API Features:**
- **Concurrent Requests**: Parallel fetching of language data for optimal performance
- **Rate Limit Management**: Smart handling of GitHub's API limits
- **Error Handling**: Graceful fallbacks for network issues and API errors
- **Data Caching**: Efficient use of browser storage for better UX

#### **Rate Limiting Information:**
- **Unauthenticated requests**: 60 requests per hour per IP address
- **Request calculation**: Each search query + programming language lookups = multiple requests
- **Example**: Searching for a user with 10 repositories = ~11 requests (1 search + 10 language lookups)
- **Shared limits**: All users on the same IP share the 60 requests/hour limit

**💡 Pro Tip**: For production use, implement GitHub API authentication to increase rate limits to 5,000 requests per hour per authenticated user.

#### **API Documentation Reference:**
- [GitHub REST API Docs](https://docs.github.com/en/rest)
- [Authentication Guide](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api)

### Application Architecture

#### **Frontend Architecture:**
- **Modular JavaScript**: Separated concerns with `github.js` for API logic and `script.js` for UI interactions
- **Event-Driven**: Efficient DOM manipulation with proper event handling
- **State Management**: Local state management for user sessions and theme preferences
- **Responsive Design**: CSS Grid/Flexbox layout with mobile-first approach

#### **Deployment Architecture:**
- **Containerized**: Docker-based deployment with nginx serving static files
- **Load Balanced**: Optional HAProxy setup for high-availability production deployment
- **Scalable**: Multi-instance deployment ready for production traffic

## 🏗️ Development Challenges and Solutions

### Challenge 1: GitHub API Rate Limiting
**Issue**: Managing GitHub API rate limits while providing smooth user experience with detailed language analytics.
**Solution**: Implemented concurrent API requests with proper error handling, rate limit detection, and user feedback systems.

### Challenge 2: Performance Optimization
**Issue**: Loading language data for multiple repositories could be slow and resource-intensive.
**Solution**: Used `Promise.all()` for concurrent API calls, implemented smart pagination, and added loading states for better UX.

### Challenge 3: Cross-Browser Compatibility
**Issue**: Ensuring consistent behavior across different browsers and devices.
**Solution**: Used vanilla JavaScript with modern ES6+ features, CSS Grid/Flexbox for layouts, and extensive testing across platforms.

### Challenge 4: Data Visualization
**Issue**: Creating meaningful visual representations of programming language distributions.
**Solution**: Implemented color-coded progress bars with GitHub's official language colors and percentage calculations.

### Challenge 5: Production Deployment
**Issue**: Scaling from development to production-ready infrastructure.
**Solution**: Containerized the application with Docker, implemented load balancing with HAProxy, and created comprehensive deployment documentation.

## 📁 Repository Structure

```
playingWithApi/
├── README.md              # Comprehensive documentation
├── Dockerfile             # Main application container
├── HR/                    # GitHub Repository Finder Application
│   ├── index.html         # Main application interface
│   ├── styles.css         # Custom styling and theme system
│   ├── script.js          # UI interactions and theme management
│   └── github.js          # GitHub API integration and data processing
└── web_infra/             # Production deployment infrastructure
    ├── compose.yml        # Docker Compose orchestration
    ├── web/               # Web service configuration
    │   └── Dockerfile     # Web container setup
    └── lb/                # Load balancer configuration
        └── Dockerfile     # HAProxy container setup
```

### Key Files Explained:
- **`HR/github.js`**: Core application logic with GitHub API integration, language analytics, and data visualization
- **`HR/styles.css`**: Complete styling system with dark/light themes, responsive design, and smooth animations
- **`HR/script.js`**: Theme toggle functionality and local storage management
- **`Dockerfile`**: Simple nginx-based deployment for the application
- **`web_infra/compose.yml`**: Multi-container setup for production load-balanced deployment

## 🛑 Shutdown

When finished with the application, shut it down with:

**Simple Deployment:**
```bash
docker stop <container-name>
```

**Load Balanced Deployment:**
```bash
cd web_infra
docker compose down
```

## 🎯 Project Showcase

This GitHub Repository Finder demonstrates:

### **🔧 Technical Skills**
- **Frontend Development**: Modern HTML5, CSS3, and Vanilla JavaScript
- **API Integration**: Efficient REST API consumption with error handling
- **Data Visualization**: Custom language analytics with visual representations
- **Responsive Design**: Mobile-first approach with cross-browser compatibility
- **Performance Optimization**: Concurrent requests and smart caching strategies

### **🏗️ DevOps & Infrastructure**
- **Containerization**: Docker expertise for consistent deployments
- **Load Balancing**: HAProxy configuration for high availability
- **Infrastructure as Code**: Docker Compose orchestration
- **Production Deployment**: Scalable multi-container architecture

### **💡 Problem Solving**
- **Rate Limit Management**: Smart handling of API constraints
- **User Experience**: Smooth loading states and error handling
- **Code Organization**: Modular architecture with separation of concerns
- **Documentation**: Comprehensive guides for reproduction and deployment

## 👨‍💻 About the Developer

**Gilbert Muramira** - Full Stack Developer & DevOps Enthusiast

This project showcases my expertise in modern web development, API integration, and scalable deployment practices. Built as part of my portfolio to demonstrate real-world development skills.

**Connect with me:**
- 🐙 GitHub: [@gilbmura](https://github.com/gilbmura)
- 💼 LinkedIn: [Gilbert Muramira](https://www.linkedin.com/in/gilbert-muramira/)
- 🐦 Twitter: [@GMuramira](https://x.com/GMuramira)

## 🔒 Security and Best Practices

### **Development Security:**
- **No API Keys Required**: Uses GitHub's public API endpoints
- **Client-Side Only**: No sensitive data stored on servers
- **Rate Limit Awareness**: Built-in protection against API abuse

### **Production Security Considerations:**
- **HTTPS Deployment**: Always use SSL/TLS in production
- **API Authentication**: Consider implementing GitHub OAuth for enhanced rate limits
- **Container Security**: Regular security updates for base images
- **Environment Variables**: Secure management of any sensitive configuration

### **Code Quality Standards:**
- **Clean Architecture**: Modular, maintainable codebase
- **Error Handling**: Comprehensive error management and user feedback
- **Performance Optimized**: Efficient API usage and minimal resource consumption
- **Cross-Platform**: Tested across different browsers and devices
- **Documentation**: Extensive inline comments and user guides

---


Happy coding! 🎉
