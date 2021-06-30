
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
---@param callback function @ called when initialization complete with table result as param = {
--- status : boolean,
--- request_parameters : table with request parameters {
--- session_key = "some_session_key",
--  user_gender = "1",
--  new_sig = "1",
--  logged_user_id = "345234234",
--  web_server = "https://ok.ru",
--  container = "true",
--  apiconnection = "asdf23234",
--  first_start = "0",
--  auth_sig = "asdfas23423",
--  session_secret_key = "asdfadsf23234",
--  ip_geo_location = "BY,02,Gomel",
--  user_image = "url_to_user_image",
--  user_name = "Ibragim semen",
--  authorized = "1",
--  application_key = "GDAFA345",
--  api_server = "https://api.ok.ru/",
--  sig = "asdf234",
--  clientLog = "0"
--}
function OKGames:init(callback)
end

---@return bool@ check if sdk authorized
function OKGames:is_authorized()
end

---@return table@ initialize ok games sdk, must be called before accessing other sdk api, return table with result of initialization
function OKGames:init_async()
end

---@return table@ table with request parameters
function OKGames:get_request_parameters()
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

--- @param window_size table @ params for window size = {width : number, height : number}
function OKGames:set_window_size(window_size)
end

--- @param callback function @with results as  { status : boolean, data = {
--- ‘clientWidth’:1000,
--- ’clientHeight’:934,
--- ’scrollLeft’:0,
--- ’scrollTop’:0,
--- ’offsetLeft’:0,
--- ’offsetTop’:76,
--- ’innerHeight’:949,
--- ’innerWidth’:863
--- }
function OKGames:get_page_info(callback)
end

function OKGames:get_page_info_async()
end