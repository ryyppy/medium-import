'use strict';

const medium = require('medium-sdk');

function checkParams(arg) {
  const format = arg.format;

  if(format !== 'md' && format !== 'html'){
    throw new Error(`Unknown format: ${format}`);
  }

  if(!arg.content){
    throw new Error('No content provided!');
  }

  if(!arg.clientId){
    throw new Error('No clientId provided!');
  }

  if(!arg.clientSecret){
    throw new Error('No clientSecret provided!');
  }

  if(!arg.integrationToken){
    throw new Error('No integrationToken provided!');
  }
}

function mediumImport(arg, onErr) {
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

module.exports = mediumImport;
