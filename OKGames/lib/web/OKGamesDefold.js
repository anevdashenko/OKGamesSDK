var OKGames = {

    $OKGames : {
        _playerInfoStr : null,
        _callbackJsonMessage : null,

        sendObjectCallback : function(callback, callbackID, value){
            value = value || {};
            var objectStr = JSON.stringify(value);

            OKGames.sendStringCallback(callback, callbackID, objectStr)
        },

        sendStringCallback : function(callback, callbackID, value){
            value = value || "{}";

            var valueStr = 0;

            valueStr = allocate(intArrayFromString(value), "i8", ALLOC_NORMAL);
            {{{ makeDynCall("viii", "callback") }}}(callbackID, valueStr);
            Module._free(valueStr);
        },

        sendObjectCallbackID : function(callbackID, value){
            OKGames.sendObjectCallback(OKGames._callbackJsonMessage, callbackID, value);
        },

        parse_json : function(str){
            if (str == null){
                return null;
            }

            try{
                var jsonObject = JSON.parse(str);
                return jsonObject
            }
            catch(e){
            }

            return null;
        }
    },

    OKGames_registerCallbacks : function(
        callbackJsonMessage) {

        OKGames._callbackJsonMessage = callbackJsonMessage;
    },

    OKGames_init : function(callbackID){
        console.log("OKGames_init");
        okgamesSDK.init((status)=>{
            console.log("complete init");

            result = {
                status : status
            };

            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_getCurrentPlayer : function(callbackID){
        console.log("OKGames_getCurrentPlayer");
        okgamesSDK.getCurrentPlayerInfo((status, playerData)=>{
            console.log("complete recieve player")

            result = {
                status : status,
                player_data : playerData
            };

            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_showPurchase : function(callbackID, optionsStr){
        options = OKGames.parse_json(UTF8ToString(optionsStr) );
        okgamesSDK.showPayment(options, (result) => {
            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_loadRewardedAd : function(callbackID){
        okgamesSDK.loadRewardedAd((result) => {
            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_showRewardedAd : function(callbackID){
        okgamesSDK.showRewardedAd((result) => {
            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_showInterstitialAd : function(callbackID){
        okgamesSDK.showInterstitialAd((result) => {
            OKGames.sendObjectCallbackID(callbackID, result);
        });
    },

    OKGames_showInvite : function(callbackID, showOptionsStr){
        var showParams = OKGames.parse_json(UTF8ToString(showOptionsStr) );
        okgamesSDK.showInvite(showParams, (result) => {
            OKGames.sendObjectCallbackID(callbackID, result);
        });
    }
}

autoAddDeps(OKGames, '$OKGames');
mergeInto(LibraryManager.library, OKGames);
