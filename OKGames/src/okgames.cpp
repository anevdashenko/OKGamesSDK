#define EXTENSION_NAME OK_games
#define LIB_NAME "OK_games"
#define MODULE_NAME "OK_games"

#define DLIB_LOG_DOMAIN LIB_NAME
#include <dmsdk/sdk.h>
#include <dmsdk/dlib/log.h>
#include "luautils.h"
#include "okgames.h"
#include "callback_container.h"

#if defined(DM_PLATFORM_HTML5)


enum CallbackID {
    CallbackInit = 0,
    CallbackGetCurrentPlayer = 1,
    CallbackPurchase = 2,
    CallbackLoadRewardedAD = 3,
    CallbackShowRewardedAD = 4,
    CallbackShowInterstitialAD = 5,
    CallbackShowInvite = 7,

    CallbackCount
};


LuaCallbackContainer jsCallbacks[CallbackCount];

static int init(lua_State* L)
{
    jsCallbacks[CallbackInit].AddListener(L, 1, true);
    OKGames_init(CallbackInit);
    return 0;
}

static int getCurrentPlayer(lua_State* L)
{
    jsCallbacks[CallbackGetCurrentPlayer].AddListener(L, 1, true);
    OKGames_getCurrentPlayer(CallbackGetCurrentPlayer);
    return 0;
}

static int showPurchase(lua_State* L)
{
    const char* options = luaL_checkstring(L, 1);
    jsCallbacks[CallbackPurchase].AddListener(L, 2, true);
    OKGames_showPurchase(CallbackPurchase, options);
    return 0;
}

static int loadRewardedAd(lua_State* L)
{
    jsCallbacks[CallbackLoadRewardedAD].AddListener(L, 1, true);
    OKGames_loadRewardedAd(CallbackLoadRewardedAD);
    return 0;
}

static int showRewardedAd(lua_State* L)
{
    jsCallbacks[CallbackShowRewardedAD].AddListener(L, 1, true);
    OKGames_showRewardedAd(CallbackShowRewardedAD);
    return 0;
}

static int showInterstitialAd(lua_State* L)
{
    jsCallbacks[CallbackShowInterstitialAD].AddListener(L, 1, true);
    OKGames_showInterstitialAd(CallbackShowInterstitialAD);
    return 0;
}

static int showInvite(lua_State* L)
{
    const char* showParams = luaL_checkstring(L, 1);

    jsCallbacks[CallbackShowInvite].AddListener(L, 2, true);
    OKGames_showInvite(CallbackShowInvite, showParams);
    return 0;
}

static void onCallbackMessage(int callbackID, const char* message)
{
    if (callbackID < 0 || callbackID >= CallbackCount)
    {
        dmLogError("Callback id %d out of range", callbackID)
        return;
    }

    jsCallbacks[callbackID].SendMessageJsonObject("", message);
}


static const luaL_reg Module_methods[] =
{
    {"init", init},
    {"get_current_player", getCurrentPlayer},
    {"show_payment", showPurchase},
    {"load_rewarded_ad", loadRewardedAd},
    {"show_rewarded_ad", showRewardedAd},
    {"show_interstitial_ad", showInterstitialAd},
    {"show_invite", showInvite},

    {0, 0}
};

static void LuaInit(lua_State* L)
{
    int top = lua_gettop(L);
    luaL_register(L, MODULE_NAME, Module_methods);
    lua_pop(L, 1);
    assert(top == lua_gettop(L));
}

#endif

dmExtension::Result AppInitializeOKGamesExtension(dmExtension::AppParams* params) {
    return dmExtension::RESULT_OK;
}

dmExtension::Result InitializeOKGamesExtension(dmExtension::Params* params) {
	#if defined(DM_PLATFORM_HTML5)
		LuaInit(params->m_L);
        OKGames_registerCallbacks(onCallbackMessage);
	#else
		printf("Extension %s is not supported\n", MODULE_NAME);
	#endif
	return dmExtension::RESULT_OK;
}

dmExtension::Result AppFinalizeOKGamesExtension(dmExtension::AppParams* params) {
	return dmExtension::RESULT_OK;
}

dmExtension::Result FinalizeOKGamesExtension(dmExtension::Params* params) {
	return dmExtension::RESULT_OK;
}

dmExtension::Result UpdateOKGamesExtension(dmExtension::Params* params) {
	return dmExtension::RESULT_OK;
}

DM_DECLARE_EXTENSION(OK_games, LIB_NAME, AppInitializeOKGamesExtension, AppFinalizeOKGamesExtension, InitializeOKGamesExtension, UpdateOKGamesExtension, 0, FinalizeOKGamesExtension)