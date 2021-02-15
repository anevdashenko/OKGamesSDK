(function(scope){
    var CURRENCY_CODE = "ok";
    
    var CALLBACK_PURCHASE = "showPayment";

    var OKGames = {
        _requestParameters : null,
        _purchaseCompleteCallback : null,

        isSDKAvailable : function(){
            return window.FAPI !== undefined;
        },

        init : function(callback){
            console.log("init OK games SDK");
            if (!OKGames.isSDKAvailable())
            {
                console.log("OK sdk not available");
                callback(false);
                return;
            }

            try
            {
                _requestParameters = FAPI.Util.getRequestParameters();
                
                FAPI.init(_requestParameters["api_server"], _requestParameters["apiconnection"],
                    function() {
                        console.log("OK games success init");
                        callback(true);
                    },

                    function(error) {
                        console.log("OK games error init");
                        console.error(error);
                        callback(false);
                    }
                );
            }
            catch(e){
                console.log("Cant initialize OK sdk", e);
                callback(false);
            }
        },

        getCurrentPlayerInfo(callback)
        {
            console.log("get player info sdk");
            if (!OKGames.isSDKAvailable())
            {
                console.log("OK sdk not available");
                callback(false, null);
                return;
            }

            var callbackGetCurrentPlayer = function(status, data, error){
                if (data){
                    callback(true, data);
                } else {
                    callback(false, error);
                }
            };

            var restParams = {"method":"users.getCurrentUser", "fields" : "pic128x128,first_name,last_name,location,locale,uid"};

            try{
                FAPI.Client.call(restParams, callbackGetCurrentPlayer);
            }
            catch(e){
                console.error("сant recieve player");
                console.error(e);
                callback(false, null);
            }
        },

        showPayment : function(purchaseOptions, completeCallback){
            OKGames._purchaseCompleteCallback = completeCallback;

            FAPI.UI.showPayment(
                purchaseOptions.name,
                purchaseOptions.description,
                purchaseOptions.code,
                purchaseOptions.price,
                null,
                purchaseOptions.attributes || null,
                CURRENCY_CODE,
                true,
                purchaseOptions.uiConf
            );
        },

        apiCallback

        onCompletePurchase : function(result, data){

        }

    }

    scope.okgamesSDK = OKGames;

    scope.API_callback = function(method, result, data){
        console.log("OK API call ", method, result, data);
    }

})(this);