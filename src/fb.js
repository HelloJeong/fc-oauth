/* eslint-disable prefer-destructuring */
const { default: fetch } = require('node-fetch')
const { v4: uuidv4 } = require('uuid')
const { getAccessTokenForUserId } = require('./auth')
const { getUsersCollection } = require('./mongo')
/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET

/**
 * @param {string} facebookId
 * @param {string} name
 * @returns {Promise<string>}
 */
async function createUserWithFacebookProfileAndGetId({
  id: facebookId,
  name,
  picture,
}) {
  // TOOD: implement it
  const users = await getUsersCollection()
  const userId = uuidv4()
  await users.insertOne({
    id: userId,
    facebookId,
    name,
    picture,
  })
  return userId
}

/**
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
async function getFacebookProfileFromAccessToken(accessToken) {
  // TODO: implement the function using Facebook API
  // https://developers.facebook.com/docs/facebook-login/access-tokens/#generating-an-app-access-token
  // https://developers.facebook.com/docs/graph-api/reference/v12.0/debug_token
  const appAccessTokenReq = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_CLIENT_SECRET}&grant_type=client_credentials`
  )
  const appAccessResult = await appAccessTokenReq.json()

  const appAccessToken = appAccessResult.access_token

  // console.log(`appAccessToken`, appAccessToken)

  const debugReq = await fetch(
    `https://graph.facebook.com/v12.0/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
  )
  const debugResult = await debugReq.json()

  // console.log(`debugResult`, debugResult)

  if (debugResult.data.app_id !== FB_APP_ID) {
    throw new Error(`Not a valid access token.`)
  }

  const facebookId = debugResult.data.user_id

  const profileRes = await fetch(
    `https://graph.facebook.com/v12.0/${facebookId}?fields=id,name,picture&access_token=${accessToken}`
  )
  return profileRes.json()
}

/**
 * @param {string} facebookId
 * @returns {Promise<string | undefined>}
 */
async function getUserIdWithFacebookId(facebookId) {
  // TODO: implement it
  const users = await getUsersCollection()
  const user = await users.findOne({ facebookId })

  return user ? user.id : undefined
}

/**
 * facebook token??? ??????, ?????? ?????? ??????????????? ?????? ???????????? ????????? ????????????,
 * ?????? ?????? ?????? ????????? ???????????? ??? ????????? AccessToken??? ????????????.
 * @param {string} token
 */
async function getUserAccessTokenForFacebookAccessToken(token) {
  const fbProfile = await getFacebookProfileFromAccessToken(token)
  const { id: facebookId } = fbProfile

  const existingUserId = await getUserIdWithFacebookId(facebookId)

  // ?????? Facebook ID??? ???????????? ????????? ?????????????????? ?????? ?????? ??????
  if (existingUserId) {
    return getAccessTokenForUserId(existingUserId)
  }
  // ?????? Facebook ID??? ???????????? ????????? ?????????????????? ?????? ?????? ??????
  const userId = await createUserWithFacebookProfileAndGetId(fbProfile)
  return getAccessTokenForUserId(userId)
}

module.exports = {
  FB_APP_ID,
  FB_CLIENT_SECRET,
  getFacebookProfileFromAccessToken,
  getUserIdWithFacebookId,
  getUserAccessTokenForFacebookAccessToken,
}
