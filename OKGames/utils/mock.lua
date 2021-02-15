local Mock = {}

Mock.DELAY_TIMEOUT = 0

Mock.result_init = {
    success = true
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

    timer.delay(Mock.DELAY_TIMEOUT, false, function()
        func(unpack(params) )
    end)
end

function Mock.init(callback)
    print("OkGames mock init")
    delay_call(callback, Mock.result_init)
end

function Mock.get_current_player(callback)
    print("OkGames mock get current player")
    delay_call(callback, Mock.result_current_player)
end

function Mock.show_payment( options, callback)
    print("OkGames mock show payment for ", options)

    delay_call(callback, Mock.result_payment)
end

return Mock