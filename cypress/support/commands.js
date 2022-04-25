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

  
  if(delaySeconds>0){    
    if(url.includes('textAnalysis')){
      cy.contains(message,{timeout:1000*delaySeconds}).should('exist')
    }
    cy.get('body').then(($body) => {
      cy.get('[class*="loader"]',{timeout:1000*delaySeconds}).should('not.exist')
      cy.contains(/Loading|טוען נתונים/g,{timeout:1000*delaySeconds}).should('not.exist')
      //cy.contains(/0 Books selected|0 ספרים נבחרו/g,{timeout:1000*delaySeconds}).should('not.exist')
    })
  }

  if(message.length>0){
    cy.contains(message).should('exist')
  }  

   
})


















