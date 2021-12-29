

const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'jc050691',
    database: 'webserversalesforce',
    port: '5432'
})



const getUser = async (req, res) => {

    const response = await pool.query('SELECT * FROM usuarios')
    console.log(response.rows)
    res.status(200).json(response.rows)
}



const checkUser = async (req, res) => {
    const { consumeri, consumers, domain } = req.body
    console.log(consumeri)
    console.log(consumers)
    console.log(domain)
    const response = await pool.query('SELECT * FROM usuarios WHERE domain = ($1)', [domain])
    return response.rows
}

const setUser = async (req, res) => {
    const { consumeri, consumers, domain } = req.body
    const response = await pool.query('INSERT INTO usuarios (consumeri ,consumers, domain) VALUES ($1,$2,$3)', [consumeri, consumers, domain])
    const resmsj = {
        message: 'Credentials added succesfully',
        command: response.command,
        rowCount: response.rowCount,
        body: {
            user: { consumeri, consumers, domain }
        }
    }

    res.status(200).json(resmsj)
    return resmsj
}
const updateUser = async (req, res) => {
    const { consumeri, consumers, domain } = req.body
    const response = await pool.query('UPDATE usuarios SET (consumeri ,consumers) = ($1,$2) WHERE domain = $3', [consumeri, consumers, domain])
    const resmsj = {
        message: 'Credentials update succesfully',
        command: response.command,
        rowCount: response.rowCount,
        body: {
            user: { consumeri, consumers, domain }
        }
    }
    res.status(200).json(resmsj)
    return resmsj
}

module.exports = {
    getUser,
    setUser,
    checkUser,
    updateUser
}