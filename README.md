# medium-import

Easy way to import article drafts to your Medium.com account via commandline!
This is very useful if you want to import Markdown formatted drafts more easily.

(Although Medium does support importing Markdown via web-interface, we found out
that this is very tedious and error-prone to do).


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
-p, --publishedAt <23-01-2017>      The optional backdated value - will only work if publishStatus is set to PUBLIC, and not saved as DRAFT.
-s, --publishStatus <PUBLIC|DRAFT>  Status of the post in Medium. Note that published date can only be overwritten when status is PUBLIC

```

The flags `-ci, -cs, -it, -f` will override preconfigured parameters in `$HOME/.medium-import-rc`.
