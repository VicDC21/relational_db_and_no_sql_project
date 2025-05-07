# TP Base de Datos - Cátedra Merlino. Bases de Datos Relacionales y NoSQL
# ¿Cómo levantar el proyecto?
# Desde Windows
  - Instalar Python. Enlace oficial: https://www.microsoft.com/store/productId/9NRWMJP3717K?ocid=pdpshare

  - Instalar MongoDB como servicio. Enlace al instalador oficial: https://www.mongodb.com/try/download/community
  - Configurar variable de entorno (segun tu versión instalada): Explorador -> Editar las variables de entorno del sistema -> Variables de entorno -> Variables del sistema -> Path -> Nuevo -> C:\Program Files\MongoDB\Server\{Version}\bin
  - Iniciar ejecución del servicio (si no está en ejecución):
    * Buscar el servicio en la lista de servicios e iniciarlo: Explorador -> Servicios -> MongoDB Server (MongoDB) -> Iniciar 
    * Desde CMD/Powershell (como administrador):
      ```
      net start MongoDB
      ```
   
  - Abrir CMD/Powershell desde el directorio con el proyecto
    * Crear directorio que va a usar MongoDB:
      ```
      mkdir mongodb-data
      ```
    * Establecer conexión con MongoDB (Esta terminal permanece en ejecución):
      ```
      mongod --dbpath mongodb-data
      ```
   
  - Abrir una segunda terminal CMD/Powershell desde el directorio con el proyecto
    * Levantar el proyecto:
      ```
      python manage.py runserver
      ```
  - Acceder al proyecto para interactuar con el mismo: http://127.0.0.1:8000/

# Desde Linux
  - Abrir una terminal desde el directorio raíz del proyecto
  - Instalar Python y pip
      ```
      sudo apt update
      sudo apt install python3 python3-pip python3-venv
      ```
  - Crear y activar el entorno virtual
      ```
      python3 -m venv venv
      source venv/bin/activate
      ```
  - Instalar MongoDB desde Docker
    * Instalar Docker y habilitar para que inicie con el sistema
    ```
    sudo apt update
    sudo apt install docker.io
    ```
    * Descargar e iniciar MongoDB
    ```
    sudo docker pull mongo
    sudo docker run -d -p 27017:27017 --name mongodb mongo
    ```
  - Crear directorio para datos de MongoDB e iniciar servicio
    ```
    mkdir -p mongodb-data
    sudo systemctl start mongod
    ```
  - Instalar dependencias del proyecto
    ```
    pip install django pymongo
    ```
    
  - Asegurarse de estar en el entorno virtual e iniciar el servidor de desarrollo
    ```
    source venv/bin/activate
    python manage.py runserver    
    ```
  - Acceder al proyecto para interactuar con el mismo: http://127.0.0.1:8000/
