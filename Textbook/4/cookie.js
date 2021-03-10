const http = require('http')

// Set-Cookie : 쿠키 저장
// 세미콜론으로 키-값 구분
http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie)
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test' })
    res.end('Hello Cookie')
})
.listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다!')
})