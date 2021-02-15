#pragma once

#include <dmsdk/sdk.h>
#include "luautils.h"

struct LuaListener {
    LuaListener() : m_L(0), m_Callback(LUA_NOREF), m_Self(LUA_NOREF), m_removeOnCall(false)
    {

    }
    lua_State* m_L;
    int m_Callback;
    int m_Self;
    bool m_removeOnCall;
};

class LuaCallbackContainer
{
private:
    dmArray<LuaListener> m_listeners;

    bool CheckCallbackAndInstance(LuaListener* listener);
    void UnregisterCallback(lua_State* L, LuaListener* listener);
    int GetEqualIndexOfListener(lua_State* L, LuaListener* listener);

public:
    LuaCallbackContainer();
    ~LuaCallbackContainer();

    void AddListener(lua_State* L, int index, bool removeOnCall = false);
    void RemoveListener(lua_State* L);

    bool HasCallbacks();

    void SendMessage(const char* message_id);
    void SendMessageString(const char* message_id, const char* message);
    void SendMessageFloat(const char* message_id, float value);
    void SendMessageJsonObject(const char* message_id, const char* objectStr);
    void SendMessageBool(const char* message_id, bool value);
};

LuaCallbackContainer::LuaCallbackContainer()
{
}

LuaCallbackContainer::~LuaCallbackContainer()
{
}

void LuaCallbackContainer::AddListener(lua_State* L, int index, bool removeOnCall)
{
    dmLogInfo("Add Listener");

    LuaListener listener;
    listener.m_L = dmScript::GetMainThread(L);

    luaL_checktype(L, index, LUA_TFUNCTION);
    lua_pushvalue(L, index);
    listener.m_Callback = dmScript::Ref(L, LUA_REGISTRYINDEX);

    listener.m_removeOnCall = removeOnCall;

    dmScript::GetInstance(L);

    listener.m_Self = dmScript::Ref(L, LUA_REGISTRYINDEX);

    if(listener.m_Callback != LUA_NOREF)
    {
        int index = GetEqualIndexOfListener(L, &listener);
    
        if (index < 0)
        {
            if(m_listeners.Full())
            {
                m_listeners.OffsetCapacity(1);
            }

            m_listeners.Push(listener);
        } else {
            dmLogError("Can't register a callback again. Callback has been registered before.");
        }
    }
}

void LuaCallbackContainer::RemoveListener(lua_State* L)
{
    LuaListener listener;
    listener.m_L = dmScript::GetMainThread(L);

    luaL_checktype(L, 1, LUA_TFUNCTION);
    lua_pushvalue(L, 1);

    listener.m_Callback = dmScript::Ref(L, LUA_REGISTRYINDEX);

    dmScript::GetInstance(L);
    listener.m_Self = dmScript::Ref(L, LUA_REGISTRYINDEX);

    UnregisterCallback(L, &listener);
}

bool LuaCallbackContainer::CheckCallbackAndInstance(LuaListener* listener)
{
    if(listener->m_Callback == LUA_NOREF)
    {
        dmLogInfo("Callback is nil");
        return false;
    }

    lua_State* L = listener->m_L;
    int top = lua_gettop(L);
    lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Callback);
    //[-1] - callback
    lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Self);
    //[-1] - self
    //[-2] - callback
    lua_pushvalue(L, -1);
    //[-1] - self
    //[-2] - self
    //[-3] - callback
    dmScript::SetInstance(L);
    //[-1] - self
    //[-2] - callback
    if (!dmScript::IsInstanceValid(L)) {
        UnregisterCallback(L, listener);
        dmLogError("LuaCallbackContainer: Could not run callback because the instance has been deleted.");
        lua_pop(L, 2);
        assert(top == lua_gettop(L));
        return false;
    }

    return true;
}

void LuaCallbackContainer::UnregisterCallback(lua_State* L, LuaListener* listener)
{
    int index = GetEqualIndexOfListener(L, listener);
    if (index >= 0){
      if(listener->m_Callback != LUA_NOREF)
      {
          dmScript::Unref(listener->m_L, LUA_REGISTRYINDEX, listener->m_Callback);
          dmScript::Unref(listener->m_L, LUA_REGISTRYINDEX, listener->m_Self);
          listener->m_Callback = LUA_NOREF;
      }

      m_listeners.EraseSwap(index);

    } else {
      dmLogError("Can't remove a callback that didn't not register.");
    }
}

int LuaCallbackContainer::GetEqualIndexOfListener(lua_State* L, LuaListener* listener)
{
    lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Callback);
    int first = lua_gettop(L);
    int second = first + 1;
    for(uint32_t i = 0; i != m_listeners.Size(); ++i)
    {
        LuaListener* cb = &m_listeners[i];
        lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Callback);
        if (lua_equal(L, first, second)){
            lua_pop(L, 1);
            lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Self);
            lua_rawgeti(L, LUA_REGISTRYINDEX, listener->m_Self);

            if (lua_equal(L, second, second + 1)){
              lua_pop(L, 3);
              return i;
            }

            lua_pop(L, 2);
        } else {
            lua_pop(L, 1);
        }
      }
      lua_pop(L, 1);
      
      return -1;
}

