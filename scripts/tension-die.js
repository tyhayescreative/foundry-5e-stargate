class TensionDie{

 static initialize(){
	//await 
	game.settings.register(SGP.MODULE_ID, 'td', {
	  name: 'Tension Die',
	  hint: 'The tension die for the current epsiode.',
	  scope: 'world',     // "world" = sync to db, "client" = local storage
	  config: true,       // false if you dont want it to show in module config
	  type: Number,       // Number, Boolean, String,
	  default: "6",
	  choices: {
		 "4": "d4",
		 "6": "d6",
		 "8": "d8",
		 "10": "d10", 
		 "12": "d12",
	  },
	  onChange: value => { // value is the new value of the setting
		console.log(`Tension die set to ${value}`)
	  },
	});
	
	
	libWrapper.register(SGP.MODULE_ID, 'Roll._classifyStringTerm', function(wrapped, ...args) {

	//static _classifyStringTerm(term, {intermediate=true, prior, next}={}) {

	SGP.log("called the monkeypatched classifyStringTerm")
	
	let term = args[0]
	
    // Terms already classified
    if ( term instanceof RollTerm ) return term;

	//TensionDiceTerm
	const tensionDiceMatch = TensionDiceTerm.matchTerm(term, {});
    if ( tensionDiceMatch ) {
      return TensionDiceTerm.fromMatch(tensionDiceMatch);
    }

	return wrapped(...args);

  }, 'MIXED');

 }
 
}

class TensionDiceTerm extends DiceTerm {

  get expression() {
	 return `${this.number}d${this.faces}${this.modifiers.join("")}`;

  }
  
  static REGEXP = new RegExp(`^([0-9]+)?[tT][dD]${DiceTerm.MODIFIERS_REGEXP_STRING}?${DiceTerm.FLAVOR_REGEXP_STRING}?$`);


 static matchTerm(expression, {imputeNumber=true}={}) {
    const match = expression.match(this.REGEXP);
    if ( !match ) return null;
    return match;
  }

  static fromMatch(match) {
    let [number, modifiers, flavor] = match.slice(1);

    // Get the denomination of DiceTerm
    const denomination = SGP.td;
    const cls = denomination in CONFIG.Dice.terms ? CONFIG.Dice.terms[denomination] : CONFIG.Dice.terms.d;
    if ( !foundry.utils.isSubclass(cls, DiceTerm) ) {
      throw new Error(`DiceTerm denomination ${denomination} not registered to CONFIG.Dice.terms as a valid DiceTerm class`);
    }

    // Get the term arguments
    number = Number.isNumeric(number) ? parseInt(number) : 1;
    const faces = Number.isNumeric(denomination) ? parseInt(denomination) : null;

    // Match modifiers
    modifiers = Array.from((modifiers || "").matchAll(DiceTerm.MODIFIER_REGEXP)).map(m => m[0]);

    // Construct a term of the appropriate denomination
    return new TensionDiceTerm({number, faces, modifiers, options: {flavor}});
  }
  
  
  
}

