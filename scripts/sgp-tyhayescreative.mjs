class SGP {
  static ID = 'sgp';
  static MODULE_ID = 'sgp-tyhayescreative';
	
  static FLAGS = {
    SGP: 'SGP',
  }
  
  //static template = require('../template.json')
  
  static template = {
 "Actor": {
   "templates": {
     "creature":{
	   "skills": {
          "cul": {
            "value": 0,
            "ability": "wis",
            "bonuses": {
              "check": "",
              "passive": ""
            }
		  },
          "sci": {
            "value": 0,
            "ability": "int",
            "bonuses": {
              "check": "",
              "passive": ""
            }
          },
          "eng": {
            "value": 0,
            "ability": "int",
            "bonuses": {
              "check": "",
              "passive": ""
            }
          },
          "pil": {
            "value": 0,
            "ability": "dex",
            "bonuses": {
              "check": "",
              "passive": ""
            }
          }
		},
      "attributes": {
		  "moxie": 0,
		  "dp": 2,
	    }
	  }
	}
  }
}
  
  static initialize() {
	 
  }
 
  static log(force, ...args) { 
    const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, '|', ...args);
    }
  }
  
  static get td(){	
		return game.settings.get(this.MODULE_ID, 'td');
  }
}

Hooks.once('init', () => {
  SGP.initialize();
  TensionDie.initialize();
  SGP.log(true, "running sgp.config.initialize()")
  SGPCONFIG.initialize();
  SGP.CONFIG = SGPCONFIG;
  SGP.log(true, "initialised Ty's SGP module");
});