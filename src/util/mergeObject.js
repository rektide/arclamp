function mergeObject(stew,pot,clone) {
	// value type
	if(typeof stew != "object")
		return stew
	if(!pot)
	{
		if(clone)
			pot = {}
		else
			return stew
	}
	for(var i in stew) {
		if(typeof stew[i] == "object")
		{
			if(pot[i])
				mergeObject(stew[i],pot[i])
			else
				pot[i] = mergeObject(stew[i],null,clone)
		} else
			pot[i] = stew[i]
	}
	return pot
}

