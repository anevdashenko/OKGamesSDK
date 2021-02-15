local Async = require("OKGames.utils.async")
local JSON = require("OKGames.utils.json")

---@class OKGames
local OKGames = {}

local log = function(...)
end

local okgames_private = OK_games

function OKGames:enable_log()
    log = pprint
end

OKGames:enable_log()

function OKGames:setup_mock(mock)
    okgames_private = okgames_private or mock
end

---@return nil@ initialize ok games sdk, must be called before accessing other sdk api
---@param callback function@ called when initialization complete with table result as param
function OKGames:init(callback)
    okgames_private.init(function(script, message_id, message)
        log("OKGames:init complete")
        pprint(message)
        if message and message.status then
            self.is_init = true
        end

        if callback then
            callback(message)
        end
    end)
end

---@return bool@ check if sdk authorized
function OKGames:is_authorized()
    return self.is_init
end

---@return table@ initialize ok games sdk, must be called before accessing other sdk api, return table with result of initialization
function OKGames:init_async()
    return Async.async(function(done)
        self:init(done)
    end)
end

---@return nil@recieve current player info {name, photo_url}
---@param callback function@ callback called when execution complete, with table contain player info
function OKGames:get_current_player_info(callback)
    log("OKGames:get_current_player_info")

    okgames_private.get_current_player(function(script, message_id, message)
        pprint("get player", message)

        if callback then
            callback(message)
        end
    end)
end

---@return table@recieve current player info {name, photo_url}
function OKGames:get_current_player_info_async()
    return Async.async(function(done)
        self:get_current_player_info(done)
    end)
end

---@return nil @show payment dialog,
---@param options table @with options = {
---name = purchase_name[required],
---description = purchase_description[required],
---code = purchaes_code[required],
---price = purchase_price[required],
---attributes = attributes[optional], json encoded table sended to server
---uiConf = uiConf[optional]
---@param complete_callback function@ callback
function OKGames:show_payments(options, complete_callback)
    assert(options, "options cant be nil")

    local optionsJson = JSON.encode(options)
    okgames_private.show_payment(optionsJson, function(script, message_id, message)
        if complete_callback then
            complete_callback(message)
        end
    end)
end

function OKGames:show_payments_async(options)
    return Async.async(function(done)
        self:show_payments(options, done)
    end)
end

return OKGames