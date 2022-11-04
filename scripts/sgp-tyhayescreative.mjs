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
		  "moxie": {"value": 0, "bonus": 0},
	    },
	  "resources": {
		  "primary": {"value":2,"max":2,"sr":false,"lr":false,"label":"Determination"}
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