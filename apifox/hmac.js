var CryptoJS = require("crypto-js");

base64UrlEncode = (str) => {
	return CryptoJS.enc.Base64.stringify(str).replace(/\+/g, '-').replace(/\//g, '_')
}

const client_id = pm.environment.get("appId")
const client_secret = pm.environment.get("appSecret")

const ts = Math.floor(new Date().getTime())

payload = {
	client_id: client_id,
	timestamp: ts,
	nonce: "Aa" + Math.floor(Math.random() * 100000000)
}

// 根据实际情况修改替换key
function encode_hmac(payload, key) {
	const params = []
	for (let key in payload) {
		params.push(`${key}=${payload[key]}`)
	}

	const beforeSign = params.join("&")
	const hmac = CryptoJS.HmacSHA256(beforeSign, key)
	const signature = base64UrlEncode(hmac)
	return { data: beforeSign, sign: signature }
}

result = encode_hmac(payload, client_secret)

pm.variables.set("hmacSign", `${result.sign}`);
