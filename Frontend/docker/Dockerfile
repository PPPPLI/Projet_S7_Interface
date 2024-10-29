# Use of basical image Nginx
FROM nginx:alpine  

# Copy the Angular built package from host machine into container
COPY dist/frontend/browser /usr/share/nginx/html  

# Copy Nginx configuration file into container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to the host machine
EXPOSE 80  