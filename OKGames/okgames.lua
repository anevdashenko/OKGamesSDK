local Async = require("OKGames.utils.async")
local JSON = require("OKGames.utils.json")

---@type OKGamesSDK
local OKGames = {}

local log = function(...)
end

local okgames_private = OK_games

function OKGames:enable_log(value)
    log =value and pprint or function()end
end

function OKGames:setup_mock(mock)
    okgames_private = okgames_private or mock
end

function OKGames:init(callback)
    okgames_private.init(function(script, message_id, message)
        log("OKGames:init complete", message)
        if message and message.status then
            self.is_init = true

            self._request_parameters = message.request_parameters
        end

        if callback then
            callback(message)
        end
    end)
end


function OKGames:is_authorized()
    return self.is_init
end

function OKGames:init_async()
    return Async.async(function(done)
        self:init(done)
    end)
end

function OKGames:get_request_parameters()
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    return self._request_parameters
end

function OKGames:get_current_player_info(callback)
    log("OKGames:get_current_player_info")

    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    okgames_private.get_current_player(function(script, message_id, message)
        log("get player", message)

        if callback then
            callback(message)
        end
    end)
end

function OKGames:get_current_player_info_async()
    return Async.async(function(done)
        self:get_current_player_info(done)
    end)
end

function OKGames:show_payments(options, complete_callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    assert(options, "options cant be nil")

    local optionsJson = JSON.encode(options)
    okgames_private.show_payment(optionsJson, function(script, message_id, message)
        if message and message.data then
            local status, purchase_data = pcall(JSON.decode, message.data)

            if status then
                message.data = purchase_data
            end
        end

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

function OKGames:load_rewarded_ad(callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    okgames_private.load_rewarded_ad(function(script, message_id, message)
        if callback then
            callback(message)
        end
    end)
end

function OKGames:load_rewarded_ad_async()
    return Async.async(function(done)
        self:load_rewarded_ad(done)
    end)
end

function OKGames:show_rewarded_ad(callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    okgames_private.show_rewarded_ad(function(script, message_id, message)
        if callback then
            callback(message)
        end
    end)
end

function OKGames:show_rewarded_ad_async()
    return Async.async(function(done)
        self:show_rewarded_ad(done)
    end)
end

function OKGames:show_interstitial_ad(callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    okgames_private.show_interstitial_ad(function(script, message_id, message)
        if callback then
            callback(message)
        end
    end)
end

function OKGames:show_interstitial_ad_async()
    return Async.async(function(done)
        self:show_interstitial_ad(done)
    end)
end

function OKGames:show_invite(show_params, callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    assert(show_params)
    local show_params_str = JSON.encode(show_params)
    okgames_private.show_invite(show_params_str, function(script, message_id, message)
        if callback then
            callback(message)
        end
    end)
end

function OKGames:show_invite_async(show_params)
    return Async.async(function(done)
        self:show_invite(show_params, done)
    end)
end

function OKGames:set_window_size(window_size)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    local window_param_str = JSON.encode(window_size)

    okgames_private.set_window_size(window_param_str)
end

function OKGames:get_page_info(callback)
    if not self:is_authorized() then
        error("Call init before accessing sdk api")
    end

    okgames_private.get_page_info(function( script_instance, message_id, message)
        if message and message.data then
            local status, page_info = pcall(json.decode, message.data)
            if status then
                message.data = page_info
            end
        end

        if callback then
            callback(message, script_instance)
        end
    end)
end

function OKGames:get_page_info_async()
    return Async.async(function(done)
        self:get_page_info(done)
    end)
end

return OKGames