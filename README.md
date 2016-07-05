# ISBN Scanner

This is a Cordova ISBN Scanner app

## Modules

Plugins


The main parts of the template are:

* docs: 

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with  

    mvn clean install -PautoInstallPackage
    
Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish
    
Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

To build a single package

    mvn clean install -PbuildSinglePackage

To install single package on an AEM instance

    mvn clean install -PbuildSinglePackage -PautoInstallSinglePackage
	
## Testing



## Maven settings