bool LuaCallbackContainer::HasCallbacks()
{
    return m_listeners.Size() > 0;
}

void LuaCallbackContainer::SendMessageString(const char* message_id, const char* message)
{
    for(int i = m_listeners.Size() - 1; i >= 0; --i)
    {
        LuaListener* cbk = &m_listeners[i];
        lua_State* L = cbk->m_L;
        int top = lua_gettop(L);

        if (CheckCallbackAndInstance(cbk)) 
        {
            lua_pushstring(L, message_id);
            lua_pushstring(L, message);
            int ret = lua_pcall(L, 3, 0, 0);

            if(ret != 0) {
                dmLogError("Error running callback: %s", lua_tostring(L, -1));
                lua_pop(L, 1);
            }

            if (cbk->m_removeOnCall)
            {
                UnregisterCallback(L, cbk);
            }
        }

        assert(top == lua_gettop(L));
    }
}

void LuaCallbackContainer::SendMessage(const char* message_id)
{
    for(int i = m_listeners.Size() - 1; i >= 0; --i)
    {
        LuaListener* cbk = &m_listeners[i];
        lua_State* L = cbk->m_L;
        int top = lua_gettop(L);

        if (CheckCallbackAndInstance(cbk))
        {
            lua_pushstring(L, message_id);
            
            int ret = lua_pcall(L, 2, 0, 0);
            if(ret != 0) {
                dmLogError("Error running callback: %s", lua_tostring(L, -1));
                lua_pop(L, 1);
            }

            if (cbk->m_removeOnCall)
            {
                UnregisterCallback(L, cbk);
            }
        }
        assert(top == lua_gettop(L));
    }
}

void LuaCallbackContainer::SendMessageFloat(const char* message_id, float value)
{
    for(int i = m_listeners.Size() - 1; i >= 0; --i)
    {
        LuaListener* cbk = &m_listeners[i];
        lua_State* L = cbk->m_L;
        int top = lua_gettop(L);

        if (CheckCallbackAndInstance(cbk)) {
            lua_pushstring(L, message_id);
            lua_pushnumber(L, value);
            
            int ret = lua_pcall(L, 3, 0, 0);
            if(ret != 0) {
                dmLogError("Error running callback: %s", lua_tostring(L, -1));
                lua_pop(L, 1);
            }
            
            if (cbk->m_removeOnCall)
            {
                UnregisterCallback(L, cbk);
            }
        }

        assert(top == lua_gettop(L));
    }
}

void LuaCallbackContainer::SendMessageJsonObject(const char* message_id, const char* objectStr)
{
    for(int i = m_listeners.Size() - 1; i >= 0; --i)
    {
        LuaListener* cbk = &m_listeners[i];
        lua_State* L = cbk->m_L;
        int top = lua_gettop(L);
        bool is_fail = false;

        if (CheckCallbackAndInstance(cbk)) {
            //[-1] - self
            //[-2] - callback
            lua_pushstring(L, message_id);
            //[-1] - message_id
            //[-2] - self
            //[-3] - callback
            dmJson::Document doc;
            dmJson::Result r = dmJson::Parse(objectStr, &doc);
            if (r == dmJson::RESULT_OK && doc.m_NodeCount > 0) 
            {
                char error_str_out[128];
                if (dmScript::JsonToLua(L, &doc, 0, error_str_out, sizeof(error_str_out)) < 0) {
                    dmLogError("Failed converting object JSON to Lua; %s", error_str_out);
                    is_fail = true;
                }
            } else {
                dmLogError("Failed to parse JS object(%d): (%s)", r, objectStr);
                is_fail = true;
            }

            dmJson::Free(&doc);
            if (is_fail) {
                lua_pop(L, 2);
                assert(top == lua_gettop(L));
                return;
            }
            //[-1] - result lua  table
            //[-2] - message_id
            //[-3] - self
            //[-4] - callback

            int ret = lua_pcall(L, 3, 0, 0);
            if(ret != 0) {
                dmLogError("Error running callback: %s", lua_tostring(L, -1));
                lua_pop(L, 1);
            }

            if (cbk->m_removeOnCall)
            {
                UnregisterCallback(L, cbk);
            }
        }
        assert(top == lua_gettop(L));
    }
}

void LuaCallbackContainer::SendMessageBool(const char* message_id, bool value)
{
    for(int i = m_listeners.Size() - 1; i >= 0; --i)
    {
        LuaListener* cbk = &m_listeners[i];
        lua_State* L = cbk->m_L;
        int top = lua_gettop(L);

        if (CheckCallbackAndInstance(cbk)) 
        {
            lua_pushstring(L, message_id);
            lua_pushboolean(L, value);

            int ret = lua_pcall(L, 3, 0, 0);
            if(ret != 0) {
                dmLogError("Error running callback: %s", lua_tostring(L, -1));
                lua_pop(L, 1);
            }

            if (cbk->m_removeOnCall)
            {
                UnregisterCallback(L, cbk);
            }
        }
        assert(top == lua_gettop(L));
    }
}
