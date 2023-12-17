# Next.js Teslo Shop

Para correr localmente, se necesita la base de datos

```
  docker-compose up -d
```

-   El -d, segnifica **detached**

*   MongoDB URL Local:

```
MONGO_URL=mongodb://localhost:27020/teslodb
```

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

\*Reconstruir los modulos de node y levantar Next

```
npm install
npm run dev
```

## Llenar la base de datos con informacion de pruebas

Llamara:

```
  http://localhost:3000/api/seed/
```
