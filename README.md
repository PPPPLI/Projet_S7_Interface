# ST2SAS Docker - Ingé 2 - Software Engineering 
# Microservices - Order - Payment - Product - E-commerce project

### **Number of the group**
- LIU Pei
- XIA Ruixiang
- RAMANANTSALAMA Matthieu

### Environment 
- OS: Linux Ubuntu
- VM: VMware Workstation
- Editor: IntelliJ(Backend), Vscode(Frontend)
- Programming Language: Java, Typescript, CSS, HTML
- Frameworks: Springboot(Backend), SpringCloud(Backend), Angular(Frontend)
- Databases: Mysql, Redis
- Docker: Dockerfile, docker-compose.yml, Docker Hub, Docker network, Docker volume

## **Si vous voulez tester directement le projet, ici le lien sur Azure Cloud: http://40.66.40.168/home**
N.B. Le projet n'accepte momentanement que la version ordinateur, veuillez utiliser un navigateur sur l'ordinateur s'il vous plaît.

<h3><b>Introduction</b></h3>

Ce projet est un simple système de e-commerce. Il contient au total 4 services principaux(Authentification, Commande, Paiement, Produit), 1 Mysql, 1 Redis, 1 Gateway ainsi que 1 centre de gestion et d'orchestration des servies.

Tout d'abord, le **gateway** agit comme une façade unique qui redirige les requêtes des utilisateurs vers les différents services internes. Il distribue les requêtes en fonction de la route ou du type de service demandé, ce qui facilite la gestion du trafic vers les services appropriés sans que le client ait à connaître l'architecture sous-jacente.

Le **service d'authentification** est utilisé pour générer un token permettant aux utilisateurs de s'authentifier automatiquement auprès des autres services.

Le **service Order** gère tout ce qui concerne les commandes, telles que la création, la mise à jour, ainsi que la suppression. Il est connecté à deux types de bases de données : MySQL et Redis. Pour la lecture des données, il interroge d'abord le cache (Redis). Si les données ne sont pas trouvées dans Redis, il consulte MySQL. Après lecture, les données sont insérées dans le cache pour faciliter les futures lectures.

Une fois que le service Order reçoit une requête de paiement, il communique avec le **service Payment** pour procéder au paiement via **Grpc**, puis stocke les informations dans la base de données.

Le service Order envoie ensuite une requête au **service Product**, aussi via Grpc protocol, afin de mettre à jour le stock dans la base de données.

En cas d'échec lors de l'enregistrement des données, le **modèle SAGA** est utilisé pour compenser les opérations et garantir la cohérence des données.

N.B. Tous les services sont inscrits dans un **centre de gestion et d'orchestration des services**, ici j'utilise **Consul**.

<h3><b>Architecture du projet</b></h3>

![image](https://github.com/user-attachments/assets/4d01d059-485b-49d1-a47e-e713cf499813)


<br>
