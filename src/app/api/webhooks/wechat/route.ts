import crypto from "crypto"

class WechatVerifier {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  checkSignature(signature: string, timestamp: string, nonce: string): boolean {
    const tmpArr = [this.token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join("");
    const generatedSignature = crypto
      .createHash("sha1")
      .update(tmpStr)
      .digest("hex");

    return generatedSignature === signature;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const nonce = url.searchParams.get("nonce") ?? ''
  const signature = url.searchParams.get("signature") ?? ''
  const timestamp = url.searchParams.get("timestamp") ?? ''
  // 获取 echostr 参数
  const echostr = url.searchParams.get("echostr") ?? ''

  const wechatVerifier = new WechatVerifier("kannaifei")

  if (wechatVerifier.checkSignature(signature, timestamp, nonce)) {
    // 验证通过后返回 echostr
    return new Response(echostr, {
      status: 200
    });
  } else {
    return new Response("failed", {
      status: 403
    });
  }
}