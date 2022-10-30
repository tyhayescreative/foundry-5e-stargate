class SGP {
  static ID = 'sgp';
  static MODULE_ID = 'sgp-tyhayescreative';
	
  static FLAGS = {
    SGP: 'SGP',
  }
  
  static template = require('../template.json')
  
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
  SGP.CONFIG.initialize();
  SGP.log(true, "initialised Ty's SGP module");
});