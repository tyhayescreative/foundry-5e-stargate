
class SGPActorSheet extends ActorSheet{
    get template(){
        return `modules/sgp-tyhayescreative/templates/sheets/character-sheet.hbs`;

    }
	
	static initialize(){
	Actors.registerSheet('dnd5e', SGPActorSheet	, {
		label: 'SGP Character Sheet',
		types: ['character'],
		makeDefault: false,
		});
	}
}

