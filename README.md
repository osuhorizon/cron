# cron
The osu!Horizon cron currently being used for ripple - **Refactored** woo!!

# Setup
knowledge of linux and nodejs will certainly help, but are by no means required.
(this is really not hard)\n
the only requirement for using this is having nodejs installed
## -> Download code 

```sh
# clone the repository
git clone https://github.com/osuhorizon/cron

# enter the folder
cd cron
```

## -> Edit config file

```sh
# feel free to use a text editor here but we are using nano
nano config.js

# every module is documented in config
# what you need to change is the database configuration and 
# deactivate everything that you don't need (ex. v2 or AutoPilot)
# once you are done just CTRL + X out of nano
```

## -> Install modules

```sh
# you need to install the node_modules with npm
npm install
```

## -> Run the code

```sh
# sweet, all you have to do now is run the code.
# the cron automatically re-runs every hour. You can change that in the source code.
node cron
```

This got tested with node v16.10.0 & npm v8 on Ubuntu 18.04\n
If there is anything wrong feel free to hit up Lemres#0001 on Discord.
