# javadoc Generator
[![Version](https://vsmarketplacebadges.dev/version-short/KeeganBruer.javadoc-generator.png)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)
[![Installs](https://vsmarketplacebadges.dev/installs-short/KeeganBruer.javadoc-generator.png)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)

Javadoc Generator is an extension to VSCode that wraps the commandline javadoc compiler. I wrote this in highschool and was originally created to fill my own needs for quickly creating a javadoc. But after over 25k downloads, I decided to rebuild this extension with better error reporting and transparent configuration.  

## Usage
You will first need a JDG Config file. You can get one by clicking on your project folder and clicking "JDG: Initialize Config file". 

<img src="./images/InitalizeConfig.png" alt="InitalizeConfig" style="width:200px;"/>

Adjust the config file until a valid command is generated with no errors. 

<img src="./images/RunGenerator.png" alt="InitalizeConfig" style="width:900px;"/>

You can exclude folders in the specified base_path by adding to the exclude array. This array matches strings directly, using the string prototype's includes() method.

<img src="./images/ExcludeFolders.png" alt="InitalizeConfig" style="width:900px;"/>

Once a valid javadoc command is created, click the button in the top right corner labled "JDG: Generate Javadoc". 

Once the Javadoc generation is complete, you should see the output appended to the config file. 

## Issues
If you find issues, and you probably will, you can report them [here](https://github.com/KeeganBruer/javadoc-generator/issues).
Please include the config.jdgenerator file with your issue report.

## Release Notes

### 3.0.0
- Complete rebuild
- Adds config.jdgenerator for better transparency
- Config validation and error reporting
- Shows the generated Javadoc command in the config.jdgenerator
- Appends Javadoc output to config file for easy submission to [GitHub Issues](https://github.com/KeeganBruer/javadoc-generator/issues)

### 2.1.0
- Normalizes the location of the java project. 
- Removes node_modules from the bundling and download.


### 2.0.0
- New Release Stage with updated response messages and more customizability. 
- Removed Javadoc Generator: System Generator and Javadoc Generator: Built In Generator
    - Replaced with Javadoc Generator: Generate Javadoc


### 1.2.1
- Added back the System Javadoc Generator while keeping the Built In Javadoc Generator.
### 1.2.0
- Changed To Stand Alone, no longer requires Java to be installed.
- Now shipped with the Java 1.8 JDK

### 1.1.1
- Added a git repository

### 1.0.6
- Updated the README.md

### 1.0.1 - 1.0.5
- Added image and description

### 1.0.0
- Initial release of Javadoc Generator



### For more information
Can contact me through Instagram and Twitter @lordbrackets
**Enjoy!**
