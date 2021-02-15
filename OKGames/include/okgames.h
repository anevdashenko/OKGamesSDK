#pragma once

#include <dmsdk/sdk.h>

#if defined(DM_PLATFORM_HTML5)

typedef void (*MessageString)(const char* message);


extern "C" {
    void OKGames_registerCallbacks(
        MessageString callbackInit, 
        MessageString callbackGetPlayer, 
        MessageString callbackPurchase);
    
    
    void OKGames_init();
    void OKGames_getCurrentPlayer();
    void OKGames_showPurchase(const char* optionsStr);
}


#endif