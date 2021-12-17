var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT || 3000
const { firebaseApp, db } = require('./src/utils/firebase')
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { cloudWalletApi, verifierApi, login, getCredentials, verifyCredential } = require('./src/utils/affinidi')

const app = express()
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(200, "express");
});

router.get('/credentials', async function (req, res, next) {
  //const list = await foo()
  login().then((resp) => {
    console.log(resp.status)
    console.log(resp.data)
    const { accessToken, did } = resp.data
    getCredentials(accessToken).then((credResp) => {
      console.log(credResp)
      res.status(200).send(credResp.data);
    }).catch((credErr) => {
      console.error(credErr)
      res.status(500).send(credErr);
    })

  }).catch((err) => {
    console.error(err)
    res.status(500).send(err);
  })
})

router.post('/verify', async function (req, res, next) {
  console.log(req.body)
  verifyCredential(req.body).then((resp) => {
    console.log(resp)
    res.status(200).send("verify")
  }).catch((err) => {
    console.error(err)
    res.status(500).send(err)
  })

})

async function foo() {

  const licenses = collection(db, 'drivinglicense-approved')
  console.log("docs")
  const snapshot = await getDocs(licenses)
  const licenseList = snapshot.docs.map(doc => doc.data());
  console.log(licenseList)
  return licenseList;
}

app.use(router)

app.listen(port, () => {
  console.log(`app is listening to port 3000`);
})


module.exports = app;
