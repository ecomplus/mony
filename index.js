window.Mony = (function () {
  'use strict'

  // lib methods
  var methods = {}
  // debug option state
  var Debug
  // response callback function
  var ResponseCallback = function (err, html) {
    if (err) {
      console.error(err)
    } else {
      console.info(html)
    }
  }
  // credentials
  // var StoreId, AccessToken, MyId

  /* global ApiAi */
  var client = new ApiAi.ApiAiClient({
    accessToken: '38e90080662a4340a3d67ae31b91a86c'
  })

  methods.sendMessage = function (msg) {
    // send a request to Dialogflow with any text message
    client.textRequest(msg)

    // successful response handler
    .then(function (response) {
      if (Debug) console.info(response)
      var text = response.result.fulfillment.speech.trim()
      if (text && text !== '') {
        // parse to HTML and callback
        var html = text.replace(/(https?:[\S]+)/g, '<a href="$1" target="_blank">$1</a>')
        ResponseCallback(null, html)
      } else {
        // empty callback
        ResponseCallback()
      }
    })

    // Dialogflow server error handler
    .catch(function (error) {
      if (Debug) console.info(error)
      ResponseCallback(error)
    })
  }

  methods.sendRoute = function (hash) {
    // mock to send current admin panel route (page)
    // eg.: "/#/home"
    methods.sendMessage('/' + hash)
  }

  methods.init = function (params, accessToken, responseCallback, debug) {
    // set global callback function and debug option
    if (typeof responseCallback === 'function') {
      ResponseCallback = responseCallback
    }
    Debug = debug
    if (Debug) console.info('debugging Mony responses')

    // init conversation on Dialogflow setting up some parameters
    var paramsList = [ 'name', 'gender', 'email', 'hour', 'language' ]
    var msg = ''
    params = params || {}
    // send current local hour
    params.hour = new Date().getHours()
    for (var i = 0; i < paramsList.length; i++) {
      var param = paramsList[i]
      msg += param + ' ' + (params[param] || '-') + ' '
    }
    // send the first message
    methods.sendMessage(msg)
  }

  /* global jQuery */
  if (typeof jQuery === 'function') {
    // autosync current route with mony
    jQuery(window).on('hashchange', function () {
      methods.sendRoute(window.location.hash)
    })
  }

  return methods
}())
