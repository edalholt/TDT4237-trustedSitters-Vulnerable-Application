# Webserver running nginx
FROM nginx:perl

# Import environment variables
ENV GROUPID=${GROUPID}
ENV PORT_PREFIX=${PORT_PREFIX}

# Copy nginx config to the container
COPY nginx.conf /etc/nginx/nginx.conf
