var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
var cors = require('cors')
const { firebaseApp, db } = require('./src/utils/firebase')
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { cloudWalletApi, verifierApi, login, getCredentials, verifyCredential } = require('./src/utils/affinidi')

const app = express()

app.use(bodyParser.json())
app.use(cors())
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
  // console.log(req.body)
  let found = false
  const { verifiableCredentials, condition } = req.body
  for (const cred of verifiableCredentials) {
    console.log(cred.credentialSubject.data.medicalCondition)
    if (condition === cred.credentialSubject.data.medicalCondition) {
      console.log("Matching cert found")
      found = true
      verifyCredential(cred).then((resp) => {
        console.log(resp.status)
        console.log(resp.data)
        res.status(200).send(resp.data)
      }).catch((err) => {
        console.error(err)
        res.status(500).send(err)
      })
    }
  }
  if (!found) {
    res.status(404).send(JSON.stringify({ "message": "no valid certification matching condition" }))
  }


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
  console.log(`app is listening to port ` + port);
})


module.exports = app;
