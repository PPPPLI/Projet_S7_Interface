# ST2SAS Docker - Ingé 2 - Software Engineering - Promo 2026
# E-commerce - Order - Payment - Product

### **Number of the group**
- LIU Pei
- XIA Ruixiang
- RAMANANTSALAMA Matthieu


## **If you want to test the project directly, here is the link on Azure Cloud: http://40.66.40.168/home** (If the server is available)
Note: The project currently only supports the desktop version. Please use a browser on a computer.

<h3><b>Introduction</b></h3>

This project is a simple e-commerce system. It consists of a total of four main backend services (Authentication, Order, Payment, Product), along with one MySQL database, one Redis cache, one Gateway, and a service management and orchestration center. Additionally, a meticulously implemented front-end based on Angular is set up with Nginx, which serves as a reverse proxy to address CORS issues.

First, the **user interface** sends the client's requests to the server side.

Next, the **gateway** acts as a single facade that redirects user requests to the various internal services. It routes requests based on the path or type of service requested, facilitating traffic management to the appropriate services without the client needing to know the underlying architecture.

The **authentication service** is used to generate a token that allows users to automatically authenticate with other services.

The **Order service** manages everything related to orders, such as creation, updating, and deletion. It is connected to two types of databases: **MySQL and Redis**. For reading data, it first queries the cache (Redis). If the data is not found in Redis, it then consults MySQL. After reading, the data is inserted into the cache to facilitate future reads.

Once the Order service receives a payment request, it communicates with the **Payment service** to process the payment via **Grpc**, and then stores the information in the database.

The Order service then sends a request to the **Product service**, also via Grpc, to update the stock in the database.

In case of failure during data registration, the **SAGA model** is used to compensate for operations and ensure data consistency.

Note: All services are registered in a **service management and orchestration center**, which I am using **Consul**.

<h3><b>Architecture of project</b></h3>

