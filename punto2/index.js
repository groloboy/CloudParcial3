const express = require('express')
const app = express()

const port = 3000;

const users = [
  {
    "user": "user1",
    "name": "lucas",
    "email": "lucas@gmail.com"
  },
  {
    "user": "user2",
    "name": "bryan",
    "email": "bryan@gmail.com"
  }
]


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/', function (req, res) {
  res.json("Bienvenido a la API REST");
});

app.get('/users', function (req, res) {
  var obj = []
  if (req.query.name || req.query.user || req.query.email) {
    users.forEach(e => {
      if (req.query.name == e.name ||
        req.query.user == e.user ||
        req.query.email == e.email) {
        obj.push(e)
      }
    });
    if (obj.length==0){
      obj.push("No existe el usuario que se busca")
    }
    res.json(obj);
  }
  else {
    res.json(users);
  }
});

app.use(express.urlencoded({
  extended: true
}));

app.post('/users', function (req, res) {
  var body = req.body;
  var obj = {
    "user": body.user,
    "name": body.name,
    "email": body.email
  }
  users.push(obj)
  res.send(obj);
});

app.put('/users', (req, res) => {
  if (req.query.user) {
    var body = req.body;
    var obj = {
      "error": "No existe el usuario",
      "user": req.query.user
    }
    users.forEach(e => {
      if (req.query.user == e.user) {
        if (body.name) {
          e.name = body.name
        }
        if (body.email) {
          e.email = body.email
        }
        obj = e
      }
    });
    res.send(obj);
  }
  else {
    res.send('debe especificar el usuario');
  }
})

app.delete('/users', (req, res) => {
  if (req.query.user) {
    var obj = []
    users.forEach((e, i) => {
      if (req.query.user == e.user) {
        obj.push(e)
        users.splice(i, 1);
      }
    });
    if (obj.length==0){
      obj.push("No existe el usuario que se busca")
    }
    res.send(obj);
  }
  else {
    res.send('debe especificar el usuario');
  }
})

// curl -d 'user=admin&name=admin&email=admin@gmail.com' -X POST http://192.168.100.3:3000/users
// curl -d 'user=admin&name=admin2' -X PUT http://192.168.100.3:3000/users?user=admin
// curl -X DELETE http://192.168.100.3:3000/users?user=user1