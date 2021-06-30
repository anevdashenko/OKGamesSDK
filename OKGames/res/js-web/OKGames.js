(function(scope){
    var CURRENCY_CODE = "ok";
    
    var CALLBACK_PURCHASE = "showPayment";
    var CALLBACK_LOADAD = "loadAd";
    var CALLBACK_SHOW_LOADED = "showLoadedAd";
    var CALLBACK_SHOW_INTERSTITIAL = "showAd";
    var CALLBACK_SHOW_INVITE = "showInvite";
    var CALLBACK_GET_PAGE_INFO = "getPageInfo";

    var MAX_WINDOW_WIDTH = 760;
    var MIN_WINDOW_WIDTH = 100;

    var MAX_WINDOW_HEIGHT = 4000;
    var MIN_WINDOW_HEIGHT = 100;

    var STATUS = {
        OK : "ok",
        ERROR : "error"
    }

    var INTERSTITIAL_AD_STATUS = {
        NOT_LOADED : 0,
        LOADING : 1,
        READY : 2,
        SHOW : 3,
        SHOWN : 4
    };

    var INTERSTITIAL_RESULT = {
        AD_READY : "ready",
        NO_ADS : "no_ads",
        AD_PREPARED : "ad_prepared",
        AD_SHOWN : "ad_shown"
    };

    function createSafeCallback(callback){
        return function(){
            if (callback){
                return callback.apply(null, arguments);
            }

            return null;
        }
    }

    var OKGames = {
        _isInited : false,
        _requestParameters : null,

        _purchaseCompleteCallback : null,
        _loadAdCallback : null,
        _rewardedAdCallback : null,
        _interstitialAdCallback : null,
        _inviteCallback : null,
        _pageInfoCallback : null,

        _interstitialAdStatus : INTERSTITIAL_AD_STATUS.NOT_LOADED,

        _apiCallbacks : {},



        isSDKAvailable : function(){
            return window.FAPI !== undefined;
        },

        isSDKInit : function(){
            return OKGames._isInited;
        },

        initialize : function(){
            OKGames._apiCallbacks[CALLBACK_PURCHASE] = OKGames.onCompletePurchase;
            OKGames._apiCallbacks[CALLBACK_LOADAD] = OKGames.onLoadRewardedAd;
            OKGames._apiCallbacks[CALLBACK_SHOW_LOADED] = OKGames.onRewardedCallback;
            OKGames._apiCallbacks[CALLBACK_SHOW_INTERSTITIAL] = OKGames.onShowInterstitialAd;
            OKGames._apiCallbacks[CALLBACK_SHOW_INVITE] = OKGames.onShowInvite;
            OKGames._apiCallbacks[CALLBACK_GET_PAGE_INFO] = this.onGetPageInfo;

            this._pageInfoCallback = createSafeCallback(null);
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
                OKGames.onCompleteInit(callback, false);
                return;
            }

            if (OKGames.isSDKInit()){
                OKGames.onCompleteInit(callback, true);
                return;
            }

            try
            {
                _requestParameters = FAPI.Util.getRequestParameters();
                
                FAPI.init(_requestParameters["api_server"], _requestParameters["apiconnection"],
                    function() {
                        console.log("OK games success init");
                        OKGames._isInited = true;
                        OKGames.onCompleteInit(callback, true);
                    },

                    function(error) {
                        console.log("OK games error init");
                        console.error(error);
                        OKGames.onCompleteInit(callback, false);
                    }
                );
            }
            catch(e){
                console.log("Cant initialize OK sdk", e);
                OKGames.onCompleteInit(callback, false);
            }
        },

        onCompleteInit : function(complete_callback, status){
            let result = {
                status : status,
                request_parameters :  _requestParameters || {}
            }

            complete_callback(result);
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
                    OKGames._purchaseCompleteCallback = null;

                    complete_callback(result);
 
                }
            }
          
        },

        onCompletePurchase : function(result, data){
            var isSuccess = result === STATUS.OK;

            var purchaseData = {
                status : isSuccess,
                result : result,
                data : data
            };

            if (OKGames._purchaseCompleteCallback != null){
                OKGames._purchaseCompleteCallback(purchaseData);
                OKGames._purchaseCompleteCallback = null;
            }
        },

        loadRewardedAd : function(complete_callback){
            OKGames._loadAdCallback = complete_callback;

            try{
                FAPI.UI.loadAd();
            }
            catch(e){
                console.log("loadRewardedAd", e);
                OKGames._loadAdCallback = null;

                if (complete_callback){
                    complete_callback({status : false});
                }
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
                OKGames._loadAdCallback(resultData);
                OKGames._loadAdCallback = null;
            }
        },

        showRewardedAd : function(completeCallback){
            OKGames._rewardedAdCallback = completeCallback;

            try{
                FAPI.UI.showLoadedAd();
            }
            catch(e){
                console.log("showRewardedAd", e);
                OKGames._rewardedAdCallback = null;

                if (completeCallback){
                    completeCallback({status:false});
                }

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
                OKGames._rewardedAdCallback = null;
            }

        },

        showInterstitialAd : function(completeCallback){
            OKGames._interstitialAdCallback = completeCallback;

            try{
                OKGames._interstitialAdStatus = INTERSTITIAL_AD_STATUS.LOADING;
                FAPI.UI.showAd();
            }
            catch(e){
                console.log("showInterstitialAd", e);
                OKGames._interstitialAdStatus = INTERSTITIAL_AD_STATUS.NOT_LOADED;
                OKGames._interstitialAdCallback = null;

                if (complete_callback){
                    complete_callback({status : false});
                }
            }

        },

        onShowInterstitialAd : function(result, data){
            var isSuccess = result == STATUS.OK;
            var isShown = data == INTERSTITIAL_RESULT.AD_SHOWN;

            if (data == INTERSTITIAL_RESULT.AD_PREPARED || data == INTERSTITIAL_RESULT.AD_READY){
                OKGames._interstitialAdStatus = INTERSTITIAL_AD_STATUS.READY;
            }

            if (isShown){
                OKGames._interstitialAdStatus = INTERSTITIAL_AD_STATUS.NOT_LOADED;
            }

            if (!isSuccess || isShown){
                OKGames.onCompleteInterstitialCall(isSuccess, result, data);
            }
        },

        onCompleteInterstitialCall : function(status, result, data){
            var adResult = {
                status : status,
                result : result,
                data : data
            }

            if (OKGames._interstitialAdCallback){
                OKGames._interstitialAdCallback(adResult);
            }

            OKGames._interstitialAdCallback = null;

        },

        //https://apiok.ru/dev/sdk/js/ui.showInvite/

        showInvite : function(showParams, callback){
            OKGames._inviteCallback = callback;
            
            try{
                FAPI.UI.showInvite(showParams.text, showParams.params || null, showParams.selected_uids || null);
            }
            catch(e){
                OKGames._inviteCallback = null;

                if (callback){
                    callback({status:false});
                }
            }
        },

        onShowInvite : function(result, data){
            var isSucces = result == STATUS.OK;
            var inviteResult = {
                status : isSucces,
                result : result,
                data : data
            };

            if (OKGames._inviteCallback){
                OKGames._inviteCallback(inviteResult);
            }

            OKGames._inviteCallback = null;
        },

        setWindowSize : function(width, height){
            if ((width >= MIN_WINDOW_WIDTH) && (width <= MAX_WINDOW_WIDTH) && 
                (height >= MIN_WINDOW_HEIGHT) && (height <= MAX_WINDOW_HEIGHT)) {
                FAPI.UI.setWindowSize(width, height);
            } else {
                console.log("OKSDK: setWindowSize invalid size", width, height)
            }
        },

        getPageInfo : function(completeCallback){
            OKGames._pageInfoCallback(null);
            OKGames._pageInfoCallback = createSafeCallback(completeCallback);

            FAPI.UI.getPageInfo();
        },

        onGetPageInfo : function(result, data){
            var isSucces = result == STATUS.OK;

            var resultData = {
                status : isSucces,
                data : data
            };

            OKGames._pageInfoCallback(resultData);
            OKGames._pageInfoCallback = createSafeCallback(null);
        }
    }

    OKGames.initialize();

    scope.okgamesSDK = OKGames;

    scope.API_callback = function(method, result, data){
        console.log("OK API call ", method, result, data);
        OKGames.apiCallback(method, result, data);
    }

})(this);