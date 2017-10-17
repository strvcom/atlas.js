#!/usr/bin/env node

import 'source-map-support/register'
import caporal from 'caporal'
import cli from '..'

cli(caporal, process.argv)
