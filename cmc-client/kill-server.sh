#!/bin/bash
server_pid=$(pgrep -f './.venv/bin/python3 server.py')
kill "$server_pid"
