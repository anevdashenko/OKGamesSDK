(function(scope){
    var CURRENCY_CODE = "ok";
    
    var CALLBACK_PURCHASE = "showPayment";
    var CALLBACK_LOADAD = "loadAd";
    var CALLBACK_SHOW_LOADED = "showLoadedAd";
    var CALLBACK_SHOW_INTERSTITIAL = "showAd";

    var STATUS = {
        OK : "ok",
        ERROR : "error"
    }

    var OKGames = {
        _requestParameters : null,
        _purchaseCompleteCallback : null,
        _loadAdCallback : null,
        _rewardedAdCallback : null,
        _interstitialAdCallback : null,

        _apiCallbacks : {},

        isSDKAvailable : function(){
            return window.FAPI !== undefined;
        },

        initialize : function(){
            OKGames._apiCallbacks[CALLBACK_PURCHASE] = OKGames.onCompletePurchase;
            OKGames._apiCallbacks[CALLBACK_LOADAD] = OKGames.onLoadRewardedAd;
            OKGames._apiCallbacks[CALLBACK_SHOW_LOADED] = OKGames.onRewardedCallback;
            OKGames._apiCallbacks[CALLBACK_SHOW_INTERSTITIAL] = OKGames.onShowInterstitialAd;
        },

        apiCallback : function(method, result, data){
            var fnCallback = OKGames._apiCallbacks[method];

            if (fnCallback != undefined && fnCallback != null){
                fnCallback(result, data);
            }
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
            purchaseOptions = purchaseOptions || {};

            OKGames._purchaseCompleteCallback = completeCallback;

            try{
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
            }
            catch(e){
                console.log("showPayment", e);

                if (complete_callback){
                    var result = {
                        status : false
                    };

                    complete_callback(result);
                    OKGames._purchaseCompleteCallback = null;
 
                }
            }
          
        },

        onCompletePurchase : function(result, data){
            isSuccess = result === STATUS.OK;

            var purchaseData = {
                status : result,
                result_message : result,
                data : data
            };

            if (OKGames._purchaseCompleteCallback != null){
                OKGames._purchaseCompleteCallback(purchaseData);
            }

            OKGames._purchaseCompleteCallback = null;
        },

        loadRewardedAd : function(complete_callback){
            OKGames._loadAdCallback = complete_callback;

            try{
                FAPI.UI.loadAd();
            }
            catch(e){
                console.log("loadRewardedAd", e);

                if (complete_callback){
                    complete_callback({status : false});
                }
                OKGames._loadAdCallback = null;
            }
        },

        onLoadRewardedAd : function(result, data){
            var isLoaded = result == STATUS.OK;
            var resultData = {
                status : isLoaded,
                message : result,
                data : data
            }

            if (OKGames._loadAdCallback){
                OKGames._loadAdCallback(resultData)
            }
            
            OKGames._loadAdCallback = null;
        },

        showRewardedAd : function(completeCallback){
            OKGames._rewardedAdCallback = completeCallback;

            try{
                FAPI.UI.showLoadedAd();
            }
            catch(e){
                console.log("showRewardedAd", e);

                if (completeCallback){
                    completeCallback({status:false});
                }

                OKGames._rewardedAdCallback = completeCallback;
            }
        },

        onRewardedCallback : function(result, data){
            var isSuccess = result == STATUS.OK;
            var rewardedData = {
                status : isSuccess,
                data : data
            }

            if (OKGames._rewardedAdCallback){
                OKGames._rewardedAdCallback(rewardedData);
            }

            OKGames._rewardedAdCallback = null;
        },

        showInterstitialAd : function(completeCallback){
            OKGames._interstitialAdCallback = completeCallback;
            try{
                FAPI.UI.showAd();
            }
            catch(e){
                console.log("showInterstitialAd", e);

                if (complete_callback){
                    complete_callback({status : false});
                }

                OKGames._interstitialAdCallback = null;
            }

        },

        onShowInterstitialAd : function(result, data){
            var adResult = {
                status : true,
                result : result,
                data : data
            }

            if (OKGames._interstitialAdCallback){
                OKGames._interstitialAdCallback(adResult);
            }

            OKGames._interstitialAdCallback = null;
        }

    }


    OKGames.initialize();

    scope.okgamesSDK = OKGames;

    scope.API_callback = function(method, result, data){
        console.log("OK API call ", method, result, data);
        OKGames.apiCallback(method, result, data);
    }

})(this);