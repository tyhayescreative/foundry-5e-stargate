
class SGPActorSheet extends ActorSheet{
    get template(){
        return `modules/sgp-tyhayescreative/templates/sheets/character-sheet.hbs`;

    }
	
	/** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 875,
            height: 900,
            tabs: [{navSelector: ".tabs", contentSelector: ".sg-sheet-body", initial: "character"}]
        });

        // https://foundryvtt.wiki/en/development/guides/SD-tutorial/SD07-Extending-the-ActorSheet-class
    }
	
	getData(options) {
        let isOwner = this.actor.isOwner;

        const data = {
          owner: isOwner,
          limited: this.actor.limited,
          options: this.options,
          editable: this.isEditable,
          cssClass: isOwner ? "editable" : "locked",
          isCharacter: this.actor.type === "character",
          isNPC: this.actor.type === "npc",
          isGM: game.user.isGM,
          isVehicle: this.actor.type === 'vehicle',
          rollData: this.actor.getRollData.bind(this.actor),
        };

        // The Actor's data
        const actorData = this.actor.data.toObject(false);
        data.actor = actorData;
        data.data = actorData.data;
		data.data.tensionDie = "Not implemented";
        //data.data.tensionDie = game.sgrpg.getTensionDie();

        data.items = actorData.items;
        for ( let iData of data.items ) {
          const item = this.actor.items.get(iData._id);
          iData.hasAmmo = item.consumesAmmunition;
          iData.labels = item.labels;
        }
        data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        //this._prepareItemData(data);
        //this._prepare_proficient_skills(data);

/*
        data.death_success1 = data.data.deathSaves.sucesses > 0;
        data.death_success2 = data.data.deathSaves.sucesses > 1;
        data.death_success3 = data.data.deathSaves.sucesses > 2;

        data.death_failure1 = data.data.deathSaves.fails > 0;
        data.death_failure2 = data.data.deathSaves.fails > 1;
        data.death_failure3 = data.data.deathSaves.fails > 2;
*/
        //data.config = mergeObject(CONFIG.SGRPG, {
		data.config =  mergeObject(CONFIG.DND5E, {
            conditions: {
                normal: "Normal",
                disadvabilitychecks: "Disadv ability checks",
                speedhalved: "Speed halved",
                disadvattackssaves: "Disadv attacks, saves",
                hpmaxhalved: "HP max halved",
                speedzero: "Speed zero",
                death: "Death"
            },
            saves: {
				
				//NOT IMPLEMENTED
			}
        });
		
		
		data.skills = data.data.skills
		for (let s in data.skills){
			data.skills[s].label = CONFIG.DND5E.skills[s]
		}
		
		SGP.log('true', data)
        return data;
    }
	
	static initialize(){
	Actors.registerSheet('dnd5e', SGPActorSheet	, {
		label: 'SGP Character Sheet',
		types: ['character'],
		makeDefault: false,
		});
	}
}

