#pragma once

#include <dmsdk/sdk.h>

#if defined(DM_PLATFORM_HTML5)

typedef void (*MessageString)(const char* message);


extern "C" {
    void OKGames_registerCallbacks(MessageString callbackInit, MessageString callbackGetPlayer);
    
    void OKGames_init();
    void OKGames_getCurrentPlayer();
}


#endif