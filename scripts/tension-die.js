class TensionDie{

 static initialize(){
	//await 
	game.settings.register(SGP.MODULE_ID, 'td', {
	  name: 'Tension Die',
	  hint: 'The tension die for the current epsiode.',
	  scope: 'world',     // "world" = sync to db, "client" = local storage
	  config: true,       // false if you dont want it to show in module config
	  type: String,       // Number, Boolean, String,
	  default: "d6",
	  choices: {
		 "d4": "d4",
		 "d6": "d6",
		 "d8": "d8",
		 "d10": "d10", 
		 "d12": "d12",
	  },
	  onChange: value => { // value is the new value of the setting
		console.log(`Tension die set to ${value}`)
	  },
	});

 }
 
}