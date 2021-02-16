#pragma once

#include <dmsdk/sdk.h>

#if defined(DM_PLATFORM_HTML5)

typedef void (*CallbackMessage)(int callbackId, const char* message);


extern "C" {
    void OKGames_registerCallbacks(CallbackMessage callbackIDMessage);
    
    void OKGames_init(int callbackID);
    void OKGames_getCurrentPlayer(int callbackID);
    void OKGames_showPurchase(int callbackID, const char* optionsStr);
    void OKGames_loadRewardedAd(int callbackID);
    void OKGames_showRewardedAd(int callbackID);
    void OKGames_showInterstitialAd(int callbackID);
    void OKGames_showInvite(int callbackID, const char* showParams);
}


#endif