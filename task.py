import subprocess
from subprocess import check_output
import json

map_file="tests/test_map.ccp4"
pdb_file="tests/test_model.pdb"

def emringer(mapfile, pdbfile):
    output = check_output(["/usr/local/phenix-1.10pre-2124/build/bin/cctbx.python", "emringerweb/main/emringer_analysis.py", pdbfile, mapfile], shell=True)
    results = json.load(output)
    print results
    return "please help me!"

emringer(map_file, pdb_file)

