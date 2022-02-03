import requests
import re
import json
from bs4 import BeautifulSoup

data = []
res = {}

with open('classes.json', 'r') as infile:
    data = json.loads(infile.read())

for d in data:
    
    key = list(d.keys())[0]
    value = d[key]
    res[key] = value

print(res)

with open('courses.json', 'w') as outfile:
    json.dump(res, outfile)

