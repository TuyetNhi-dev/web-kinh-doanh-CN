const axios = require('axios');
const crypto = require('crypto');

async function test() {
  const partnerCode = "MOMO";
  const accessKey = "F8B64950-51E4-4D6F-9092-2D9C5F2284D7";
  const secretKey = "PBgReqCd0bZ3qCTN3vAQAqaTqiFk6n";
  const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
  
  const amount = "50000";
  const orderId = "TEST_" + new Date().getTime();
  const orderInfo = "Test";
  const redirectUrl = "http://localhost:3000/order-success";
  const ipnUrl = "http://localhost:3000/api/payments/momo/callback";
  const requestId = orderId;
  const requestType = "captureWallet";
  const extraData = "";
  
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

  const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount: amount.toString(),
      orderId: orderId.toString(),
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
  };

  try {
    const res = await axios.post(endpoint, requestBody);
    console.log(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}
test();
