const express = require('express')
const {query} = require('../controllers/query')

const user = express.Router()

user.post('/api/query',query)


module.exports ={
    user
}