const exec = require('child_process').exec
const process = exec('dir')

// 표준출력
process.stdout.on('data', function(data) {
    console.log(data.toString())
})

// 표준에러
process.stderr.on('data', function(data) {
    console.error(data.toString())
})