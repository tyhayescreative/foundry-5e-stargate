//import { preLocalize } from "./utils.mjs";

/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/*  adapted from dnd5e offical source           */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKey              Key within `CONFIG.DND5E` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
function preLocalize(configKey, { key, keys=[], sort=false }={}) {
  if ( key ) keys.unshift(key);
  _preLocalizationRegistrations[configKey] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.DND5E` object to localize and sort. *Will be mutated.*
 */
function performPreLocalization(config) {
  for ( const [key, settings] of Object.entries(_preLocalizationRegistrations) ) {
    _localizeObject(config[key], settings.keys);
    if ( settings.sort ) config[key] = sortObjectEntries(config[key], settings.keys[0]);
  }
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject(obj, keys) {
  for ( const [k, v] of Object.entries(obj) ) {
    const type = typeof v;
    if ( type === "string" ) {
      obj[k] = game.i18n.localize(v);
      continue;
    }

    if ( type !== "object" ) {
      console.error(new Error(
        `Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
      ));
      continue;
    }
    if ( !keys?.length ) {
      console.error(new Error(
        "Localization keys must be provided for pre-localizing when target is an object."
      ));
      continue;
    }

    for ( const key of keys ) {
      if ( !v[key] ) continue;
      v[key] = game.i18n.localize(v[key]);
    }
  }
}


class SGPCONFIG {

	/*
	Add the aditional skills to DND5E.skills  in config.mjs  - called as CONFIG.DND5E.skills
	
	These skills have defaults defined in /template.json
	and are added to during the init hook below
	game.system.template.Actor.templates.common.skills

	*/

	static additionalSkills = {
	  sci: { label: "SGP.SkillSci", ability: "int" },
	  eng: { label: "SGP.SkillEng", ability: "int" },
	  cul: { label: "SGP.SkillCul", ability: "wis" },
	  pil: { label: "SGP.SkillPil", ability: "dex" }
	};

	static additionalAttributes = {
	  "moxie": 0,
	  "dp": 2
	}
	/*
	*/

	/* 
	base dnd5e skills that are not actually needed
	- don't actually do this yet in case it breaks things
	*/

	static skillsToRemove = ["arc","his","rel"]

  /* -------------------------------------------- */

	  /**
	   * Convert a bonus value to a simple integer for displaying on the sheet - copied verbatim from foundryvtt dnd5e system
	   * @param {number|string|null} bonus  Actor's bonus value.
	   * @param {object} data               Actor data to use for replacing @ strings.
	   * @returns {number}                  Simplified bonus as an integer.
	   * @protected
	   */
	   
	   
	   
	static _simplifyBonus(bonus, data) {
		if ( !bonus ) return 0;
		if ( Number.isNumeric(bonus) ) return Number(bonus);
		try {
		  const roll = new Roll(bonus, data);
		  if ( !roll.isDeterministic ) return 0;
		  roll.evaluate({ async: false });
		  return roll.total;
		} catch(error) {
		  console.error(error);
		  return 0;
		}
	  }

	/*
		Calculate the derived property moxie bonus and 
		add it into the actorData
		@param {ActorData} Copy of the data for the actor being prepared. *Will be mutated.*
		TODO: This should probably match the signature of Actor5e._calculateInitBonus and take
		arguments for checkBonus and bonusData, but I don't need them right now
	*/
	static prepareMoxie(actorData, globalCheckBonus, bonusData){
				
		const data = actorData.data;
		const flags = actorData.flags.dnd5e || {};
		const ablCheckBonus = data.abilities.wis.mod > data.abilities.cha.mod ? this._simplifyBonus(data.abilities.wis.bonuses?.check, bonusData) : this._simplifyBonus(data.abilities.cha.bonuses?.check, bonusData);
		
		const moxie = data.attributes.moxie
		
		moxie.mod = Math.max(data.abilities.wis.mod, data.abilities.cha.mod)
		moxie.prof = 0 // new Proficiency(data.attributes.prof, 0, true)  //but can't import proficiency. Base d5d initiative line is  new Proficiency(data.attributes.prof, (joat || athlete) ? 0.5 : 0, !athlete);
		
		moxie.value = moxie.value ?? 0
		moxie.bonus = moxie.value // any feats that add to it
		moxie.total = moxie.mod + moxie.bonus + ablCheckBonus + globalCheckBonus
		if (Number.isNumeric(moxie.prof.term) ) moxie.total += moxie.prof.flat
		
	}

