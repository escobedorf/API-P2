const express = require("express");
const routerUser = require("./src/routes/auth.rout");
const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/socios/v1/users', routerUser);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});



