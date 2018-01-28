#!/bin/python3

import sys, json

if __name__ == "__main__":
  data_obj = json.loads(sys.argv[1])

  times = len(data_obj)
  print("Python received data for {} timestamps".format(times))