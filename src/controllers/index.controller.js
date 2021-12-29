

const { Pool } = require('pg')

const pool = new Pool({
    host: 'ec2-50-19-160-40.compute-1.amazonaws.com',
    user: 'mfpkujfixilheg',
    password: 'b03d8a978f8bae3ef0fd97426e0db1cc2ed69e58820515bdad4990385de6b873',
    database: 'd7pnrh0bev5bve',
    port: '5432',
    ssl:{
        rejectUnauthorized: false
    },
})



const getUser = async (domain) => {
    try {
    const response = await pool.query('SELECT * FROM usuarios WHERE domain = ($1)', [domain])  
    console.log(response.rows)
    return response.rows
    } catch (error) {
        console.log(error)
    }
    
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