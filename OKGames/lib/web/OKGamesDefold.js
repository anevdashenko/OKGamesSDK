var OKGames = {

    $OKGames : {
        _playerInfoStr : null,
        _callbackInit : null,
        _callbackGetPlayer : null,

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
        }
    },

    OKGames_registerCallbacks : function(callbackInit, callbackGetPlayer){
        OKGames._callbackInit = callbackInit;
        OKGames._callbackGetPlayer = callbackGetPlayer;
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
        return OKGames._playerInfoStr;
    }
}

autoAddDeps(OKGames, '$OKGames');
mergeInto(LibraryManager.library, OKGames);
