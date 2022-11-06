/*

*/

async function CreateSGPActor(name, stats = undefined){

	let actor = Actor.create({
		name: name,
		type: "character",
		img: "icons/svg/mystery-man.svg"
		})
		.then((actor) => {
			
			if (stats){
				for (stat in stats){
					actor.data.data.abilities[stat].value = stats[stat]
					//let path = `data.abilities.${stat}.value`
					//console.log(path)
					//actor.update({path : stats[stat]})
				}
			
				actor.prepareDerivedData()
			}

		return actor}
		)
	return actor
}



//let actor10s = CreateSGPActor("Test no stats")
//let actorStats = CreateSGPActor("Test with stats", {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20})
//actor10s.then((result) => result.delete())
//actor10Stats.then((result) => result.delete())


Hooks.on("quenchReady", (quench) => {
  quench.registerBatch(
    "sgp.actor",
    (context) => {
      const { describe, it, assert, expect } = context;

	  /* describe runs the code to register the tests. it happens without regard to running them
	     the individual tests won't register properly if an exception is thrown outside
		 an it() function, so keep all the code actually under test in it 
		 
		 first param is a title for the test suite
	  */
      describe("Test Actor creation", async function () {
		/*  
			it() as an individual test
			first param is the name for the individual test
		*/
			
			let testActor;
			
			after(() => testActor.then((actor) => actor.delete() ))
			
			it("Create actor", async function () {
			
				testActor =  CreateSGPActor("Test with stats", {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20})
				
				console.log(testActor)
									
		});
				
      });
		
		describe("Test Actor data", async function () {
			/*  
				it() as an individual test
				first param is the name for the individual test
			*/
			let testActor;
			let statsArray = {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20}
			
			before(() => testActor = CreateSGPActor("Test with stats", statsArray) )
			after(() => testActor.then((actor) => actor.delete() ))


			it("Check stats", async function () {
			
				let actor = await testActor
											
											/* actual test code goes here */
											/* if an exception is raised, the test fails automatically */
											/* tests seem to pass by default */
					for (let stat in statsArray ){
						expect(actor.data.data.abilities[stat].value).to.equal(statsArray[stat])	
					}

			});
				
			it("Verify stats", async function () {
			
				let modsArray = {'str': -1, 'dex': 1, 'con': 2, 'int': 3, 'wis': 4, 'cha': 5}
				
				let actor = await testActor

				expect(actor.data.data.abilities.str.value).to.not.equal(11)	

				for (let stat in modsArray ){
					expect(actor.data.data.abilities[stat].mod).to.equal(modsArray[stat])	
					}
				
			})
				

		
		describe("Check SGP skills", async function () {
			/*  
				it() as an individual test
				first param is the name for the individual test
			*/
			let testActor;
			let statsArray = {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20}
			
			before(() => testActor = CreateSGPActor("Test with stats", statsArray) )
			after(() => testActor.then((actor) => actor.delete() ))

			let skillsArray = {'sci': 3, 'eng': 3, 'cul': 4, 'pil': 1}
				
			for (let skill in skillsArray ){
				
				it(`${skill} total`, async function () {
			
				let actor = await testActor
											
				for (let skill in skillsArray ){
					console.log(skill)
					expect(actor.data.data.skills[skill].total).to.equal(skillsArray[skill])	
				}
			});
			}
		});;	
	});;
	},
	/* displayName is the text shown for the test group */
    { displayName: "SGP: Actor Basics" }
  );	  
});