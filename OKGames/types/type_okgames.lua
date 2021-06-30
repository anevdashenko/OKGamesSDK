
---@class OKGamesSDK
local OKGames = {}

--- @param value boolean
--- @return nil @ enables simple print log
function OKGames:enable_log(value)
end


--- @param mock table
--- @return nil @ setup mock table for testing if platform not available
function OKGames:setup_mock(mock)
end

---@return nil@ initialize ok games sdk, must be called before accessing other sdk api
---@param callback function @ called when initialization complete with table result as param
function OKGames:init(callback)
end

---@return bool@ check if sdk authorized
function OKGames:is_authorized()
end

---@return table@ initialize ok games sdk, must be called before accessing other sdk api, return table with result of initialization
function OKGames:init_async()
end

---@return nil@recieve current player info {name, photo_url}
---@param callback function@ callback called when execution complete, with table contain player info
function OKGames:get_current_player_info(callback)
end

---@return table@recieve current player info async {name, photo_url}
function OKGames:get_current_player_info_async()
 
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
---callback recieve table result = {
--- status = bool status of purchase
--- result = string code of purchase result
--- data = table with purchase result, example data = { amount = 100 }

function OKGames:show_payments(options, complete_callback)
end


--- @param options table @with options = {
---name = purchase_name[required],
---description = purchase_description[required],
---code = purchaes_code[required],
---price = purchase_price[required],
---attributes = attributes[optional], json encoded table sended to server
---uiConf = uiConf[optional]
--- @return table @result of payment dialog as table result = {
--- status = bool status of purchase
--- result = string code of purchase result
--- data = table with purchase result, example data = { amount = 100 }
function OKGames:show_payments_async(options)
end

--- @param callback function @ function called when rewarded ad loaded
--- with result table result = {  status : boolean, message : string, data : string}
function OKGames:load_rewarded_ad(callback)
end

function OKGames:load_rewarded_ad_async()
end

--- @param callback function @ function called when rewarded ad show complete
--- with result table result = { status : bool, data : string [complete| not_prepared | mp4_not_supported]}
function OKGames:show_rewarded_ad(callback)

end

function OKGames:show_rewarded_ad_async()
end


--- @param callback function @ function called for interstitial callback when interstitial completed show
--- with result table result = { status : bool, result : string [ok | error], data : string}
function OKGames:show_interstitial_ad(callback)
end

function OKGames:show_interstitial_ad_async()

end

--https://apiok.ru/dev/sdk/js/ui.showInvite/
--- @param show_params table @ options for show invite = {
--- text - string, text for show for invite, 
--- params - string with params that invite user resieve from invite arg1=val1,
--- selected_uids - ids of user will be selected}
--- @param callback function @ callback invite friend with result = {
--- { status : bool, result : string [ok | error | cancel], data : string [null | cancel | 1234567890,1234567891]}
--- }
function OKGames:show_invite(show_params, callback)
end

function OKGames:show_invite_async(show_params)
end
