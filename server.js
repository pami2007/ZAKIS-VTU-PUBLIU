require('dotenv').config()
//const app = require('./app')

const app = require('./app')

const port = process.env.PORT || 4199

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
    console.log(`Local: http://localhost:${port}`)
})