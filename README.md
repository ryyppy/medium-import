# medium-import

Easy way to import article drafts to your Medium.com account.
This module was written because we had a hard time import articles efficiently.


## Prerequesites

- Requires NodeJS v4 or higher

## Install

```
npm install -g medium-import
```

## How to use

Before usage, you need to create application access tokens (clientId, clientSecret) and an integration token in your Medium account settings.
To prevent retyping this information in the cli, just add following JSON config in your `$HOME/.medium-import-rc`:

```javascript
{
    "clientId": "CLIENT-ID",
    "clientSecret": "CLIENT-SECRET",
    "integrationToken": "INTEGRATION-TOKEN",
    "format": "md"
}
```

**Commandline:**

```
Usage: medium-import [options] <file> <title>

Options:

-h, --help                          output usage information
-ci, --clientId <clientId>          The registered application clientId
-cs, --clientSecret <clientSecret>  The registered application clientSecret
-it, --integrationToken <token>     The registered integration token
-f, --format <md|html>              File content format (markdown / html)

```

The flags `-ci, -cs, -it, -f` will override preconfigured parameters in `$HOME/.medium-import-rc`. 
