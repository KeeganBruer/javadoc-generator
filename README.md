# javadoc Generator
[![Version](https://vsmarketplacebadge.apphb.com/version/KeeganBruer.javadoc-generator.svg)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/KeeganBruer.javadoc-generator.svg)](https://marketplace.visualstudio.com/items?itemName=KeeganBruer.javadoc-generator)

Javadoc Generator is an extension to VSCode that wraps the commandline javadoc compiler. To use just open
any .java file and run the generator. The generator will then scan the rest of the project and generate a javadoc for the project.

## Usage
The simplest way to generate a Javadoc for your project is to JDK that comes with Javadoc-Generator. You can preform this command
by <kbd>CTRL</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and then selecting "Javadoc Generator: Generate Javadoc".

This generator will first attempt to use the Javadoc located in the JDK referenced in your JAVA_HOME.
If it doesn't find a valid JAVA_HOME it will promt the user for a JDK install directory. If the user doesn't have a JDK installed they can use the JDK that comes packages with this extension by entering "Built In".

The user will then be prompted for the source directory in which your java packages are located. If you have the java project open as the root directory of your workspace, you can leave the field blank and use the default java directory of ./src. 

## Issues
If you find issues, and you probably will, you can report them [here](https://github.com/KeeganBruer/javadoc-generator/issues).

## Release Notes
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