![image](https://github.com/user-attachments/assets/4d01d059-485b-49d1-a47e-e713cf499813)


<br>

### Environment 
- OS: Linux Ubuntu 24.04.1 LTS
- VM: VMware Workstation
- Editor: IntelliJ 2024.1.4(Backend), Vscode(Frontend)
- Programming Language: Java 17, Typescript, CSS, HTML
- Frameworks: Springboot 3(Backend), SpringCloud(Backend), Angular 18(Frontend)
- Databases: Mysql 8.0, Redis 7.4
- Docker: 27.3.1
- Deloyment: Azure Cloud (VM version: Standard_B2s)

### Initiation of Database and it's tables

In this project, we use JPA to initialize the database and automatically create the relevant tables through annotations. It is also used for the mapping layer to ensure smooth communication between the server side and the database.
![image](https://github.com/user-attachments/assets/4a81bb1a-f0c6-4984-b8e5-0418f9710f73)
![image](https://github.com/user-attachments/assets/03ca87cf-6197-471b-8f91-82be744e1907)


### Docker Compose

**Server side**
```yaml
services:
  mysql:    # Relational database to store Order, Product, Payment data
    image: mysql:8.0     # Use a exsiting image pulled from Docker Hub
    container_name: mysql_back    # container name definition
    restart: always       # In case of failure, the container will restart
    environment:     # Definition of environment variables, like authentication parameters
      MYSQL_ROOT_PASSWORD: 3333
      MYSQL_DATABASE: microservices
      MYSQL_USER: user
      MYSQL_PASSWORD: 3333
    ports:    # Port mapping to 3306
      - "3306:3306"
    volumes:   # Volume binding to persistent data
      - mysql_data:/var/lib/mysql
    networks:  # Affection of a user-defined custom network
      - backend_net

  consul:  # Service registration center for service discovery
    image: consul:1.15.4   # Image from Docker Hub
    container_name: consul_back  # Container name
    restart: always
    ports:  # Port mapping to 8500
      - "8500:8500"
    command: "consul agent -dev -client=0.0.0.0"  # Execute the command when container runs, here it is for starting Consul
    networks:  # Custom network affectation with bridge type
      - backend_net

  redis:  # Cache database to improve data search performance 
    image: redis:7.4  # Image from Docker Hub
    container_name: redis_back  # Container name
    restart: always  # retart mechanism
    ports:  # Port mapping to 6379
      - "6379:6379"
    volumes:  # Volume binding to redis_data
      - redis_data:/var/lib/redis
    command: ["redis-server","--requirepass","3333"]  # Command to start redis with a simple password configuration
    networks:    # Custom network affectation with bridge type
      - backend_net

  authentication_service:  # Authentication service used to login, registration functions
    build:  # Build the image by Dockerfile
      context: .  # Root path
      dockerfile: auth/Dockerfile_Auth  #Dockerfile path
    container_name: auth-service  # Container name
    depends_on:  # Dependency declaration, containers will run by respecting a specific order
      - mysql  # Dependency
      - consul  # Idem
    ports:  # Port mapping to 8083
      - "8083:8083"
    restart: always  # Retart in case of failure
    networks:  # network affectation
      - backend_net

  gateway_service:  # API gateway serves as a single entry point for client requests
    build:  # Build the image by Dockerfile
      context: .
      dockerfile: gateway/Dockerfile_Gateway
    networks:  # Network affectation
      - backend_net
    container_name: gateway-service  # Container name
    ports:  # Port mapping to 9090
      - "9090:9090"
    depends_on:  # Dependency
      - consul
    restart: always  # retart mechanism


  order_service:  # Order service to process clients' orders and write them into database
    build:  # Build the image by Dockerfile
      context: .
      dockerfile: order/Dockerfile_Order
    container_name: order-service  # Container name
    depends_on: # Dependency
      - consul
      - redis
      - mysql
    ports:  # Port Mapping to 8082
      - "8082:8082"
    restart: always
    networks:  # Network affectation
      - backend_net

  payment_service:  # Payment service to process payment treatments
    build:  # Build the image by Dockerfile
      context: .
      dockerfile: payment/Dockerfile_Payment
    container_name: payment-service  # Container name
    depends_on: # Dependency
      - consul
      - mysql
    ports:  # Port Binding, 8081 to tomcat and 9000 to Grpc listener 
      - "8081:8081"
      - "9000:9000"
    restart: always
    networks:  # Network affectation
      - backend_net

  product_service:  # Product service to product's storage management
    build:  # Build the image by Dockerfile
      context: .
      dockerfile: product/Dockerfile_Product
    container_name: product-service  # Container name
    depends_on:  #Dependency
      - consul
      - mysql
    ports: # Port mapping, 8084 to Tomcat, 9091 to Grpc listener
      - "8084:8084"
      - "9091:9091"
    restart: always
    networks:   # Network affectation
      - backend_net

volumes:  # Creation of volumes
  mysql_data:
  redis_data:

networks:  # Creation of user-defined custom network
  backend_net:
    driver: bridge
```

**Client side**

```yaml
services:  
  frontend: 
    build: # Build the image by Dockerfile
      context: .
      dockerfile: Dockerfile
    ports: # Port mapping to 80
      - "80:80"
    volumes:  # Volume binding for main html page and nginx configuration file 
      - ./dist/frontend:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
```


## Dockerfiles

We use 6 separate Dockerfiles to build the different services (Order, Payment, Product, Authentication, Gateway, Frontend), here we list 2 different examples because of the similarity of each file.

**Server side**
```Dockerfile
# Use of basical image jdk
FROM openjdk:17-jdk-slim
# Environment variables
ENV author=LIU

# Root path in the container
WORKDIR /app

# Copy the Jar file from host machine into container
COPY auth/Authentication-8083-1.0-SNAPSHOT.jar app.jar

# Entry point, when container starts, this command will definitively executed to start the java program
ENTRYPOINT ["java", "-jar", "app.jar"]  
```


**Client side**
```Dockerfile

# Use of basical image Nginx
FROM nginx:alpine  

# Copy the Angular built package from host machine into container
COPY dist/frontend/browser /usr/share/nginx/html  

# Copy Nginx configuration file into container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to the host machine
EXPOSE 80  

```


## **Starting with Docker**

1. Preparation Phase
   
   **Server side**
   - Pull the necessary images from Docker Hub: mysql:8.0, consul:1.15.4, redis:7.4
   - Organize the JAR files, Dockerfiles, and docker-compose.yml according to the structure below:
   ![image](https://github.com/user-attachments/assets/a1950bff-5ba4-4428-9051-220f6f46cc11)

   **Client side**
   - Build the project by using ng build --configuration production, which will generate an essential folder named dist.
   - Place the dist folder, docker-compose.yml, and nginx.conf together in the same root path.

2. Execution Phase
   
   **Server side**
   - Run the command docker compose up --build -d in the /docker directory.
  
   **Client side**
   - Run docker compose up --build -d in the root path that contains the three elements mentioned above.
  
## **Docker Hub**

All of the images in this project are pushed to Docker Hub
![image](https://github.com/user-attachments/assets/5a37a040-50a6-46f8-a89a-c4678e3cdd7e)
![image](https://github.com/user-attachments/assets/a59bcc71-090c-435a-b87e-7a19cde00e6c)

## **Additional Part**

**Alternation inside of containers**
![image](https://github.com/user-attachments/assets/faa570db-4efd-48bf-84a0-060168deb933)

