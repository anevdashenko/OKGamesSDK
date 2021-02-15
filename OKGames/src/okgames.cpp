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

LuaCallbackContainer callbacksInit;
LuaCallbackContainer callbacksGetCurrentPlayer;
LuaCallbackContainer callbackShowPurchase;

static int init(lua_State* L)
{
    callbacksInit.AddListener(L, 1, true);
    OKGames_init();
    return 0;
}

static void onInit(const char* message)
{
    dmLogDebug("onInit ok sdk %s", message);
    callbacksInit.SendMessageJsonObject("", message);
}

static int getCurrentPlayer(lua_State* L)
{
    callbacksGetCurrentPlayer.AddListener(L, 1, true);
    OKGames_getCurrentPlayer();
    return 0;
}

static void onGetCurrentPlayer(const char* message)
{
    dmLogDebug("onGetCurrentPlayer ok sdk, %s", message);
    callbacksGetCurrentPlayer.SendMessageJsonObject("", message);
}

static int showPurchase(lua_State* L)
{
    const char* options = luaL_checkstring(L, 1);
    callbackShowPurchase.AddListener(L, 2, true);
    OKGames_showPurchase(options);
    return 0;
}

static void onShowPurchaseComplete(const char* message)
{
    dmLogInfo("onShowPurchaseComplete ok sdk, %s", message);
    callbackShowPurchase.SendMessageJsonObject("", message);
}

static const luaL_reg Module_methods[] =
{
    {"init", init},
    {"get_current_player", getCurrentPlayer},
    {"show_payment", showPurchase},

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
        OKGames_registerCallbacks(onInit, onGetCurrentPlayer, onShowPurchaseComplete);
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