const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const affinidiEnv = process.env.REACT_APP_ENVIRONMENT
const apiKeyHash = process.env.REACT_APP_API_KEY_HASH
const baseURL = `https://cloud-wallet-api.${affinidiEnv}.affinity-project.org/api/v1`
const verifierBaseUrl = `https://affinity-verifier.${affinidiEnv}.affinity-project.org/api/v1`



const cloudWalletApi = axios.create({
    baseURL,
    headers: {
        'Api-Key': apiKeyHash,
        'Content-Type': 'application/json',
    },
});

const verifierApi = axios.create({
    baseURL: verifierBaseUrl,
    headers: {
        'Api-Key': apiKeyHash,
        'Content-Type': 'application/json',
    },
});

const login = async function () {
    let accessToken, did
    const body = {
        "username": "bawfen",
        "password": "Password123!"
    }
    return cloudWalletApi.post("/users/login", body)

}

async function getCredentials(accessToken) {
    const config = {
        headers: {
            'Api-Key': apiKeyHash,
            'Authorization': accessToken,
            'Content-Type': 'application/json',
        }
    }
    return axios.get(baseURL + "/wallet/credentials", config)
}

async function verifyCredential(credential) {
    const data = JSON.stringify(credential)
    var config = {
        method: 'post',
        url: verifierBaseUrl + '/verifier/verify-vcs',
        headers: {
            'Api-Key': apiKeyHash,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
}

module.exports = { cloudWalletApi, verifierApi, login, getCredentials, verifyCredential }