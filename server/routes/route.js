const express = require('express')
const {query, printdata} = require('../controllers/query')

const user = express.Router()

user.post('/api/query',query)

user.get('/',printdata)

module.exports ={
    user
}