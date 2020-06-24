
from jinja2 import Environment, FileSystemLoader
import os

os.system("dot -Tsvg archive.dot -o graph1.svg")

root = os.path.dirname(os.path.abspath(__file__))
env = Environment(loader=FileSystemLoader("."))
template = env.get_template('archive_temp.html')


svg = open("graph1.svg").read()

f = open("archive2.html", "w")

f.write(template.render(svg=svg))


