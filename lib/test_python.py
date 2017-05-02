import sys # this module is used to get the params from cmd
params = sys.argv[1]
value = int(params)
if (value < 20): i = 1
if (value >= 20 and value < 50): i = 2
if (value >= 50): i = 3
print (i)
