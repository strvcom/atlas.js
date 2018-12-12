#!/usr/bin/env node

import 'source-map-support/register'
import * as caporal from 'caporal'
import cli from '..'

cli(caporal, process.argv)
