# node-imessage-codes

This simple node script watches for changes to the iMessage database, and if it detects a new 2-factor code, will copy it into your clipboard.

Usage:
```
git clone git@github.com:mikeyk/node-imessage-codes.git
npm install 
node index.mjs
```

### Troubleshooting

* If you hit an error with the script opening the SQLite file, [please enable Full Disk Access for Terminal/iTerm in your Settings](https://osxdaily.com/2018/10/09/fix-operation-not-permitted-terminal-error-macos/). Thanks to [Julian Liederer](https://github.com/JulianLiederer) for the pointer.
