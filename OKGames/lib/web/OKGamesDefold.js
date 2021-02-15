var OKGames = {

    $OKGames : {
        _playerInfoStr : null,
        _callbackInit : null,
        _callbackGetPlayer : null,
        _callbackPurchase : null,
        _callbackLoadedRewardedAd : null,
        _callbackShowRewardedAd : null,
        _callbackInterstitialAd : null,

        sendObjectCallback : function(callback, value){
            value = value || {};
            var objectStr = JSON.stringify(value);

            OKGames.sendStringCallback(callback, objectStr)
        },

        sendStringCallback : function(callback, value){
            value = value || "{}";

            var valueStr = 0;

            valueStr = allocate(intArrayFromString(value), "i8", ALLOC_NORMAL);
            {{{ makeDynCall("viii", "callback") }}}(valueStr);
            Module._free(valueStr);
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
        callbackInit, 
        callbackGetPlayer, 
        callbackPurchase, 
        callbackLoadedRewardedAd, 
        callbackShowRewardedAd,
        callbackInterstitialAd) {

        OKGames._callbackInit = callbackInit;
        OKGames._callbackGetPlayer = callbackGetPlayer;
        OKGames._callbackPurchase = callbackPurchase;
        OKGames._callbackLoadedRewardedAd = callbackLoadedRewardedAd;
        OKGames._callbackShowRewardedAd = callbackShowRewardedAd ;
        OKGames._callbackInterstitialAd = callbackInterstitialAd ;
    },

    OKGames_init : function(){
        console.log("OKGames_init");
        okgamesSDK.init((status)=>{
            console.log("complete init");

            result = {
                status : status
            };

            OKGames.sendObjectCallback(OKGames._callbackInit, result);
        });
    },

    OKGames_getCurrentPlayer : function(){
        console.log("OKGames_getCurrentPlayer");
        okgamesSDK.getCurrentPlayerInfo((status, playerData)=>{
            console.log("complete recieve player")

            result = {
                status : status,
                player_data : playerData
            };

            OKGames.sendObjectCallback(OKGames._callbackGetPlayer, result);
        });
    },

    OKGames_showPurchase : function(optionsStr){
        options = OKGames.parse_json(UTF8ToString(optionsStr) );
        console.log("OKGames_showPurchase");
        okgamesSDK.showPayment(options, (result) => {
            OKGames.sendObjectCallback(OKGames._callbackPurchase, result);
        });
    },

    OKGames_loadRewardedAd : function(){
        okgamesSDK.loadRewardedAd((result) => {
            OKGames.sendObjectCallback(OKGames._callbackLoadedRewardedAd, result);
        });
    },

    OKGames_showRewardedAd : function(){
        okgamesSDK.showRewardedAd((result) => {
            OKGames.sendObjectCallback(OKGames._callbackShowRewardedAd, result);
        });
    },

    OKGames_showInterstitialAd : function(){
        okgamesSDK.showInterstitialAd((result) => {
            OKGames.sendObjectCallback(OKGames._callbackInterstitialAd, result);
        });
    }
}

autoAddDeps(OKGames, '$OKGames');
mergeInto(LibraryManager.library, OKGames);
