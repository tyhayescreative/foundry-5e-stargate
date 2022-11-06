/*

*/

async function CreateSGPActor(name, stats = undefined){

	let actor = await Actor.create({
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
      describe("Test Actor creation", function () {
		/*  
			it() as an individual test
			first param is the name for the individual test
		*/
			it("Create actor", async function () {
			
				await CreateSGPActor("Test with stats", {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20})
									.then((actor) => {
														
										/* actual test code goes here */
										/* if an exception is raised, the test fails automatically */
										/* tests seem to pass by default */
										//assert.ok(true);
								
									return actor	
									})
									
									/* remember to clean up*/
									.then((actor) => actor.delete())
			});
		
		describe("Test Actor data", function () {
			/*  
				it() as an individual test
				first param is the name for the individual test
			*/
			
			it("Check stats", async function () {
			
				let statsArray = {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20}
				
				await CreateSGPActor("Test with stats", statsArray)
										.then((actor) => {
											
											/* actual test code goes here */
											/* if an exception is raised, the test fails automatically */
											/* tests seem to pass by default */
											for (let stat in statsArray ){
												expect(actor.data.data.abilities[stat].value).to.equal(statsArray[stat])	
											}
											return actor
										})
										
										/* remember to clean up*/
										.then((actor) => actor.delete())
				});
				
			it("Verify stats", async function () {
			
				let statsArray = {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20}
				let modsArray = {'str': -1, 'dex': 1, 'con': 2, 'int': 3, 'wis': 4, 'cha': 5}
				await CreateSGPActor("Test with stats", statsArray)
										.then((actor) => {
											
											/* actual test code goes here */
											/* if an exception is raised, the test fails automatically */
											/* tests seem to pass by default */
											expect(actor.data.data.abilities.str.value).to.not.equal(11)	

											return actor
										})
										.then((actor) => {
											for (let stat in modsArray ){
												expect(actor.data.data.abilities[stat].mod).to.equal(modsArray[stat])	
											}
											return actor
										})
										/* remember to clean up*/
										.then((actor) => actor.delete())
				});
			
			it("Check skills", async function () {
			
				let statsArray = {'str': 8, 'dex': 12, 'con': 14, 'int': 16, 'wis': 18, 'cha': 20}
				let skillsArray = {'sci': 3, 'eng': 3, 'cul': 4, 'pil': 1}

				await CreateSGPActor("Test with stats", statsArray)
										.then((actor) => {
											
											/* actual test code goes here */
											/* if an exception is raised, the test fails automatically */
											/* tests seem to pass by default */
											
											for (let skill in skillsArray ){
												console.log(skill)
												expect(actor.data.data.skills[skill].total).to.equal(skillsArray[skill])	
											}
											return actor
										})
										
										/* remember to clean up*/
										.then((actor) => actor.delete())
				});
		});;
      });
	},
	/* displayName is the text shown for the test group */
    { displayName: "SGP: Actor Basics" }
  );	  
});