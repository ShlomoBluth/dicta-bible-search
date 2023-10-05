Cypress.Commands.add('removeTaamim',()=>{
  cy.get('[class*="text-select f-narkis"]').click({force: true})
})



Cypress.Commands.add('searchRequest',({url,language,status=200,message='',delaySeconds=0})=>{
  cy.intercept('POST', '**'+url+'**', {
    delayMs:1000*delaySeconds,
    statusCode: status
  })
  if(message.length>0){
    cy.contains(message,{timeout:1000*delaySeconds}).should('not.exist')
  }  
  cy.searchRunforReq({text:'בראשית ברא',language:language, delay:true})

  //cy.log(Cypress.config("viewportWidth")).pause()

    
  

  if(Cypress.config("viewportWidth")<600 && !(message.includes('אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר') || 
  message.includes('Oops. Something went wrong Please try again later'))){
    cy.get('#sidebar-btn').click({force:true})
    if(delaySeconds>0){
      cy.get('body').then(($body) => {
        cy.get('[class*="loader"]',{timeout:1000*delaySeconds}).should('not.exist')
        cy.get('.mobile-sidebar-content-div').contains(/Loading|טוען נתונים/g,{timeout:1000*delaySeconds}).should('not.exist')
        
      })
    }
    cy.get('.mobile-sidebar-content-div').contains(message).should('exist')
  }
  else if(message.length>0){
    if(delaySeconds>0){
      cy.get('body').then(($body) => {
        cy.get('[class*="loader"]',{timeout:1000*delaySeconds}).should('not.exist')
        cy.contains(/Loading|טוען נתונים/g,{timeout:1000*delaySeconds}).should('not.exist')
        
      })
    }
    cy.contains(message).should('exist')
  }  

  // if(message.includes('אופס יש לנו בעיה נסו שנית, או בקרו באתר מאוחר יותר') || 
  //   message.includes('Oops. Something went wrong Please try again later')){
  //     cy.contains(message).should('exist')
  // }
  // else if(message.length>0){
  //   cy.get('.mobile-sidebar-content-div').contains(message).should('exist')
  // }
   
})




















