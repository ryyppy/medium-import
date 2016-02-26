'use strict';

const fs = require('fs');
const path = require('path');
const medium = require('medium-sdk');
const lodash = require('lodash');

const DOTFILE = path.join(process.env.HOME, '.medium-import-rc');

const cli = require('commander');

cli
  .arguments('<file> <title>')
  .option('-ci, --clientId <clientId>', 'The registered application clientId')
  .option('-cs, --clientSecret <clientSecret>', 'The registered application clientSecret')
  .option('-it, --integrationToken <token>', 'The registered integration token')
  .option('-f, --format <md|html>', 'File content format (md / html)')
  .action(function(file, title) {
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

    main(arg, printExitError);
  })
  .parse(process.argv);

function checkParams(arg) {
  const format = arg.format;

  if(format !== 'md' && format !== 'html'){
    throw new Error(`Unknown format: ${format}`);
  }

  if(!arg.content){
    throw new Error('No content provided! Is file empty?');
  }
  
  if(!arg.clientId){
    throw new Error(`No clientId provided! Maybe check ${DOTFILE}?`);
  }

  if(!arg.clientSecret){
    throw new Error(`No clientSecret provided! Maybe check ${DOTFILE}?`);
  }

  if(!arg.integrationToken){
    throw new Error(`No integrationToken provided! Maybe check ${DOTFILE}?`);
  }
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

function main(arg, onErr){
  try{
    checkParams(arg);
  } catch(err){
    onErr(err);
    return;
  }

  const clientId = arg.clientId;
  const clientSecret = arg.clientSecret;
  const integrationToken = arg.integrationToken;
  const content = arg.content;
  const title = arg.title;
  const format = arg.format;

  var client = new medium.MediumClient({
    clientId,
    clientSecret
  });

  client.setAccessToken(integrationToken);

  client.getUser((err, user) => {
    if(err){
      onErr(err);
      return;
    }

    let contentFormat;

    if(format === 'md') {
      contentFormat = medium.PostContentFormat.MARKDOWN;
    }
    else if(format === 'html') {
      contentFormat = medium.PostContentFormat.HTML;
    }

    console.log('Trying to upload draft... Please wait...');

    client.createPost({
      userId: user.id,
      title,
      contentFormat,
      content,
      publishStatus: medium.PostPublishStatus.DRAFT
    }, (err, post) => {
      if(err){
        onErr(err);
        return;
      }

      console.log('---');
      console.log(`It's done, ${user.username}! See your drafts on https://medium.com/me/stories/drafts`);
    });
  });
}

