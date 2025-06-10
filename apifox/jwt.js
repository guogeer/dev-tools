var CryptoJS = require("crypto-js");

base64UrlEncode = (str) => {
	return CryptoJS.enc.Base64.stringify(str).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// 根据实际情况修改替换key
function encode_jwt(payload, key) {
	const iat = Math.floor(new Date().getTime() / 1000)
	payload = JSON.stringify({
		...payload,
		iat, // 签发时间
		exp: iat + 1 * 60 * 60, // 过期时间1小时
		jti: "abcd",
		user: "abc-123",
	})

	const header = JSON.stringify({
		typ: 'JWT',
		alg: 'HS256',
	})
	const beforeSign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload))
	const signature = base64UrlEncode(CryptoJS.HmacSHA256(beforeSign, key))
	return beforeSign + '.' + signature
}


app_id = pm.environment.get("appId")
secret = pm.environment.get("appSecret")
params = {
	"app_id": app_id,
}

payload = {}
for (var k in params) {
	if (params[k]) payload[k] = params[k]
}

jwt_token = encode_jwt(payload, secret)
pm.variables.set("jwtToken", jwt_token)