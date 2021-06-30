

--- @class MockOKGameSDK
--- @field DELAY_TIMEOUT number @ delay for dummy callbacks, simulate async work
--- @field result_init MockOKGameSDKResult
--- @field result_current_player MockOKGameSDKPlayerData
--- @field result_payment MockOKGameSDKResult
local Mock = {}

--- @class MockOKGameSDKResult
--- @field status boolean
--- @field result string
--- @field data data
local MockResultInit = {
}

--- @class MockOKGameSDKPlayerData
--- @field name string
--- @field photo string @ photo url
local MockPlayerData = {
}

function Mock.init(callback)
end

function Mock.get_current_player(callback)
end

function Mock.show_payment( options, callback)
end

function Mock.load_rewarded_ad(callback)
end

function Mock.show_rewarded_ad(callback)
end

function Mock.show_interstitial_ad(callback)
end

function Mock.show_invite(options,  callback )
end

return Mock