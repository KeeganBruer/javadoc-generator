# javadoc Generator
[![Version](https://vsmarketplacebadges.dev/version-short/KeeganBruer.javadoc-generator.png)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)
[![Installs](https://vsmarketplacebadges.dev/installs-short/KeeganBruer.javadoc-generator.png)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)

Javadoc Generator is an extension to VSCode that wraps the commandline javadoc compiler. To use just open
any .java file and run the generator. The generator will then scan the rest of the project and generate a javadoc for the project.

## Disclaimer
This project has not been actively maintained. I plan to rebuild in 2024, so stay tuned if your interested in a complete overhaul to the extension. Get excited for Version 3!
I've graduated university so this rebuild should improve many of the issues that have been reported.

## Usage
You will first need a JDG Config file. You can get one by clicking on your project folder and clicking "JDG: Initialize Config file". Adjust the config file until a valid command is generated with no errors. Once a valid javadoc command is created, click the button in the top right corner labled "JDG: Generate Javadoc". Once the Javadoc generation is complete, you should see the output appended to the config file. 

## Issues
If you find issues, and you probably will, you can report them [here](https://github.com/KeeganBruer/javadoc-generator/issues).
Please include the config.jdgenerator file with your issue report.

## Release Notes
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
