const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr,{useUnifiedTopology:true})
    .then(client=>{
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })    

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed:false}) 
    res.render('index.ejs',{items:todoItems,left:itemsLeft})
})

app.post('/addTodo',(req,res)=>{
    db.collection('todos').insertOne({thing:req.body.todoItem, completed:false})
    .then(result=>{
        console.log('Todo Added')
        res.redirect('/')
    })
    .catch(error=>console.error(error))
})

app.listen(process.env.PORT || PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

app.delete('/deleteItem',(req,res)=>{
    db.collection('todos').deleteOne({thing:req.body.itemFromJS})
    .then(result=>{
        console.log('Todo deleted')
        res.json('todo deleted')
    })
    .catch(error=>console.error(error))
})

app.put('/markComplete',(req,res)=>{
    db.collection('todos').updateOne({thing:req.body.itemFromJS},{
        $set:{
            completed:true
        }
    },{
        sort:{_id:-1},
        upsert:false
    })
    .then(result=>{
        console.log('Mark Complete')
        res.json('Marked Complete')
    })
    .catch(error=>console.error(error))
})