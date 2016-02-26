#! /usr/bin/env node --harmony
'use strict';

const currentVersion = require('./package').version;
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const mediumImport = require('./lib/mediumImport');

const DOTFILE = path.join(process.env.HOME, '.medium-import-rc');

const cli = require('commander');

let noOp = true;

cli
  .version(currentVersion)
  .arguments('<file> <title>')
  .option('-ci, --clientId <clientId>', 'The registered application clientId')
  .option('-cs, --clientSecret <clientSecret>', 'The registered application clientSecret')
  .option('-it, --integrationToken <token>', 'The registered integration token')
  .option('-f, --format <md|html>', 'File content format (md / html)')
  .action(function(file, title) {
    noOp = false;

    if(!doesFileExist(file)){
      printExitError(new Error(`Failed to read file: '${file}'`));
    }

    const content = fs.readFileSync(file, 'utf-8');

    let isUsingConfig = doesFileExist(DOTFILE);
    let config;

    if(isUsingConfig){
      config = fs.readFileSync(DOTFILE, 'utf-8');

      if(config){
        try{
          config = JSON.parse(config);
        }catch(e){
          printExitError(new Error(`Config file '${DOTFILE}' malformed... ignored.`));
        }
      }
    }

    const arg =  lodash.defaults({}, {
      clientId: cli.clientId,
      clientSecret: cli.clientSecret,
      integrationToken: cli.integrationToken,
      format: cli.format,
      content,
      title
    }, config);

    printRunInfo({
      format: arg.format,
      title,
      file,
      isUsingConfig
    });

    mediumImport(arg, printExitError);
  })
  .parse(process.argv);

if(noOp){
  console.log('Invalid arguments!');
  cli.outputHelp();
}

function printRunInfo(arg){
  const format = arg.format;
  const title = arg.title;
  const file = arg.file;
  const isUsingConfig = arg.isUsingConfig;

  console.log('---');
  console.log('Running medium-uploader with following options:');
  if(isUsingConfig){
    console.log(`Config-File used: ${isUsingConfig}`);
  }
  console.log(`Title: '${title}'`);
  console.log(`Format: '${format}'`);
  console.log(`File: '${file}'`);
  console.log('---');
}

function doesFileExist(file){
  const stats = fs.lstatSync(file);

  if(stats.isFile()){
    return true;
  }

  return false;
}

function printExitError(err){
  console.error('Error occurred:');
  console.error(err);
  process.exit(1);
}
