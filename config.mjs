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

	/*
	*/

	/* 
	base dnd5e skills that are not actually needed
	- don't actually do this yet in case it breaks things
	*/

	static skillsToRemove = ["arc","his","rel"]


	/* 

	*/

   static initialize  = function(){

	/*libWrapper.register(SGP.MODULE_ID, 'game.dnd5e.entities.Actor5e.prototype.prepareBaseData', function (wrapped, ...args) {

		//let CONFIG = game.dnd5e.config
		const result = wrapped(...args); // remember to call the original (wrapped) method
		console.log('game.dnd5e.entities.Actor5e.prototype.prepareBaseData was called with', ...args);
		console.log(this)	
		const skills = this.actor.system.skills;
		for ( const [key, skill] of Object.entries(game.dnd5e.config.DND5E.skills) ) {
		  skills[key] = this.actor.system.skills[key];
		  if ( !skills[key] ) {
			skills[key] = foundry.utils.deepClone(game.system.template.Actor.templates.creature.skills.acr);
			skills[key].ability = skill.ability;
			updates[`system.skills.${key}`] = foundry.utils.deepClone(skills[key]);
		  }
		}
		this.actor.system.skills = skills;
		
		return result; // this return needs to have the same shape (signature) as the original, or things start breaking
	});*/


	for (const key in SGPCONFIG.additionalSkills){
		CONFIG.DND5E.skills[key] = game.i18n.localize(SGPCONFIG.additionalSkills[key].label)
	}

	//preLocalize("skills", { key: "label", sort: true });
	
	for (const key in SGP.template.Actor.templates.creature.skills){
		SGP.log(true, `adding data ${SGPCONFIG.additionalSkills[key]} as ${key}`)

		game.system.template.Actor.templates.creature.skills[key] = SGP.template.Actor.templates.creature.skills[key]
		
		//this looks shoddy and should probably be done at a higher level, because it makes the above redundant
		game.system.model.Actor.character.skills[key] = SGP.template.Actor.templates.creature.skills[key]
	}
	
  }
}
