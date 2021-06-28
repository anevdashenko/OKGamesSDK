local Mock = {}

local DUMMY = {}
Mock.DELAY_TIMEOUT = 0


Mock.result_init = {
    status = true
}

Mock.result_current_player = {
    name = "Petr",
    photo = ""
}

Mock.result_payment = {
    status = false
}

local function delay_call(func, ...)
    if not func then
        return
    end

    local params = {...}
    local a, b, c = unpack(params)
    timer.delay(Mock.DELAY_TIMEOUT, false, function()
        func(unpack(params))
    end)
end

function Mock.init(callback)
    print("OkGames mock init")
    delay_call(callback, DUMMY, DUMMY, Mock.result_init)
end

function Mock.get_current_player(callback)
    print("OkGames mock get current player")
    delay_call(callback, DUMMY, DUMMY, Mock.result_current_player)
end

function Mock.show_payment( options, callback)
    print("OkGames mock show payment for ", options)

    delay_call(callback, DUMMY, DUMMY, Mock.result_payment)
end

function Mock.load_rewarded_ad(callback)

    delay_call(callback, DUMMY, DUMMY, Mock.result_payment)
end

function Mock.show_rewarded_ad(callback)

    delay_call(callback, DUMMY, DUMMY, Mock.result_payment)
end

function Mock.show_interstitial_ad(callback)

    delay_call(callback, DUMMY, DUMMY, Mock.result_payment)
end

function Mock.show_invite(options,  callback )
    delay_call(callback, DUMMY, DUMMY, Mock.result_payment)
end

return Mock