	/*
		Ensure Determination Points exist in the actor data
		@param {ActorData} Copy of the data for the actor being prepared. *Will be mutated.*
		TODO: This should probably match the signature of Actor5e._calculateInitBonus and take
		arguments for checkBonus and bonusData, but I don't need them right now
	*/

	static prepareDetermination(actorData){
		let data = actorData.data
		for (const key in SGP.template.Actor.templates.creature.resources){
			SGP.log(true, `adding ${key} as resource`)
		
			if (!data.hasOwnProperty('resources')){
				game.system.template.Actor.templates.common.resources = {}
			}
			if (!data.resources.hasOwnProperty(key)){
				data.resources[key] = {}
			}
			if (data.resources[key].value == null){
				data.resources[key] = SGP.template.Actor.templates.creature.resources[key]
			}
		}	
	}
	/* 
	
	Modify the parts of the base 5e system that need tweaking on init
	(called via a hook from the main module script)
	*/

   static initialize  = function(){

	libWrapper.register(SGP.MODULE_ID, 'game.dnd5e.entities.Actor5e.prototype.prepareDerivedData', function (wrapped, ...args) {

		//let CONFIG = game.dnd5e.config
		const result = wrapped(...args); // remember to call the original (wrapped) method
		console.log('game.dnd5e.entities.Actor5e.prototype.prepareBaseData was called with', ...args);
		
			
		const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
		
		const bonusData = this.getRollData();
		const checkBonus = SGPCONFIG._simplifyBonus(bonuses.check, bonusData);
		 
		SGPCONFIG.prepareMoxie(this.data, checkBonus, bonusData)
		SGPCONFIG.prepareDetermination(this.data)
	});


	for (const key in SGPCONFIG.additionalSkills){
		CONFIG.DND5E.skills[key] = game.i18n.localize(SGPCONFIG.additionalSkills[key].label)
	}

	//preLocalize("skills", { key: "label", sort: true });
	
	for (const key in SGP.template.Actor.templates.creature.skills){
		SGP.log(true, `adding ${key} as skill`)
		
		game.system.template.Actor.templates.creature.skills[key] = SGP.template.Actor.templates.creature.skills[key]
		
		//this looks shoddy and should probably be done at a higher level, because it makes the above redundant
		game.system.model.Actor.character.skills[key] = SGP.template.Actor.templates.creature.skills[key]
	}
	
	for (const key in SGP.template.Actor.templates.creature.attributes){
		SGP.log(true, `adding ${key} as attribute`)
		
		game.system.template.Actor.templates.creature.attributes[key] = SGP.template.Actor.templates.creature.attributes[key]
		
		//this looks shoddy and should probably be done at a higher level, because it makes the above redundant
		game.system.model.Actor.character.attributes[key] = SGP.template.Actor.templates.creature.attributes[key]
	}
	
	for (const key in SGP.template.Actor.templates.creature.resources){
		SGP.log(true, `adding ${key} as resource`)
		
		if (!game.system.template.Actor.templates.common.hasOwnProperty('resources')){
			game.system.template.Actor.templates.common.resources = {}
		}
		game.system.template.Actor.templates.common.resources[key] = SGP.template.Actor.templates.creature.resources[key]
		
		//this looks shoddy and should probably be done at a higher level, because it makes the above redundant
		game.system.model.Actor.character.resources[key] = SGP.template.Actor.templates.creature.resources[key]
	}	
  }
}
