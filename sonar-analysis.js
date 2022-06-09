
const sonarqubeScanner = require('sonarqube-scanner');
     sonarqubeScanner({
       serverUrl: 'http://qa.tribylcloud.com:9443',
       token : '38ab758e973969fa7d87a21b27732ffbae241ee7',
       options : {
       'sonar.sources': '.',
       'sonar.inclusions' : 'src/**' // Entry point of your code
       }
     }, () => {});
