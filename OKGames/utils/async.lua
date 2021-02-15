local M = {}

local RUNNING = 0
local YIELDED = 1
local DONE = 2


local unpack = _G.unpack or table.unpack
function M.async(fn, ...)
	assert(fn)
	local co = coroutine.running()
	assert(co)
	local results = nil
	local state = RUNNING
	fn(function(...)
		results = { ... }
		if state == YIELDED then
			local res, error = coroutine.resume(co)

			if not res then
				print(error)
				debug.traceback()
			end
		else
			state = DONE
		end
	end, ...)
	if state == RUNNING then
		state = YIELDED
		coroutine.yield()

		state = DONE
	end
	return unpack(results)
end

function M.http_request(url, method, headers, post_data, options)
	return M.async(function(done)
		http.request(url, method, function(self, id, response)
			done(response)
		end, headers, post_data, options)
	end)
end

function M.delay(time)
	M.async(function(done)
		timer.delay(time, false, done)
	end)
end

setmetatable(M, {
	__call = function(t, ...)
		return M.async(...)
	end
})

return M
