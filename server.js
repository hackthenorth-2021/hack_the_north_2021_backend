const fs = require("fs")
const { Pool } = require("pg")
require('dotenv').config()


const pool = new Pool({
    user: process.env.COCKROACH_USER,
    password: process.env.COCKROACH_PASS,
    host: process.env.COCKROACH_HOST,
    port: process.env.COCKROACH_PORT,
    database: process.env.COCKROACH_DATABASE,
    ssl: {
        ca: fs.readFileSync("root.crt").toString()
    }
});

const getUsers = (request, response) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error){
            response.status(200).json(error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const register = (request, response) => {

    const find_query = {
        text: 'SELECT * FROM users WHERE username=$1',
        values: [request.body.username],
    }

    const insert_query = {
        text: 'INSERT INTO users(username, password) VALUES($1, $2)',
        values: [request.body.username,request.body.password],
    }


    pool.query(find_query, (error, results) => {

        console.log(results)

        if (Object.keys(results.rows).length === 0)
        {
            pool.query(insert_query, (error, results) =>{
                response.status(200).json("Account Created")
                if (error){
                    response.status(200).json(error)
                    throw error
                }
            })
        }
        else
        {
            response.status(300).json("Username Taken")
        }
        if (error){
            response.status(200).json(error)
            throw error
        }
    })
}

const login = (request, response) => {

    const find_user_query = {
        text: 'SELECT * FROM users WHERE username=$1',
        values: [request.body.username],
    }

    const check_password_query = {
        text: 'SELECT * FROM users WHERE username=$1 AND password=$2',
        values: [request.body.username,request.body.password],
    }


    pool.query(find_user_query, (error, results) => {

        console.log(results)

        if (Object.keys(results.rows).length === 0)
        {
            response.status(300).json("Unknown Username")
        }
        else
        {

            pool.query(check_password_query, (error, results) =>{
                if (Object.keys(results.rows).length === 0)
                {
                    response.status(300).json("Invalid Password")
                }
                else
                {
                    response.status(200).json(results.rows[0].id)
                }

            })
        }
        if (error){
            response.status(200).json(error)
            throw error
        }
    })
}

module.exports = {
    getUsers,
    register,
    login
}

