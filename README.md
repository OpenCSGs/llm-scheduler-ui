# LLM scheduler UI

## Overview

LLM scheduler UI is an open source web interface to LLM jobs. the scheduler engine is using [Slurm](https://slurm.schedmd.com/) as default engine
It performs large model jobs scheduling based on GPU resources.

## Prerequisite

please setup scheduler API fisrtly [llm-scheduler-api](https://github.com/OpenCSGs/llm-scheduler-api)
then configure the environment variable in .env

<video src="https://github.com/ganisback/video/blob/9d332ed1b526498e615a533deb43f2450aaa4d06/demo.mp4" width="800px" height="600px" controls="controls"></video>


## Quick Start
1. install dependency
```bash
npm install yarn -g
yarn install
```
2. install dependency
```bash
yarn start
```
