const crypto = require('crypto')

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64')
    console.log(salt)
    // 64바이트 길이의 문자열로 만들어, sha512변환된 결괏값을 다시 sha512로 변환하는 과정을 10만번 반복한다.
    crypto.pbkdf2('비밀번호', salt, 10000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'))
    })
})