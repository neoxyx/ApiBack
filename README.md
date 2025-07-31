```bash
npm i
```

```bash
npm run dev
```

# Rutas
## GET http://localhost:3000/api/cats/breeds

## GET http://localhost:3000/api/cats/breeds/:breed_id

## GET http://localhost:3000/api/cats/breeds/search

## GET http://localhost:3000/api/images/imagesbybreedid/:breed_id

## POST http://localhost:3000/api/users/register 
    Body json:
    {
        "email": "neoxyx@example.com",
        "password": "contraseñaSegura123",
        "name": "Neoxyx"
    }
## POST http://localhost:3000/api/users/login
    Body json:
    {
        "email": "neoxyx@example.com",
        "password": "contraseñaSegura123"
    }