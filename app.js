const express = require('express');
const app = express();

const mongoose = require('./db/mongoose')

const bodyParser = require('body-parser')

//Load in the mongoose models
const { List, Task } = require('./db/models')


//Load middleware
app.use(bodyParser.json());


// CORS HEADERS MIDDLEWARE
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Content, Authorization");
    next();
});
/*ROUTES HANDLERS*/


/*LISTS ROUTES*/

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    //on veut retourner un table contenant toutes les listes dans la base de données
    List.find().then((lists) => {
        res.send(lists)
    }).catch((e) => {
        console.log(e)
    })
});



/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    //on veut créer une nouvelle liste and la retourner à l'utilisateur (incluant l'id)
    //l'information sur les listes (champs) sera passée sous format json
    let title = req.body.title;
    let newList = new List({
        title
    })
    newList.save().then((listDoc) => {
        res.send(listDoc)
    })
});


/**
 * PATCH /lists/:id
 * Purpose: Mettre à jour une liste spécifique
 */
app.patch('/lists/:id', (req, res) => {
    //on veut mettre à jour la liste spécifiée
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});


/**
 * DELETE /lists/:id
 * Purpose: Supprimer une liste
 */
app.delete('/lists/:id', (req, res) => {
    //on veut supprimer la liste specifiée (incluant l'id)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});


/**
 * GET lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */

app.get('/lists/:listId/tasks', (req, res) => {
    //on veut retourner toutes les tâches conrrespondantes à une liste spécifique (spécifiée par id)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
});


/**
 * GET lists/:listId/tasks/:taskId
 * Purpose: get one precise task
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task)
    })
})

/**
 * POST lists/:listId/tasks
 * Purpose: Créer une nouvelle tâche dans une liste spécifique
 */
app.post('/lists/:listId/tasks', (req, res) => {
    //on veut créer une nouvelle tâche dans une liste spécifée par id
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    }).catch((e) => {
        console.log(e);
    })
})


/**
 * PATCH lists/:listId/tasks/:taskId
 * Purpose: mettre à jour une tâche existante
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    //on veut mettre à jour une tâche existante (spécifiée par taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.send({ message: "Updated successfully" });
    })
})


/**
 * DELETE lists/:listId/tasks/:taskId
 * Purpose: supprimer une tâche
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc)
    })
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});