import subprocess
import json

map_file="tests/test_map.ccp4"
pdb_file="tests/test_model.pdb"

def emringer(mapfile, pdbfile):
  output = subprocess.Popen(["/usr/local/phenix-1.10pre-2124/build/bin/phenix.python", "emringerweb/main/emringer_analysis.py", pdbfile, mapfile], stdout=subprocess.PIPE).communicate()
  # results = json.load(output)
  print output[0]
  return "please help me!"

print emringer(map_file, pdb_file)

