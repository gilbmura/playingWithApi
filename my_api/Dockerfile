# Use nginx as the base image for serving static files
FROM nginx:alpine

# Copy the application files to nginx html directory
COPY HR/* /usr/share/nginx/html/

# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
# EXPOSE 8080

# Start nginx
# CMD ["nginx", "-g", "daemon off;"]