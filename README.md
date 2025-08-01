# Web Infrastructure Project - Load Balanced API Service

This project demonstrates a scalable web infrastructure using containerized API services with load balancing capabilities. The architecture consists of two web API servers (`web-01` and `web-02`) running a custom-built API service and a HAProxy load balancer (`lb-01`) connected via a custom Docker network. The implementation showcases best practices in containerization, load balancing, and high-availability web service deployment.

## Project Overview

This application provides a practical implementation of:
- **Custom API Service**: A portfolio-grade API built and containerized as `gilbmura/my_api:v1.1`
- **Load Balancing**: HAProxy configuration with round-robin algorithm and custom headers
- **High Availability**: Multi-instance deployment with health checks
- **Containerization**: Docker-based infrastructure with isolated network setup
- **Infrastructure as Code**: Docker Compose orchestration for easy deployment

## Requirements

- Docker and Docker Compose installed on your machine
- At least 2 GB of free RAM and a few hundred megabytes of disk space

## Local Development Setup

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <this-repo-url>
   cd web_infra
   ```

2. **Start the application:**
   ```bash
   docker compose up -d --build
   ```

3. **Verify deployment:**
   ```bash
   docker compose ps
   ```
   You should see all services running: `web-01`, `web-02`, and `lb-01`

4. **Access the application:**
   - Load Balancer: http://localhost:8082
   - Direct API Access: http://localhost:8080 (web-01), http://localhost:8081 (web-02)

### Architecture Overview

The services are deployed on a custom Docker network (`lablan`) with the following configuration:

   | Container | IP           | Exposed Ports | Service |
   |---------- |------------- |---------------|---------|
   | web-01    | 172.20.0.11  | 2211 (SSH), 8080 (API) | Pre-built API service |
   | web-02    | 172.20.0.12  | 2212 (SSH), 8081 (API) | Pre-built API service |
   | lb-01     | 172.20.0.10  | 2210 (SSH), 8082 (HAProxy) | Ubuntu 24.04 for HAProxy setup |

4. Connect to any container using SSH. All containers have SSH enabled with an `ubuntu` user and password `pass123`.
   ```bash
   ssh ubuntu@localhost -p 2211  # web-01
   ssh ubuntu@localhost -p 2212  # web-02
   ssh ubuntu@localhost -p 2210  # lb-01 (for HAProxy configuration)
   ```

   **Alternative Access Method**: If SSH is not working, you can use Docker exec to access any container directly:
   ```bash
   docker exec -it lb-01 /bin/sh      # Access load balancer
   docker exec -it web-01 /bin/sh     # Access web-01
   docker exec -it web-02 /bin/sh     # Access web-02
   ```

## API Services on `web-01` and `web-02`

The `web-01` and `web-02` containers run a pre-built API service (`gilbmura/my_api:v1.1`) that automatically starts on port 80. You can verify the API services are running by visiting:

- http://localhost:8080 (web-01 API)
- http://localhost:8081 (web-02 API)

These API endpoints will be used as backends for the HAProxy load balancer configuration.

## Deployment Instructions

### Production Deployment on Web Servers

This application is designed to be deployed on production web servers with load balancing capabilities.

### Load Balancer Configuration

Before running this project, you have to configure HAProxy on `lb-01` to load balance requests between `web-01` and `web-02` using the **roundrobin** algorithm. Additionally, each response must include a custom header `X-Served-By` indicating which backend served the request.

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

## API Documentation

### Custom API Service (`gilbmura/my_api:v1.1`)

This project utilizes a custom-built API service developed as part of my portfolio work. The API provides:

- **RESTful endpoints** for core functionality
- **Health check endpoints** for load balancer monitoring
- **JSON response format** with proper HTTP status codes
- **Containerized deployment** ready for production scaling

### GitHub API Integration

The API service integrates with the **GitHub REST API** to provide repository and user information:

- **API Documentation**: [GitHub REST API Docs](https://docs.github.com/en/rest)
- **Rate Limiting**: 
  - **Unauthenticated requests**: 60 requests per hour per IP address
  - **Request calculation**: Each search query + programming language lookups = multiple requests
  - **Example**: Searching for a user with 10 programming languages = 11 requests (1 search + 10 language lookups)
  - **Shared limits**: All users on the same IP share the 60 requests/hour limit

**Important**: For production use, consider implementing GitHub API authentication to increase rate limits to 5,000 requests per hour per authenticated user.

### Load Balancer Features

- **Round-robin load balancing** across multiple API instances
- **Health checks** to ensure traffic only goes to healthy backends
- **Custom headers** (`X-Served-By`) to identify which backend served each request
- **High availability** configuration with automatic failover

## Development Challenges and Solutions

### Challenge 1: Container Networking
**Issue**: Ensuring proper communication between load balancer and API instances across Docker networks.
**Solution**: Implemented a custom Docker network (`lablan`) with static IP addressing to ensure reliable inter-container communication.

### Challenge 2: HAProxy Configuration
**Issue**: Configuring HAProxy for optimal load balancing with health checks in a containerized environment.
**Solution**: Used service-based commands (`sudo service haproxy restart`) instead of systemctl, and implemented proper backend health check configuration.

### Challenge 3: Container Restart Persistence
**Issue**: HAProxy service not automatically restarting when containers are stopped/started.
**Solution**: Documented manual restart procedures and provided both SSH and Docker exec access methods for container management.

### Challenge 4: Development Environment Consistency
**Issue**: Ensuring consistent behavior across different development environments.
**Solution**: Containerized the entire stack with Docker Compose, including specific version pinning and environment configuration.

## Repository Structure
```
web_infra/
├── README.md           # This comprehensive documentation
├── compose.yml         # Docker Compose orchestration
├── .gitignore         # Git ignore patterns for security and cleanliness
├── web/               # Web service configuration
│   └── Dockerfile     # Web container configuration
└── lb/                # Load balancer configuration
    └── Dockerfile     # Load balancer container configuration
```

**Note**: The `.gitignore` file properly excludes sensitive data, API keys, logs, temporary files, and other unnecessary artifacts from version control.

## Shutdown

When finished with the application, shut it down with:
```bash
docker compose down
```

## Credits and Acknowledgments

- **Teacher Wakuma**: Special thanks for providing the Docker deployment requirements and guidance that made this lab environment possible. The deployment architecture and container setup were designed based on the requirements provided.

- **API Service**: The API service (`gilbmura/my_api:v1.1`) used in this lab was developed as part of my work. This custom API serves as the backend for demonstrating load balancing capabilities.

## Security and Best Practices

**Important Security Notes**: 
- This development environment uses default credentials (`ubuntu:pass123`) for demonstration purposes only
- **GitHub API Integration**:
  - GitHub API keys must be kept secure and never committed to version control
  - Use environment variables or secret management for API key storage
  - Consider implementing GitHub OAuth for production deployments
- **Production deployments must implement**:
  - Strong, unique passwords and proper authentication
  - API keys and sensitive data managed through environment variables or secret management systems
  - No sensitive credentials committed to version control
  - Proper authorization mechanisms and access controls
  - SSL/TLS encryption for production traffic
  - Regular security updates and monitoring

**Code Quality**:
- Clean, readable code following industry best practices
- Comprehensive documentation and inline comments
- Proper error handling and logging
- Containerized architecture for consistency and scalability

Enjoy exploring this scalable web infrastructure project!
